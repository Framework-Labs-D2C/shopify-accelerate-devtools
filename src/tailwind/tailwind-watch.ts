import child_process from "child_process";
import fs from "fs";
import path from "path";
import { config, root_dir } from "../../shopify-accelerate";
import { deleteFile, readFile } from "../utils/fs";
const watch = require("node-watch");

export const runTailwindCSSWatcher = () => {
  const { package_root } = config;
  const hasConfig = fs.existsSync(path.join(root_dir, "tailwind.config.js"));
  const hasPostCss = fs.existsSync(path.join(root_dir, "postcss.config.js"));
  const inputFile = fs.existsSync(path.join(root_dir, `assets`, `_tailwind.css`));
  const resetInputFile = fs.existsSync(path.join(root_dir, `assets`, `_reset.css`));

  if (!inputFile) {
    console.log("Tailwind Input file not found");
    return;
  }

  const filePath = path.join(root_dir, `assets`, `tailwind_pre_sort.css.liquid`);
  deleteFile(filePath);
  /*= =============== Tailwind Watcher ================ */
  const tailwindConfigPath = path.join(package_root, "src/tailwind/tailwind.config.js");
  const postcssConfigPath = path.join(package_root, "src/tailwind/postcss.config.js");
  const inputCssPath = path.join(root_dir, "assets", "_tailwind.css");

  const gray = (s: string) => `\x1b[90m${s}\x1b[0m`;
  const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
  const green = (s: string) => `\x1b[32m${s}\x1b[0m`;

  const tailwindWatchCommand = [
    "npx tailwindcss",
    `--config "${tailwindConfigPath}"`,
    `--postcss "${postcssConfigPath}"`,
    `-i "${inputCssPath}"`,
    `-o "${filePath}"`,
    "--watch",
  ].join(" ");

  const tailwindProc = child_process.spawn(tailwindWatchCommand, {
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
  });

  let tailwindBuffer = "";

  tailwindProc.stdout.on("data", (chunk) => {
    tailwindBuffer += chunk.toString();
    const lines = tailwindBuffer.split(/\r?\n/);
    tailwindBuffer = lines.pop() ?? ""; // keep last partial line

    /*for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed === "Rebuilding...") {
        console.log(`[${gray(new Date().toLocaleTimeString())}]: ${cyan("Tailwind rebuilding…")}`);
      } else if (trimmed.startsWith("Done in")) {
        // e.g. "Done in 858ms."
        console.log(
          `[${gray(new Date().toLocaleTimeString())}]: ${green(`Tailwind build ${trimmed.replace(/^Done in\s*!/i, "")}`)}`
        );
      } else {
        // fallback: anything else Tailwind prints
        console.log(`[${gray(new Date().toLocaleTimeString())}]: ${trimmed}`);
      }
    }*/
  });

  tailwindProc.stderr.on("data", (chunk) => {
    // you can either color this differently or just pass through
    const text = chunk.toString();
    // console.error(`[${gray(new Date().toLocaleTimeString())}]: ${text.trim()}`);
  });

  if (!resetInputFile) {
    console.log("Tailwind Reset Input file not found");
    return;
  }
  /*= =============== Tailwind Reset ================ */

  const resetInputPath = path.join(root_dir, "assets", "_reset.css");
  const resetOutputPath = path.join(root_dir, "assets", "reset.css.liquid");

  const tailwindResetCommand = [
    "npx tailwindcss",
    `--config "${tailwindConfigPath}"`,
    `--postcss "${postcssConfigPath}"`,
    `-i "${resetInputPath}"`,
    `-o "${resetOutputPath}"`,
  ].join(" ");

  child_process.spawn(tailwindResetCommand, {
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
  });

  /*= =============== Tailwind Plugin Order ================ */
  watch(path.join(root_dir, "assets"), { recursive: false, filter: /tailwind_pre_sort\.css\.liquid$/ }, async (evt, name) => {
    if (!name.match(/tailwind_pre_sort.css.liquid$/)) return;
    sortTailwindOutput();
  });
};

/* Splits @container rules to the end of the file and writes tailwind.css.liquid + .tailwindorder */
const sortTailwindOutput = () => {
  if (!fs.existsSync(path.join(root_dir, "./assets/tailwind_pre_sort.css.liquid"))) {
    return;
  }
  const file = readFile(path.join(root_dir, "./assets/tailwind_pre_sort.css.liquid"), {
    encoding: "utf-8",
  });

  const top = file
    .split(/\n}/gi)
    .filter((str) => !/\n@container \(/gi.test(str))
    .join("\n}");
  const bottom = `${file
    .split(/\n}/gi)
    .filter((str) => /\n@container \(/gi.test(str))
    .join("\n}")}\n}`;
  const content = top + bottom;

  const classesInOrder = [];
  const omitCompoundClasses = [":not", ":where", ">", "*", ","];

  content.split("\n").forEach((line) => {
    if (!line.startsWith(".")) {
      return;
    }

    let writeOut = true;

    omitCompoundClasses.forEach((classToOmit) => {
      if (line.includes(classToOmit)) {
        writeOut = false;
        return;
      }
    });

    if (writeOut) {
      const finalClassName = line.replace(/\./g, "").replace(/{/g, "").replace(/}/g, "").replace(/\\/g, "").trim();
      if (finalClassName !== "") {
        classesInOrder.push(`${finalClassName}`);
      }
    }
  });

  fs.writeFileSync(path.join(root_dir, `assets/tailwind.css.liquid`), content);
  fs.writeFileSync(path.join(process.cwd(), ".tailwindorder"), classesInOrder.join("\n"));
};

/* One-shot Tailwind compile (main + reset), then the same class sort the watcher runs */
export const buildTailwindCSS = async () => {
  const { package_root } = config;
  const inputCssPath = path.join(root_dir, "assets", "_tailwind.css");
  const resetInputPath = path.join(root_dir, "assets", "_reset.css");

  if (!fs.existsSync(inputCssPath)) {
    console.log("Tailwind Input file not found");
    return true;
  }

  const run = (input: string, output: string) =>
    new Promise<boolean>((resolve) => {
      const command = [
        "npx tailwindcss",
        `--config "${path.join(package_root, "src/tailwind/tailwind.config.js")}"`,
        `--postcss "${path.join(package_root, "src/tailwind/postcss.config.js")}"`,
        `-i "${input}"`,
        `-o "${output}"`,
      ].join(" ");

      const proc = child_process.spawn(command, { shell: true, stdio: ["inherit", "inherit", "pipe"] });
      let stderr = "";
      proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));
      proc.on("close", (code) => {
        if (code !== 0) console.error(stderr.trim());
        resolve(code === 0);
      });
    });

  const preSortPath = path.join(root_dir, "assets", "tailwind_pre_sort.css.liquid");
  deleteFile(preSortPath);

  const [mainOk, resetOk] = await Promise.all([
    run(inputCssPath, preSortPath),
    fs.existsSync(resetInputPath) ? run(resetInputPath, path.join(root_dir, "assets", "reset.css.liquid")) : true,
  ]);

  if (mainOk) sortTailwindOutput();

  return mainOk && resetOk;
};
