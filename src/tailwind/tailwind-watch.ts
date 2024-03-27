import child_process from "child_process";
import fs from "fs";
import path from "path";
import { useGlobals } from "../../shopify-accelerate";
const watch = require("node-watch");

export const runTailwindCSSWatcher = () => {
  const { package_root } = useGlobals.getState();
  const hasConfig = fs.existsSync(path.join(process.cwd(), "tailwind.config.js"));
  const hasPostCss = fs.existsSync(path.join(process.cwd(), "postcss.config.js"));

  /*= =============== Tailwind Watcher ================ */
  child_process.spawn(
    "npx",
    [
      "tailwindcss",
      "--config",
      hasConfig ? "tailwind.config.js" : path.join(package_root, `tailwind`, `tailwind.config.js`),
      "--postcss",
      hasPostCss ? "postcss.config.js" : path.join(package_root, `tailwind`, `postcss.config.js`),
      "-i",
      path.join(process.cwd(), `assets`, `_tailwind.css`),
      "-o",
      path.join(process.cwd(), `assets`, `tailwind_pre_sort.css.liquid`),
      "--watch",
    ],
    {
      shell: true,
      stdio: "inherit",
    }
  );

  /*= =============== Tailwind Reset ================ */
  child_process.spawn(
    "npx",
    [
      "tailwindcss",
      "--config",
      hasConfig ? "tailwind.config.js" : path.join(package_root, `tailwind`, `tailwind.config.js`),
      "--postcss",
      hasPostCss ? "postcss.config.js" : path.join(package_root, `tailwind`, `postcss.config.js`),
      "-i",
      path.join(process.cwd(), `assets`, `_reset.css`),
      "-o",
      path.join(process.cwd(), `assets`, `reset.css.liquid`),
    ],
    {
      shell: true,
      stdio: "inherit",
    }
  );

  /*= =============== Tailwind Plugin Order ================ */
  watch(path.join(process.cwd(), "assets"), { recursive: false }, async (evt, name) => {
    if (!name.match(/tailwind_pre_sort.css.liquid$/)) return;
    const file = fs.readFileSync("./assets/tailwind_pre_sort.css.liquid", { encoding: "utf-8" });

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

    fs.writeFileSync(path.join(process.cwd(), `assets`, `tailwind.css.liquid`), content);
    fs.writeFileSync(path.join(process.cwd(), ".tailwindorder"), classesInOrder.join("\n"));
  });
};
