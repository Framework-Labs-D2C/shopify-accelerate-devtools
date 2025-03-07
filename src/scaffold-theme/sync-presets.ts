import chalk from "chalk";
import equal from "fast-deep-equal/es6";

// @ts-ignore
import { ESLint } from "fx-style/eslint";
import importFresh from "import-fresh";

import fs from "node:fs";
import path from "node:path";
import { generateCardsTypes } from "./generate-card-types";
import { generateClassicBlocksTypes } from "./generate-classic-blocks-types";
import { generateLiquidFiles } from "./generate-liquid-files";
import { generateSchemaLocales } from "./generate-schema-locales";
import { generateSchemaVariables } from "./generate-schema-variables";
import { generateSectionsTypes } from "./generate-section-types";
import { generateSettingTypes } from "./generate-setting-types";
import { generateThemeBlocksTypes } from "./generate-theme-blocks-types";
import { getSchemaSources, getTargets } from "./parse-files";
import { parseLocales } from "./parse-locales";
import { Sections } from "types/sections";
import { MapBlocksPresetObject, ShopifySection, ShopifySectionBlock, ShopifySectionPreset } from "types/shopify";
import { config } from "../../shopify-accelerate";
import { readFile, writeCompareFile } from "../../src/utils/fs";
import { toCamelCase, toPascalCase } from "../../src/utils/to-pascal-case";

