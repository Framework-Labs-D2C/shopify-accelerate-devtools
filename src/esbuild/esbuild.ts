// @ts-ignore
import { ESLint } from "fx-style/eslint";
import { spawn } from "node:child_process";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { transform } from "sucrase";
import { config, root_dir } from "../../shopify-accelerate";
import { isAssetTs, isBlockTs, isClassicBlockTs, isSectionTs } from "../scaffold-theme/parse-files";
import chalk from "chalk";
const { build } = require("esbuild");

// import watch from "node-watch";
const watch = require("node-watch");
const fs = require("fs");
let initialPhase = true;
let pendingEslintWorkers = 0;
let initialEslintWorkersDoneLogged = false;

function markWorkerStarted() {
  pendingEslintWorkers++;
}

function markWorkerFinished() {
  pendingEslintWorkers--;

  // Fire only once, and only when ALL initial workers finished
  if (!initialEslintWorkersDoneLogged && pendingEslintWorkers === 0) {
    initialEslintWorkersDoneLogged = true;
    console.log(`[${chalk.gray(new Date().toLocaleTimeString())}]: ✔ All initial ESLint workers completed & code Prettified`);
  }
}

export const runEslint = (entryFile, tempName, content, filePath) => {
  if (initialPhase) markWorkerStarted();

  const worker = new Worker(
    path.join(__dirname, "eslint-worker.js"), // compiled worker file
    {
      workerData: {
        entryFile,
        tempName,
        content,
        filePath,
        config,
      },
    }
  );

  worker.on("message", (msg) => {
    // your existing logic
    markWorkerFinished(); // <-- add here
  });

  worker.on("error", (err) => {
    console.error(err);
    markWorkerFinished(); // <-- also here
  });

  worker.on("exit", (code) => {
    if (code !== 0) console.error("Worker exit code:", code);
    // if exit happened without "message" triggering finish:
    markWorkerFinished(); // <-- and here
  });
};

/*export const runEslint = async (entryFile, tempName, content, filePath) => {
  // Save the new output to a temporary file for ESLint
  const tempFilePath = path.join(config.project_root, "@utils", "temp_js", `${tempName}__temp.ts`);
  fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
  fs.writeFileSync(tempFilePath, content);

  // Run ESLint Fix
  try {
    const eslint = new ESLint({
      fix: true,
      ignore: false,
      cwd: path.join(config.project_root),
      overrideConfigFile: path.join(config.project_root, "package.json"),
      overrideConfig: {
        rules: {
          "comma-dangle": ["error", "always-multiline"],
          "prettier/prettier": [
            "error",
            {
              plugins: ["prettier-plugin-tailwindcss"],
              trailingComma: "es5",
              arrowParens: "always",
              singleQuote: false,
              bracketSpacing: true,
              printWidth: 130,
              indentChains: true,
              exportCurlySpacing: true,
              importCurlySpacing: true,
              allowBreakAfterOperator: false,
              breakLongMethodChains: true,
              importFormatting: "oneline",
              endOfLine: "auto",
              ignorePath: null,
              withNodeModules: true,
            },
          ],
          "@typescript-eslint/no-require-imports": "off",
          "react/jsx-curly-brace-presence": "off",
          "next/no-html-link-for-pages": "off",
          "typescript-sort-keys/interface": 0,
          "sort-keys-fix/sort-keys-fix": 0,
          "import/no-anonymous-default-export": 0,
          "react/no-unescaped-entities": 0,
          "react/jsx-sort-props": 0,
          "node/no-unpublished-require": 0,
          "@next/next/no-img-element": 0,
          "no-irregular-whitespace": "off",
          "max-len": [
            "off",
            {
              code: 130,
            },
          ],
        },
        ignorePatterns: ["!node_modules/!**"], // Force ESLint to include fx-style
      },
    });

    const results = await eslint.lintFiles([tempFilePath]);
    const formattedOutput = results[0]?.output ?? content;

    fs.unlinkSync(tempFilePath);
    writeCompareFile(
      filePath,
      formattedOutput
        .replace(/(\s+from\s+")sections\/[^."/]*?\/([^."/]*?).js"/gi, `$1./__section--$2.js"`)
        .replace(/(\s+from\s+")blocks\/[^."/]*?\/([^."/]*?).js"/gi, `$1./__block--$2.js"`)
        .replace(/(\s+from\s+")types\/([^."]*?).js"/gi, `$1./_$2.js"`)
        .replace(/(\s+from\s+")assets\/types.js"/gi, `$1./_types.js"`)
        .replace(/(\s+from\s+")assets\/([^."]*?).js"/gi, `$1./_$2.js"`),
      (updated) => {
        const declarationFilePath = filePath.replace(/\.js$/gi, ".d.ts");

        // emitDtsForFile(entryFile, declarationFilePath);
        if (updated || !fs.existsSync(declarationFilePath)) {
          emitDtsForFile(entryFile, declarationFilePath);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};*/

