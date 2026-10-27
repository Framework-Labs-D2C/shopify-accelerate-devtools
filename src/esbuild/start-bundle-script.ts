import fs from "fs";

// @ts-ignore
import { spawn } from "node:child_process";
import path from "node:path";
import { config, root_dir } from "../../shopify-accelerate";

type BundleOpts = { watch?: boolean; theme?: string; debug?: boolean };
export const startBundleScripts = (opts: BundleOpts = {}) => {
  const script = path.join(root_dir, config.theme_path, "assets", "bundle-scripts.js");
  if (!fs.existsSync(script)) {
    console.error(`[bundle] Not found: ${script}`);
    return;
  }

  const args = [];
  if (opts.watch) args.push("--watch");
  if (opts.debug) args.push("--debug");

  const child = spawn(process.execPath, [script, ...args], {
    stdio: "inherit",
    env: { ...process.env, BROWSERSLIST_IGNORE_OLD_DATA: "1" },
    cwd: process.cwd(),
  });

  child.on("close", (code) => {
    if (code !== 0) console.error(`[bundle] exited with code ${code}`);
  });

  return child;
};

/* One-shot bundle. bundle-scripts.js reports esbuild failures on stderr with exit code 0, so stderr is checked too. */
export const buildBundleScripts = () =>
  new Promise<void>((resolve, reject) => {
    const script = path.join(root_dir, config.theme_path, "assets", "bundle-scripts.js");
    if (!fs.existsSync(script)) {
      console.log(`[bundle] Not found, skipped: ${script}`);
      resolve();
      return;
    }

    // Put this package's esbuild on PATH so bundle-scripts.js doesn't fall back to `npx esbuild` (network)
    const esbuildBin = path.join(path.dirname(require.resolve("esbuild/package.json")), "bin");

    const child = spawn(process.execPath, [script], {
      stdio: ["ignore", "inherit", "pipe"],
      env: {
        ...process.env,
        BROWSERSLIST_IGNORE_OLD_DATA: "1",
        PATH: [esbuildBin, process.env.PATH].join(path.delimiter),
      },
      cwd: process.cwd(),
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      process.stderr.write(chunk);
    });

    child.on("close", (code) => {
      if (code !== 0 || /\[bundle\]/.test(stderr)) {
        reject(new Error(`bundle-scripts.js failed (exit code ${code})`));
        return;
      }
      resolve();
    });
  });