export const syncPresets = async (watch = false) => {
  if (!config.sync_presets) {
    return;
  }
  const startTime = Date.now();
  const completed = [];

  await new Promise((resolve, reject) => {
    const count = 0;
    const templates = [
      ...new Set([
        ...config.targets.sectionGroups,
        ...config.targets.configs,
        ...config.targets.templates,
        ...config.targets.customerTemplates,
      ]),
    ];

    const templateData: { [T: string]: Sections }[] = [];
    templates.forEach((template) => {
      if (/[\\/]config[\\/]/gi.test(template)) return;
      const content = readFile(template);
      eval(`"use strict";
      templateData.push(${content})`);
    });

    const presets: {
      [T: string]: {
        schema: ShopifySection & { path: string; folder: string };
        named: { [T: string]: ShopifySectionPreset[] };
        unnamed: { [T: string]: ShopifySectionPreset[] };
        primary: { [T: string]: ShopifySectionPreset[] };
        development: { [T: string]: ShopifySectionPreset[] };
      };
    } = {};

    const formatObject = (obj, indent = 2, level = 0) => {
      if (obj === null) return "null";
      if (typeof obj === "boolean" || typeof obj === "number") return obj.toString();

      if (typeof obj === "string") {
        // Use backticks for multiline strings, otherwise use double quotes
        if (obj.includes("\n") || obj.includes('"')) {
          return `\`${obj.replace(/`/g, "\\`")}\``; // Escape backticks
        }
        return `"${obj}"`; // Always use double quotes
      }

      const spacing = " ".repeat(level * indent);
      const nextSpacing = " ".repeat((level + 1) * indent);

      if (Array.isArray(obj)) {
        return `[\n${obj.map((item) => `${nextSpacing}${formatObject(item, indent, level + 1)}`).join(",\n")}\n${spacing}]`;
      }

      if (typeof obj === "object") {
        return `{\n${Object.entries(obj)
          .map(([key, value]) => `${nextSpacing}${key}: ${formatObject(value, indent, level + 1)}`)
          .join(",\n")}\n${spacing}}`;
      }

      return obj.toString();
    };

    const mapPresetBlocks = (blocks: { [C: string]: MapBlocksPresetObject }) => {
      // @ts-ignore
      return Object.values(blocks)?.map(({ block_order, disabled, blocks, ...block }) => {
        const returnBlock = {
          ...block,
        };
        if (blocks) {
          // @ts-ignore
          returnBlock.blocks = mapPresetBlocks(blocks);
        }

        return returnBlock;
      });
    };

    templateData.forEach((template) => {
      Object.values(template?.sections ?? {})?.forEach((section) => {
        const sectionSchema = config.sources.sectionSchemas[toCamelCase(section.type)];
        const name = sectionSchema?.name;
        presets[`${section.type}`] ??= {
          schema: sectionSchema,
          named: {},
          unnamed: {},
          primary: {},
          development: {},
        };
        if (
          section?.settings?.section_id &&
          section.settings?.generate_presets !== "always" &&
          section.settings?.generate_presets !== "development" &&
          name
        ) {
          presets[`${section.type}`]["named"][`${section.settings?.section_id || name}`] ??= [];
          presets[`${section.type}`]["named"][`${section.settings?.section_id || name}`].push(section);
        }
        if (
          !section?.settings?.section_id &&
          section.settings?.generate_presets !== "always" &&
          section.settings?.generate_presets !== "development" &&
          name
        ) {
          presets[`${section.type}`]["unnamed"][`${section.settings?.section_id || name}`] ??= [];
          presets[`${section.type}`]["unnamed"][`${section.settings?.section_id || name}`].push(section);
        }
        if (section.settings?.generate_presets === "always" && (section?.settings?.section_id || name)) {
          presets[`${section.type}`]["primary"][`${section.settings?.section_id || name}`] ??= [];
          presets[`${section.type}`]["primary"][`${section.settings?.section_id || name}`].push(section);
        }
        if (section.settings?.generate_presets === "development" && (section?.settings?.section_id || name)) {
          presets[`${section.type}`]["development"][`${section.settings?.section_id || name}`] ??= [];
          presets[`${section.type}`]["development"][`${section.settings?.section_id || name}`].push(section);
        }
      });
    });

    Object.entries(presets ?? {}).forEach(([type, { schema, named, unnamed, primary, development }], i, arr) => {
      const filePath = path.join(config.folders.sections, schema.folder, "_presets.ts");
      const sourceJson = importFresh(filePath)[`${toCamelCase(type)}Presets`]?.filter((preset) => preset.manual_preset) ?? [];
      const content = readFile(filePath);

      Object.entries(primary).forEach(([name, presets]) => {
        const filteredPresets = presets?.filter((a, i, arr) => arr.findIndex((b) => equal(a, b)) === i);

        filteredPresets.forEach((preset) => {
          if (sourceJson.some((preset) => preset.name === name)) {
            return;
          }
          const presetObject: ShopifySectionPreset = {
            name: name,
          };
          if (preset.settings) {
            presetObject.settings = preset.settings;
          }
          if (preset.blocks) {
            // @ts-ignore
            presetObject.blocks = mapPresetBlocks(preset.blocks);
          }
          sourceJson.push(presetObject);
        });
      });

      if (sourceJson.length <= 0) {
        Object.entries(named).forEach(([name, presets], index) => {
          if (index > 0) return;
          if (sourceJson.some((preset) => preset.name === name)) {
            return;
          }
          const preset = presets[0];

          const presetObject: ShopifySectionPreset = {
            name: name,
            development_only: true,
          };
          if (preset.settings) {
            presetObject.settings = preset.settings;
          }
          if (preset.blocks) {
            // @ts-ignore
            presetObject.blocks = mapPresetBlocks(preset.blocks);
          }
          sourceJson.push(presetObject);
        });
      }

      if (sourceJson.length <= 0) {
        Object.entries(unnamed).forEach(([name, presets], index) => {
          if (index > 0) return;
          if (sourceJson.some((preset) => preset.name === name)) {
            return;
          }
          const preset = presets[0];

          const presetObject: ShopifySectionPreset = {
            name: name,
            development_only: true,
          };
          if (preset.settings) {
            presetObject.settings = preset.settings;
          }
          if (preset.blocks) {
            // @ts-ignore
            presetObject.blocks = mapPresetBlocks(preset.blocks);
          }
          sourceJson.push(presetObject);
        });
      }

      Object.entries(development).forEach(([name, presets]) => {
        const filteredPresets = presets?.filter((a, i, arr) => arr.findIndex((b) => equal(a, b)) === i);

        filteredPresets.forEach((preset) => {
          if (sourceJson.some((preset) => preset.name === name)) {
            return;
          }
          const presetObject: ShopifySectionPreset = {
            name: name,
            development_only: true,
          };
          if (preset.settings) {
            presetObject.settings = preset.settings;
          }
          if (preset.blocks) {
            // @ts-ignore
            presetObject.blocks = mapPresetBlocks(preset.blocks);
          }
          sourceJson.push(presetObject);
        });
      });

      if (sourceJson.length <= 0) {
        sourceJson.push({ name: schema.name });
      }

      // console.log({ [type]: sourceJson });
      const output = [];
      output.push(`import { ShopifySectionPreset } from "types/shopify";`);
      output.push(`import { ${toPascalCase(type)}Section } from "types/sections";`);
      output.push(``);
      output.push(
        `export const ${toCamelCase(type)}Presets: ShopifySectionPreset<${toPascalCase(type)}Section>[] = ${formatObject(
          sourceJson,
          2
        )};`
      );

      // Save the formatted output to a temporary file
      const tempFilePath = path.join(config.project_root, "@utils", "temp", `${type}__temp.ts`);
      fs.writeFileSync(tempFilePath, output.join("\n"), "utf8");

      // Run ESLint Fix Programmatically
      const runEslintFix = async () => {
        try {
          const eslint = new ESLint({
            fix: true,
            ignore: false,
            cwd: path.join(config.project_root, "package.json"),
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
              },
              ignorePatterns: ["!node_modules/**"], // Force ESLint to include fx-style
            },
          });

          const results = await eslint.lintFiles([tempFilePath]);

          // Apply the fixes
          if (results[0].output) {
            fs.unlinkSync(tempFilePath);
            return results[0].output;
          } else {
            console.log(results[0], results[0]?.messages);
            throw new Error(`Could not transform presets: ${type}: ${schema.folder}`);
          }
        } finally {
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        }
      };

      // Execute ESLint fix
      runEslintFix()
        .then((res) => {
          writeCompareFile(filePath, res, (updated) => {
            completed.push(updated);
          });
        })
        .catch((e) => {
          console.error(e);
          completed.push(false);
        })
        .finally(() => {
          if (completed?.length === arr?.length) {
            resolve(true);
          }
        });
    });
  });

  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(`${Date.now() - startTime}ms`)}] ${chalk.cyan(
      `Presets Synchronized with theme ID: ${config.theme_id} - ${config.theme_path}`
    )}`
  );

  console.log(
    { watch },
    completed.some((updated) => updated)
  );
  if (watch && completed.some((updated) => updated)) {
    getTargets();
    await getSchemaSources();
    parseLocales();
    generateSchemaVariables();
    generateSchemaLocales();
    generateSectionsTypes();
    generateThemeBlocksTypes();
    generateClassicBlocksTypes();
    generateCardsTypes();
    generateSettingTypes();
    generateLiquidFiles();
  }
};
