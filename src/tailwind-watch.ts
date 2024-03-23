import child_process from "child_process";
import fs from "fs";
import path from "path";

export const runTailwindCSSWatcher = () => {
  if (!fs.existsSync(path.join(process.cwd(), "tailwind.config.js"))) {
    fs.copyFileSync(
      path.join(__dirname, "template", "tailwind.config.js"),
      path.join(process.cwd(), "tailwind.config.js")
    );
  }
  if (!fs.existsSync(path.join(process.cwd(), "postcss.config.js"))) {
    fs.copyFileSync(
      path.join(__dirname, "template", "postcss.config.js"),
      path.join(process.cwd(), "postcss.config.js")
    );
  }
  child_process.spawn(
    "npx",
    [
      "tailwindcss",
      "--config",
      "tailwind.config.js",
      "--postcss",
      "postcss.config.js",
      "-i",
      path.join(process.cwd(), `/assets/_tailwind.css`).replace(/\\/gi, "/"),
      "-o",
      path.join(process.cwd(), `/assets/tailwind_pre_sort.css.liquid`).replace(/\\/gi, "/"),
      "--watch",
    ],
    {
      shell: true,
      stdio: "inherit",
    }
  );
  child_process.spawn(
    "npx",
    [
      "tailwindcss",
      "--config",
      "tailwind.config.js",
      "--postcss",
      "postcss.config.js",
      "-i",
      path.join(process.cwd(), `/assets/_reset.css`).replace(/\\/gi, "/"),
      "-o",
      path.join(process.cwd(), `/assets/reset.css.liquid`).replace(/\\/gi, "/"),
    ],
    {
      shell: true,
      stdio: "inherit",
    }
  );
};
