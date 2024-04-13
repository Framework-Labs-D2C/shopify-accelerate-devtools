import path from "path";
import { config } from "../../shopify-accelerate";
import { isBlockTs, isSectionTs } from "../scaffold-theme/parse-files";

const { build } = require("esbuild");

// import watch from "node-watch";
const watch = require("node-watch");
const fs = require("fs");

const runEsBuild = () => {
  build({
    entryPoints: [
      path.join(process.cwd(), "assets", "theme.ts"),
      path.join(process.cwd(), "assets", "editor.ts"),
    ],
    metafile: true,
    target: "es2020",
    // sourcemap: "external",
    treeShaking: true,
    bundle: true,
    // outfile: "./assets/theme.js",
    outdir: path.join(process.cwd(), "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    // splitting: true,
  })
    .then((e) => {
      console.log("theme.js - bundled");
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

const runSectionJsEsbuild = (entryFile) => {
  build({
    entryPoints: [entryFile],
    metafile: true,
    target: "es2020",
    // sourcemap: "external",
    treeShaking: true,
    // bundle: true,
    outfile: path.join(
      process.cwd(),
      config.theme_path,
      "assets",
      `__section--${entryFile
        .split(/[\\/]/gi)
        .at(-1)
        .replace(/\.(ts)x?$/gi, ".js")}`
    ),
    // outdir: path.join(process.cwd(), config.theme_path, "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    // splitting: true,
  })
    .then((e) => {
      console.log("theme.js - bundled");
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

const runBlockJsEsbuild = (entryFile) => {
  build({
    entryPoints: [entryFile],
    metafile: true,
    target: "es2020",
    // sourcemap: "external",
    treeShaking: true,
    // bundle: true,
    outfile: path.join(
      process.cwd(),
      config.theme_path,
      "assets",
      `__block--${entryFile
        .split(/[\\/]/gi)
        .at(-1)
        .replace(/\.(ts)x?$/gi, ".js")}`
    ),
    // outdir: path.join(process.cwd(), config.theme_path, "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    // splitting: true,
  })
    .then((e) => {
      console.log("theme.js - bundled");
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

export const runEsbuild = () => {
  let running = false;
  watch(process.cwd(), { recursive: true }, async (event, name) => {
    if (running || event === "remove") return;
    if (!name.match(/\.(ts)x?$/) || /schema\.ts$/gi.test(name)) return;
    running = true;

    if (isSectionTs(name)) {
      const filename = name.split(/[\\/]/gi).at(-1);

      const section = Object.values(config.sources.sectionSchemas).find((section) =>
        section.path.includes(name.replace(filename, ""))
      );

      if (section && !section.disabled) {
        try {
          runSectionJsEsbuild(name);
        } catch (err) {
          console.log(err);
        }
      }
      running = false;
      return;
    }

    if (isBlockTs(name)) {
      const filename = name.split(/[\\/]/gi).at(-1);

      const block = Object.values(config.sources.blockSchemas).find((block) =>
        block.path.includes(name.replace(filename, ""))
      );

      if (block && !block.disabled) {
        try {
          runBlockJsEsbuild(name);
        } catch (err) {
          console.log(err);
        }
      }
      running = false;
      return;
    }

    try {
      runEsBuild();
    } catch (err) {
      console.log(err);
    }
    running = false;
  });

  config.sources.sectionsJs.forEach((name) => {
    running = true;

    if (isSectionTs(name)) {
      const filename = name.split(/[\\/]/gi).at(-1);

      const section = Object.values(config.sources.sectionSchemas).find((section) =>
        section.path.includes(name.replace(filename, ""))
      );

      if (section && !section.disabled) {
        try {
          runSectionJsEsbuild(name);
        } catch (err) {
          console.log(err);
        }
      }
      running = false;
      return;
    }
  });

  config.sources.blocksJs.forEach((name) => {
    running = true;
    if (isBlockTs(name)) {
      const filename = name.split(/[\\/]/gi).at(-1);

      const block = Object.values(config.sources.blockSchemas).find((block) =>
        block.path.includes(name.replace(filename, ""))
      );

      if (block && !block.disabled) {
        try {
          runBlockJsEsbuild(name);
        } catch (err) {
          console.log(err);
        }
      }
      running = false;
      return;
    }
  });
  runEsBuild();
};
