// @ts-ignore
import chalk from "chalk";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { transform } from "sucrase";
import { config, root_dir } from "../../shopify-accelerate";
import { isAssetTs, isBlockTs, isClassicBlockTs, isSectionTs } from "../scaffold-theme/parse-files";

const { build } = require("esbuild");

// import watch from "node-watch";
const watch = require("node-watch");
const fs = require("fs");

let initialPhase = true;
let pendingEslintWorkers = 0;
let initialEslintWorkersDoneLogged = false;

const getLastEdit = (s) => {
  const i = s.lastIndexOf("LAST EDIT:");
  if (i === -1) return NaN;
  const start = i + 10;
  const end = s.indexOf("*/", start);
  return Number(s.slice(start, end).trim());
};

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

  const worker = new Worker(path.join(__dirname, "eslint-worker.js"), {
    workerData: {
      entryFile,
      tempName,
      content,
      filePath,
      config,
    },
  });

  worker.on("message", () => {
    markWorkerFinished();
  });

  worker.on("error", (err) => {
    console.error(err);
    markWorkerFinished();
  });

  worker.on("exit", (code) => {
    if (code !== 0) console.error("Worker exit code:", code);
    markWorkerFinished();
  });
};

// ----------------------------
// Debounce util (per key)
// ----------------------------
const debounceByKey = (fn, wait = 120) => {
  const timers = new Map();

  return (key, ...args) => {
    const t = timers.get(key);
    if (t) clearTimeout(t);

    timers.set(
      key,
      setTimeout(() => {
        timers.delete(key);
        fn(...args);
      }, wait)
    );
  };
};

// ----------------------------
// ESBuild functions
// ----------------------------
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
    treeShaking: true,
    bundle: true,
    outdir: path.join(root_dir, "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    plugins: [],
    platform: "browser",
  })
    .then(() => {
      console.log("theme.js/editor.js - bundled");
    })
    .catch((error) => {
      console.error(error);
    });
};

const runSectionJsEsbuild = async (entryFile, watchTrigger = false) => {
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");
  const outFile = path.join(root_dir, config.theme_path, "assets", `__section--${name}`);

  if (!watchTrigger && !config.rebuild_eslint) {
    try {
      await fs.promises.access(outFile, fs.constants.F_OK);
      return;
    } catch {
      /* empty */
    }
  }

  const { mtimeMs } = await fs.promises.stat(entryFile);
  const entryLastEditedAt = Math.floor(mtimeMs);

  let outputLastEditedAt = NaN;
  try {
    const outSrc = await fs.promises.readFile(outFile, "utf8");
    outputLastEditedAt = getLastEdit(outSrc);
  } catch {
    /* empty */
  }

  if (outputLastEditedAt === entryLastEditedAt) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
        `No Change: Skipped JS compile on '${entryFile.split(/[\\/]/).at(-1)}'`
      )}`
    );
    return;
  }

  const entrySrc = await fs.promises.readFile(entryFile, "utf8");

  const { code } = transform(entrySrc, {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  const editedCode = `${code}\n\n/* LAST EDIT: ${entryLastEditedAt} */`;

  queueMicrotask(() => {
    runEslint(entryFile, `section__${name}`, editedCode, outFile);
  });
};

const runAssetsJsEsbuild = async (entryFile, watchTrigger = false) => {
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");
  const outFile = path.join(root_dir, config.theme_path, "assets", `_${name}`);

  if (!watchTrigger && !config.rebuild_eslint) {
    try {
      await fs.promises.access(outFile, fs.constants.F_OK);
      return;
    } catch {
      /* empty */
    }
  }

  const { mtimeMs } = await fs.promises.stat(entryFile);
  const entryLastEditedAt = Math.floor(mtimeMs);

  let outputLastEditedAt = NaN;
  try {
    const outSrc = await fs.promises.readFile(outFile, "utf8");
    outputLastEditedAt = getLastEdit(outSrc);
  } catch {
    /* empty */
  }

  if (outputLastEditedAt === entryLastEditedAt) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
        `No Change: Skipped JS compile on '${entryFile.split(/[\\/]/).at(-1)}'`
      )}`
    );
    return;
  }

  const entrySrc = await fs.promises.readFile(entryFile, "utf8");

  const { code } = transform(entrySrc, {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  const editedCode = `${code}\n\n/* LAST EDIT: ${entryLastEditedAt} */`;

  queueMicrotask(() => {
    runEslint(entryFile, `asset__${name}`, editedCode, outFile);
  });
};

const runBlockJsEsbuild = async (entryFile, watchTrigger = false) => {
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");
  const outFile = path.join(root_dir, config.theme_path, "assets", `__block--${name}`);

  if (!watchTrigger && !config.rebuild_eslint) {
    try {
      await fs.promises.access(outFile, fs.constants.F_OK);
      return;
    } catch {
      /* empty */
    }
  }

  const { mtimeMs } = await fs.promises.stat(entryFile);
  const entryLastEditedAt = Math.floor(mtimeMs);

  let outputLastEditedAt = NaN;
  try {
    const outSrc = await fs.promises.readFile(outFile, "utf8");
    outputLastEditedAt = getLastEdit(outSrc);
  } catch {
    /* empty */
  }

  if (outputLastEditedAt === entryLastEditedAt) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
        `No Change: Skipped JS compile on '${entryFile.split(/[\\/]/).at(-1)}'`
      )}`
    );
    return;
  }

  const entrySrc = await fs.promises.readFile(entryFile, "utf8");

  const { code } = transform(entrySrc, {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  const editedCode = `${code}\n\n/* LAST EDIT: ${entryLastEditedAt} */`;

  queueMicrotask(() => {
    runEslint(entryFile, `block__${name}`, editedCode, outFile);
  });
};

const runClassicBlockJsEsbuild = async (entryFile, watchTrigger = false) => {
  const name = entryFile
    .split(/[\\/]/gi)
    .at(-1)
    .replace(/\.(ts)x?$/gi, ".js");
  const outFile = path.join(root_dir, config.theme_path, "assets", `__classic_block--${name}`);

  if (!watchTrigger && !config.rebuild_eslint) {
    try {
      await fs.promises.access(outFile, fs.constants.F_OK);
      return;
    } catch {
      /* empty */
    }
  }

  const { mtimeMs } = await fs.promises.stat(entryFile);
  const entryLastEditedAt = Math.floor(mtimeMs);

  let outputLastEditedAt = NaN;
  try {
    const outSrc = await fs.promises.readFile(outFile, "utf8");
    outputLastEditedAt = getLastEdit(outSrc);
  } catch {
    /* empty */
  }

  if (outputLastEditedAt === entryLastEditedAt) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
        `No Change: Skipped JS compile on '${entryFile.split(/[\\/]/).at(-1)}'`
      )}`
    );
    return;
  }

  const entrySrc = await fs.promises.readFile(entryFile, "utf8");

  const { code } = transform(entrySrc, {
    transforms: ["typescript"],
    disableESTransforms: true,
  });

  const editedCode = `${code}\n\n/* LAST EDIT: ${entryLastEditedAt} */`;

  queueMicrotask(() => {
    runEslint(entryFile, `classic_block__${name}`, editedCode, outFile);
  });
};

