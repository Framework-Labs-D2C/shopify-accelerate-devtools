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
