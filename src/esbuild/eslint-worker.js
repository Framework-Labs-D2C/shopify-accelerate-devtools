const chalk = require("chalk");
const { parentPort, workerData } = require("node:worker_threads");
const path = require("node:path");
const fs = require("node:fs");
// @ts-ignore
const { ESLint } = require("fx-style/eslint");
const ts = require("typescript");

const writeCompareFile = (file_path, content, successCallback = (updated) => {}) => {
  if (!fs.existsSync(file_path)) {
    const dirname = path.dirname(file_path);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(file_path, content);
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(`Created: ${file_path.replace(process.cwd(), "")}`)}`
    );
    successCallback(true);
    return;
  }

  const contentVerification = fs.readFileSync(file_path, {
    encoding: "utf-8",
  });

  if (contentVerification.replace(/[\n|\s]*$/gi, "") !== content.replace(/[\n|\s]*$/gi, "")) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(`Updated: ${file_path.replace(process.cwd(), "")}`)}`
    );
    fs.writeFileSync(file_path, content);
    successCallback(true);
    return;
  }

  successCallback(false);
};

// 1) COPY your existing emitDtsForFile here (no changes)
const emitDtsForFile = (entryAbs, outFileAbs) => {
  const options = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,

    declaration: true,
    emitDeclarationOnly: true,
    declarationMap: false,
    noEmit: false,

    importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Preserve,
    preserveValueImports: true,
    verbatimModuleSyntax: true,

    removeComments: false,
    sourceMap: false,
    paths: {
      "types/*": ["./@types/*"],
    },
  };

  const host = ts.createCompilerHost(options, true);
  fs.mkdirSync(path.dirname(outFileAbs), { recursive: true });

  let debounceTimer = null;
  const DEBOUNCE_MS = 150;
  let lastContent = "";

  host.writeFile = (fileName, content) => {
    if (fileName.endsWith(".d.ts") && content) {
      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        if (content === lastContent) return;
        lastContent = content;

        writeCompareFile(
          outFileAbs,
          content
            .replace(/(\s+from\s+")sections\/[^."/]*?\/([^."/]*?).js"/gi, `$1./__section--$2.js"`)
            .replace(/(\s+from\s+")blocks\/[^."/]*?\/([^."/]*?).js"/gi, `$1./__block--$2.js"`)
            .replace(/(\s+from\s+")types\/([^."]*?).js"/gi, `$1./_$2.js"`)
            .replace(/(\s+from\s+")assets\/types.js"/gi, `$1./_types.js"`)
            .replace(/(\s+from\s+")assets\/([^."]*?).js"/gi, `$1./_$2.js"`)
        );
      }, DEBOUNCE_MS);
    }
  };

  const program = ts.createProgram({
    rootNames: [entryAbs],
    options,
    host,
  });

  program.emit(undefined, host.writeFile, undefined, true);
};

// 2) COPY your old runEslint body here, just renamed
const runEslintTask = async (entryFile, tempName, content, filePath, config) => {
  const tempFilePath = path.join(config.project_root, "@utils", "temp_js", `${tempName}__temp.ts`);
  fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
  fs.writeFileSync(tempFilePath, content);

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

    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (err) {
      // Ignore "file not found" during cleanup
      if (err && err.code !== "ENOENT") {
        console.error("[eslint worker unlink error]", err);
      }
    }

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
        if (updated || !fs.existsSync(declarationFilePath)) {
          emitDtsForFile(entryFile, declarationFilePath);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// 3) Worker bootstrap – tiny and boring
(async () => {
  const { entryFile, tempName, content, filePath, config } = workerData;

  try {
    await runEslintTask(entryFile, tempName, content, filePath, config);
    parentPort?.postMessage({ ok: true });
  } catch (err) {
    console.error(err);
    parentPort?.postMessage({ ok: false, error: String(err) });
  }
})();