const runEsBuildBundle = () => {
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
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");

  const outFile = path.join(root_dir, config.theme_path, "assets", `__section--${name}`);

  const { code } = transform(fs.readFileSync(entryFile, "utf8"), {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  queueMicrotask(() => {
    runEslint(entryFile, `section__${name}`, code, outFile);
    /*exec(`eslint ${outFile} --fix`, (error, stdout, stderr) => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(`/${outFile.split(/[\\/]/).at(-1)} Prettified`)}`
      );
    });*/
  });
  /*build({
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
    });*/
};

const runAssetsJsEsbuild = (entryFile) => {
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");

  const outFile = path.join(root_dir, config.theme_path, "assets", `_${name}`);

  const { code } = transform(fs.readFileSync(entryFile, "utf8"), {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  queueMicrotask(() => {
    runEslint(entryFile, `asset__${name}`, code, outFile);
    /*exec(`eslint ${outFile} --fix`, (error, stdout, stderr) => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(`/${outFile.split(/[\\/]/).at(-1)} Prettified`)}`
      );
    });*/
  });
  /*build({
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
    });*/
};

const runBlockJsEsbuild = (entryFile) => {
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");

  const outFile = path.join(root_dir, config.theme_path, "assets", `__block--${name}`);

  const { code } = transform(fs.readFileSync(entryFile, "utf8"), {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  queueMicrotask(() => {
    runEslint(entryFile, `block__${name}`, code, outFile);
    /*exec(`eslint ${outFile} --fix`, (error, stdout, stderr) => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(`/${outFile.split(/[\\/]/).at(-1)} Prettified`)}`
      );
    });*/
  });

  /*build({
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
    });*/
};

const runClassicBlockJsEsbuild = (entryFile) => {
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");

  const outFile = path.join(root_dir, config.theme_path, "assets", `__classic_block--${name}`);

  const { code } = transform(fs.readFileSync(entryFile, "utf8"), {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  queueMicrotask(() => {
    runEslint(entryFile, `classic_block__${name}`, code, outFile);
    /*exec(`eslint ${outFile} --fix`, (error, stdout, stderr) => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(`/${outFile.split(/[\\/]/).at(-1)} Prettified`)}`
      );
    });*/
  });
  /*build({
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
    });*/
};

export const runEsbuild = () => {
  let running = false;
  watch(root_dir, { recursive: true }, async (event, name) => {
    initialPhase = false; // <-- Only initial workers counted
    if (running || event === "remove") return;
    if (!name.match(/\.(ts)x?$/) || /_schema\.ts$/gi.test(name) || /_presets\.ts$/gi.test(name)) return;
    running = true;

    if (isAssetTs(name)) {
      try {
        runAssetsJsEsbuild(name);
      } catch (err) {
        console.log(err);
      }
      running = false;
      return;
    }

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
      // runEsBuildBundle();
    } catch (err) {
      console.log(err);
    }
    running = false;
  });

  config.sources.assetsTs.forEach((name) => {
    running = true;

    if (isAssetTs(name)) {
      const filename = name.split(/[\\/]/gi).at(-1);

      try {
        runAssetsJsEsbuild(name);
      } catch (err) {
        console.log(err);
      }
      running = false;
      return;
    }
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
  // runEsBuildBundle();
};

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
