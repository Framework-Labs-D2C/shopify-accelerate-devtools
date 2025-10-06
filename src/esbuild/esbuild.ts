import path from "path";
import { readFile } from "../utils/fs";
import { config, root_dir } from "../../shopify-accelerate";
import { isBlockTs, isClassicBlockTs, isSectionTs } from "../scaffold-theme/parse-files";

const { build } = require("esbuild");

// import watch from "node-watch";
const watch = require("node-watch");
const fs = require("fs");

const runEsBuild = () => {
  const entryPoints = [];
  if (fs.existsSync(path.join(root_dir, "assets", "theme.ts"))) {
    entryPoints.push(path.join(root_dir, "assets", "theme.ts"));
  }

  if (fs.existsSync(path.join(root_dir, "assets", "editor.ts"))) {
    entryPoints.push(path.join(root_dir, "assets", "editor.ts"));
  }
  if (!entryPoints.length) {
    console.log("No JS/TS entry files found.");
    return;
  }
  build({
    entryPoints: entryPoints,
    metafile: true,
    target: "es2019",
    // sourcemap: "external",
    treeShaking: true,
    bundle: true,
    // outfile: "./assets/theme.js",
    outdir: path.join(root_dir, "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",

    format: "esm",
    legalComments: "none",
    keepNames: true,
    plugins: [],
    platform: "browser",
    // splitting: true,
  })
    .then((e) => {
      console.log("theme.js/editor.js - bundled");
      // const outFile = path.join(root_dir, "assets", "theme.js");
      // fs.appendFileSync(outFile, `\n//# sourceMappingURL=${path.basename(outFile)}.map`);
      //
      // const outFileEditor = path.join(root_dir, "assets", "editor.js");
      // fs.appendFileSync(outFileEditor, `\n//# sourceMappingURL=${path.basename(outFileEditor)}.map`);

      // const content = readFile(path.join(root_dir, "assets", "editor.js"), {
      //   encoding: "utf-8",
      // });
      //
      // fs.writeFileSync(
      //   path.join(root_dir, "assets", "editor.js"),
      //   `${content}\n ${content.includes("// random_comment") ? "" : "\n// random_comment "}`
      // );
      // const content2 = readFile(path.join(root_dir, "assets", "theme.js"), {
      //   encoding: "utf-8",
      // });
      // fs.writeFileSync(
      //   path.join(root_dir, "assets", "theme.js"),
      //   `${content2}${content.includes("// random_comment") ? "" : "\n// random_comment "} `
      // );
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

const runSectionJsEsbuild = (entryFile) => {
  const outFile = path.join(
    root_dir,
    config.theme_path,
    "assets",
    `__section--${entryFile
      .split(/[\\/]/gi)
      .at(-1)
      .replace(/\.(ts)x?$/gi, ".js")}`
  );
  build({
    entryPoints: [entryFile],
    metafile: true,
    target: "es2019",
    // sourcemap: "external",
    treeShaking: true,
    // bundle: true,
    outfile: outFile,
    // outdir: path.join(root_dir, config.theme_path, "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    plugins: [],
    platform: "browser",
    // splitting: true,
  })
    .then((e) => {
      console.log(
        `__section--${entryFile
          .split(/[\\/]/gi)
          .at(-1)
          .replace(/\.(ts)x?$/gi, ".js")}- bundled`
      );
      // fs.appendFileSync(outFile, `\n//# sourceMappingURL=${path.basename(outFile)}.map`);
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

const runBlockJsEsbuild = (entryFile) => {
  const outFile = path.join(
    root_dir,
    config.theme_path,
    "assets",
    `__block--${entryFile
      .split(/[\\/]/gi)
      .at(-1)
      .replace(/\.(ts)x?$/gi, ".js")}`
  );
  build({
    entryPoints: [entryFile],
    metafile: true,
    target: "es2019",
    // sourcemap: "external",
    treeShaking: true,
    // bundle: true,
    outfile: outFile,
    // outdir: path.join(root_dir, config.theme_path, "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    plugins: [],
    platform: "browser",
    // splitting: true,
  })
    .then((e) => {
      console.log(
        `__block--${entryFile
          .split(/[\\/]/gi)
          .at(-1)
          .replace(/\.(ts)x?$/gi, ".js")} - bundled`
      );
      // fs.appendFileSync(outFile, `\n//# sourceMappingURL=${path.basename(outFile)}.map`);
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

const runClassicBlockJsEsbuild = (entryFile) => {
  const outFile = path.join(
    root_dir,
    config.theme_path,
    "assets",
    `__classic_block--${entryFile
      .split(/[\\/]/gi)
      .at(-1)
      .replace(/\.(ts)x?$/gi, ".js")}`
  );
  build({
    entryPoints: [entryFile],
    metafile: true,
    target: "es2019",
    // sourcemap: "external",
    treeShaking: true,
    // bundle: true,
    outfile: outFile,
    // outdir: path.join(root_dir, config.theme_path, "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    plugins: [],
    platform: "browser",
    // splitting: true,
  })
    .then((e) => {
      console.log(
        `__classic_block--${entryFile
          .split(/[\\/]/gi)
          .at(-1)
          .replace(/\.(ts)x?$/gi, ".js")} - bundled`
      );
      // fs.appendFileSync(outFile, `\n//# sourceMappingURL=${path.basename(outFile)}.map`);
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

export const runEsbuild = () => {
  let running = false;
  watch(root_dir, { recursive: true }, async (event, name) => {
    if (running || event === "remove") return;
    if (!name.match(/\.(ts)x?$/) || /_schema\.ts$/gi.test(name)) return;
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

      const block = Object.values(config.sources.blockSchemas).find((block) => block.path.includes(name.replace(filename, "")));

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

    if (isClassicBlockTs(name)) {
      const filename = name.split(/[\\/]/gi).at(-1);

      const block = Object.values(config.sources.classic_blockSchemas).find((block) =>
        block.path.includes(name.replace(filename, ""))
      );

      if (block && !block.disabled) {
        try {
          runClassicBlockJsEsbuild(name);
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

      const block = Object.values(config.sources.blockSchemas).find((block) => block.path.includes(name.replace(filename, "")));

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
  config.sources.classic_blocksJs.forEach((name) => {
    running = true;
    if (isClassicBlockTs(name)) {
      const filename = name.split(/[\\/]/gi).at(-1);

      const block = Object.values(config.sources.classic_blockSchemas).find((block) =>
        block.path.includes(name.replace(filename, ""))
      );

      if (block && !block.disabled) {
        try {
          runClassicBlockJsEsbuild(name);
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
