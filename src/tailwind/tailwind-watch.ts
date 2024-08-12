import child_process from "child_process";
import fs from "fs";
import path from "path";
import { config, root_dir } from "../../shopify-accelerate";
import { deleteFile } from "../utils/fs";
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
  child_process.spawn(
    "npx",
    [
      "tailwindcss",
      "--config",
      /*hasConfig ? "tailwind.config.js" :*/ path.join(
        package_root,
        `src/tailwind/tailwind.config.js`
      ),
      "--postcss",
      /*hasPostCss ? "postcss.config.js" : */ path.join(
        package_root,
        `src/tailwind/postcss.config.js`
      ),
      "-i",
      path.join(root_dir, `assets`, `_tailwind.css`),
      "-o",
      filePath,
      "--watch",
    ],
    {
      shell: true,
      stdio: "inherit",
    }
  );

  if (!resetInputFile) {
    console.log("Tailwind Reset Input file not found");
    return;
  }
  /*= =============== Tailwind Reset ================ */
  child_process.spawn(
    "npx",
    [
      "tailwindcss",
      "--config",
      /*hasConfig ? "tailwind.config.js" :*/ path.join(
        package_root,
        `src/tailwind/tailwind.config.js`
      ),
      "--postcss",
      /*hasPostCss ? "postcss.config.js" :*/ path.join(
        package_root,
        `src/tailwind/postcss.config.js`
      ),
      "-i",
      path.join(root_dir, `assets`, `_reset.css`),
      "-o",
      path.join(root_dir, `assets`, `reset.css.liquid`),
    ],
    {
      shell: true,
      stdio: "inherit",
    }
  );

  /*= =============== Tailwind Plugin Order ================ */
  watch(path.join(root_dir, "assets"), { recursive: false }, async (evt, name) => {
    if (
      !name.match(/tailwind_pre_sort.css.liquid$/) ||
      !fs.existsSync(path.join(root_dir, "./assets/tailwind_pre_sort.css.liquid"))
    )
      return;
    const file = fs.readFileSync(path.join(root_dir, "./assets/tailwind_pre_sort.css.liquid"), {
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
        const finalClassName = line
          .replace(/\./g, "")
          .replace(/{/g, "")
          .replace(/}/g, "")
          .replace(/\\/g, "")
          .trim();
        if (finalClassName !== "") {
          classesInOrder.push(`${finalClassName}`);
        }
      }
    });

    fs.writeFileSync(path.join(root_dir, `assets/tailwind.css.liquid`), content);
    fs.writeFileSync(path.join(root_dir, ".tailwindorder"), classesInOrder.join("\n"));
  });
};