// ----------------------------
// Main watcher: debounced per file
// ----------------------------
export const runEsbuild = () => {
  // Debounce only watcher-triggered builds (per entry file path)
  const runDebounced = debounceByKey(async (filePath) => {
    try {
      if (isAssetTs(filePath)) {
        await runAssetsJsEsbuild(filePath, true);
        return;
      }

      if (isSectionTs(filePath)) {
        const filename = filePath.split(/[\\/]/gi).at(-1);

        const section = Object.values(config.sources.sectionSchemas).find((section) =>
          section.path.includes(filePath.replace(filename, ""))
        );

        if (section && !section.disabled) {
          await runSectionJsEsbuild(filePath, true);
        }
        return;
      }

      if (isBlockTs(filePath)) {
        const filename = filePath.split(/[\\/]/gi).at(-1);

        const block = Object.values(config.sources.blockSchemas).find((block) =>
          block.path.includes(filePath.replace(filename, ""))
        );

        if (block && !block.disabled) {
          await runBlockJsEsbuild(filePath, true);
        }
        return;
      }

      if (isClassicBlockTs(filePath)) {
        const filename = filePath.split(/[\\/]/gi).at(-1);

        const block = Object.values(config.sources.classic_blockSchemas).find((block) =>
          block.path.includes(filePath.replace(filename, ""))
        );

        if (block && !block.disabled) {
          await runClassicBlockJsEsbuild(filePath, true);
        }
        return;
      }

      // runEsBuildBundle();
    } catch (err) {
      console.log(err);
    }
  }, 500);

  watch(
    Object.values(config.folders)?.filter(
      (folder) =>
        fs.existsSync(folder) &&
        !folder?.includes("templates") &&
        !folder?.includes("@utils") &&
        !folder?.includes("@types") &&
        !folder?.includes("config") &&
        !folder?.includes("snippets") &&
        !folder?.includes("layout")
    ),
    { recursive: true, filter: /\.tsx?$/gi },
    async (event, name) => {
      initialPhase = false;
      if (event === "remove") return;
      if (!name.match(/\.(ts)x?$/) || /_schema\.ts$/gi.test(name) || /_presets\.ts$/gi.test(name)) return;

      // 👇 This is the only call — nothing runs until debounce fires
      runDebounced(name, name);
    }
  );

  if (!config.rebuild_eslint) {
    console.log(
      `[${chalk.gray(
        new Date().toLocaleTimeString()
      )}]: Initial ESBuild run Ignored. Activate ESBuild initial run by adding "-- rebuild-js" to the CLI command.`
    );
  }

  if (config.rebuild_eslint) {
    console.log(`[${chalk.gray(new Date().toLocaleTimeString())}]: Full ESBuild run Initiated.`);
  }

  // Initial compile runs (not debounced)
  config.sources.assetsTs.forEach((name) => {
    if (isAssetTs(name)) {
      try {
        runAssetsJsEsbuild(name);
      } catch (err) {
        console.log(err);
      }
    }
  });

  config.sources.sectionsJs.forEach((name) => {
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
    }
  });

  config.sources.blocksJs.forEach((name) => {
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
    }
  });

  config.sources.classic_blocksJs.forEach((name) => {
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
    }
  });

  // runEsBuildBundle();
};
