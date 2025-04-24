import chalk from "chalk";
import equal from "fast-deep-equal/es6";

// @ts-ignore
import { ESLint } from "fx-style/eslint";
import importFresh from "import-fresh";

import fs from "node:fs";
import path from "node:path";
import { formatObject } from "../utils/format-object";
import { Sections } from "types/sections";
import { ShopifySection, ShopifySectionBlock, ShopifySectionBlockPresetMap, ShopifySectionGeneratedThemeBlock, ShopifySectionPreset, ShopifyThemeBlock } from "types/shopify";
import { config } from "../../shopify-accelerate";
import { readFile, writeCompareFile } from "../utils/fs";
import { toCamelCase, toPascalCase } from "../utils/to-pascal-case";
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

/**
 * Formats block type by removing leading underscores and ensuring consistency
 */
const formatBlockType = (blockType: string, folder: string) =>
  `_${folder.replace(/^_*/g, "")}__${blockType}`.replace(
    `_${folder.replace(/^_*/g, "")}___${folder.replace(/^_*/g, "")}__`,
    `_${folder.replace(/^_*/g, "")}__`
  );

const mapPresetBlocks = (
  blocks: ShopifySectionPreset["blocks"],
  containerSchema: (ShopifySection & { path: string; folder: string }) | (ShopifyThemeBlock & { path: string; folder: string }),
  schema?: any
) => {
  schema ??= structuredClone(containerSchema);

  if (schema?.blocks) {
    schema.blocks = schema?.blocks?.reduce((acc, block) => {
      if ("theme_block" in block && block.theme_block) {
        acc.push({
          ...block,
          type: formatBlockType(block.type, schema?.folder),
        });
        return acc;
      }

      if (block.type === "@section_blocks") {
        schema.blocks.forEach((rootBlock) => {
          if (rootBlock.theme_block) {
            acc.push({
              ...rootBlock,
              type: formatBlockType(rootBlock.type, schema?.folder),
            });
          } else {
            acc.push(rootBlock);
          }
        });

        return acc;
      }

      if (!block.name && !["@app", "@classic_theme", "@theme"].includes(block.type)) {
        const potentialBlock = structuredClone(config.sources.blockSchemas[toCamelCase(block.type)]);

        if (potentialBlock?.folder === block.type) {
          acc.push({
            ...potentialBlock,
            type: potentialBlock.folder,
            themeBlock: { ...potentialBlock, type: potentialBlock.folder },
          });
          return acc;
        }

        if (!potentialBlock && block.type.includes("__")) {
          const sectionKey = toCamelCase(block.type.split("__")[0]);
          const section = structuredClone(config.sources.sectionSchemas[sectionKey]);

          const findSectionBlock = (blocks: any[], targetType: string, withSettings = false): any | undefined => {
            for (const sBlock of blocks) {
              const formattedType = sBlock.theme_block ? formatBlockType(sBlock.type, section.folder) : sBlock.type;

              if (formattedType === targetType) return { ...sBlock, type: formattedType };

              if (Array.isArray(sBlock.blocks)) {
                const nestedBlock = findSectionBlock(sBlock.blocks as any[], targetType, withSettings);
                if (withSettings) {
                  if (nestedBlock && nestedBlock.settings) return nestedBlock;
                } else {
                  if (nestedBlock) return nestedBlock;
                }
              }
            }
            return undefined;
          };

          const sectionBlock = section?.blocks
            ? findSectionBlock(section.blocks as any[], block.type, true) || findSectionBlock(section.blocks as any[], block.type)
            : undefined;

          if (sectionBlock) {
            acc.push({ ...sectionBlock, cross_section: true, themeBlock: section });
            return acc;
          }
        }
      }
      acc.push(block);
      return acc;
    }, []);
  }

  if (containerSchema?.blocks) {
    containerSchema.blocks = containerSchema?.blocks?.reduce((acc, block) => {
      if ("theme_block" in block && block.theme_block) {
        acc.push({
          ...block,
          type: "cross_section" in block ? block.type : formatBlockType(block.type, schema?.folder),
        });
        return acc;
      }

      if (block.type === "@section_blocks") {
        schema.blocks.forEach((rootBlock) => {
          if (rootBlock.theme_block) {
            acc.push({
              ...rootBlock,
              type: formatBlockType(rootBlock.type, schema?.folder),
            });
          } else {
            acc.push(rootBlock);
          }
        });
        return acc;
      }

      if (!block.name && !["@app", "@classic_theme", "@theme"].includes(block.type)) {
        const potentialBlock = structuredClone(config.sources.blockSchemas[toCamelCase(block.type)]);

        if (potentialBlock?.folder === block.type) {
          acc.push({
            ...potentialBlock,
            type: potentialBlock.folder,
            themeBlock: { ...potentialBlock, type: potentialBlock.folder },
          });
          return acc;
        }

        if (!potentialBlock && block.type.includes("__")) {
          const sectionKey = toCamelCase(block.type.split("__")[0]);
          const section = structuredClone(config.sources.sectionSchemas[sectionKey]);

          const findSectionBlock = (blocks: any[], targetType: string, withSettings = false): any | undefined => {
            for (const sBlock of blocks) {
              const formattedType = sBlock.theme_block ? formatBlockType(sBlock.type, section.folder) : sBlock.type;

              if (formattedType === targetType) return { ...sBlock, type: formattedType };

              if (Array.isArray(sBlock.blocks)) {
                const nestedBlock = findSectionBlock(sBlock.blocks as any[], targetType, withSettings);
                if (withSettings) {
                  if (nestedBlock && nestedBlock.settings) return nestedBlock;
                } else {
                  if (nestedBlock) return nestedBlock;
                }
              }
            }
            return undefined;
          };

          const sectionBlock = section?.blocks
            ? findSectionBlock(section.blocks as any[], block.type, true) || findSectionBlock(section.blocks as any[], block.type)
            : undefined;

          if (sectionBlock) acc.push({ ...sectionBlock, themeBlock: section });
        }

        return acc;
      }

      acc.push(block);
      return acc;
    }, []);
  }

  return Object.values(blocks)
    ?.map(({ block_order, disabled, blocks, ...block }) => {
      const returnBlock = {
        ...block,
      };
      if (blocks) {
        const nextContainerSchema = containerSchema?.blocks?.find((containerBlock) => containerBlock.type === block.type) as
          | (ShopifySection & { path: string; folder: string; themeBlock: ShopifySection })
          | (ShopifyThemeBlock & { path: string; folder: string; themeBlock: ShopifySection });

        returnBlock.blocks = mapPresetBlocks(blocks, nextContainerSchema, nextContainerSchema?.themeBlock || schema);
      }

      if (returnBlock?.settings) {
        const blockSchema = containerSchema?.blocks?.find((containerBlock) => containerBlock.type === block.type);

        returnBlock.settings = Object.entries(returnBlock.settings).reduce((acc, [key, value]) => {
          if (key === "generate_block_presets") {
            acc[key] = "never";
            return acc;
          }
          if (blockSchema?.settings?.some((setting) => "id" in setting && setting?.id === key)) {
            acc[key] = value;
            return acc;
          }
          return acc;
        }, {});
      }
      return returnBlock;
    })
    ?.filter((childBlock) => {
      if (
        containerSchema?.blocks?.length &&
        containerSchema?.blocks?.some((containerBlock) => containerBlock.type === childBlock.type)
      ) {
        return true;
      }

      return false;
    });
};

export const syncPresets = async (watch = false) => {
  if (!config.sync_presets) {
    return false;
  }
  const startTime = Date.now();
  const completed = [];

  const count = 0;
  const templates = new Set([
    ...config.targets.sectionGroups,
    ...config.targets.configs,
    ...config.targets.templates,
    ...config.targets.customerTemplates,
  ]);

  const templateData: { sections: Sections; order: string[] }[] = [];

  templates.forEach((template) => {
    if (/[\\/]config[\\/]/gi.test(template)) return;
    const content = readFile(template);
    eval(`"use strict"; templateData.push(${content})`);
  });

  const presets: Record<
    string,
    {
      schema: ShopifySection & { path: string; folder: string };
      named: Record<string, ShopifySectionPreset[]>;
      unnamed: Record<string, ShopifySectionPreset[]>;
      primary: Record<string, ShopifySectionPreset[]>;
      development: Record<string, ShopifySectionPreset[]>;
      override: Record<string, ShopifySectionPreset[]>;
      no_existing_sections?: boolean;
      block_presets: {
        primary: Record<string, ShopifySectionPreset[]>;
        override: Record<string, ShopifySectionPreset[]>;
      };
    }
  > = {};

  templateData.forEach(({ sections }) => {
    if (!sections) return;
    Object.values(sections).forEach((section) => {
      const sectionSchema = structuredClone(config.sources.sectionSchemas[toCamelCase(section.type)]);
      if (!sectionSchema) return;

      const name = sectionSchema.name ?? "Unnamed";
      const sectionType = section.type;
      const sectionId = section.name || section.settings?.section_id;
      const generatePresets = section.settings?.generate_presets;

      // console.log({ sectionId, test: section.name });

      presets[sectionType] ??= {
        schema: sectionSchema,
        named: {},
        unnamed: {},
        primary: {},
        development: {},
        override: {},
        block_presets: {
          primary: {},
          override: {},
        },
      };

      const category =
        generatePresets === "always"
          ? "primary"
          : generatePresets === "development"
          ? "development"
          : generatePresets === "manual_override"
          ? "override"
          : section.settings?.section_id
          ? "named"
          : "unnamed";

      const key = sectionId || name;

      presets[sectionType][category][key] ??= [];
      presets[sectionType][category][key].push(section);

      const parseBlocks = (schema) => {
        if (schema.blocks && Object.keys(schema.blocks ?? {})?.length) {
          Object.values(schema.blocks).forEach((blockPreset: ShopifySectionPreset["blocks"][number]) => {
            // @ts-ignore
            if (blockPreset.type?.includes(`_${sectionType}__`) && blockPreset?.settings?.generate_block_presets === "always") {
              presets[sectionType].block_presets["primary"][blockPreset.type] ??= [];
              presets[sectionType].block_presets["primary"][blockPreset.type].push(blockPreset);
            }
            if (
              blockPreset.type?.includes(`_${sectionType}__`) &&
              blockPreset?.settings?.generate_block_presets === "manual_override"
            ) {
              presets[sectionType].block_presets["override"][blockPreset.type] ??= [];
              presets[sectionType].block_presets["override"][blockPreset.type].push(blockPreset);
            }
            parseBlocks(blockPreset);
          });
        }
      };
      parseBlocks(section);
    });
  });

  Object.values(config.sources.sectionSchemas).forEach((entry) => {
    const sectionType = entry.folder.replace(/^_*/gi, "");

    if (!presets[sectionType]) {
      const sectionSchema = structuredClone(entry);

      presets[sectionType] ??= {
        schema: sectionSchema,
        named: {},
        unnamed: {},
        primary: {},
        development: {},
        override: {},
        block_presets: {
          primary: {},
          override: {},
        },
        no_existing_sections: true,
      };
    }
  });

  await new Promise((resolve, reject) => {
    const promises = Object.entries(presets ?? {}).map(
      async ([type, { schema, named, unnamed, primary, development, override, no_existing_sections, block_presets }]) => {
        const schema_file_path = schema.folder.replace(/^_*/gi, "");
        const filePath = path.join(config.folders.sections, schema.folder, "_presets.ts");
        const existingPresets = importFresh(filePath)[`${toCamelCase(type)}Presets`] ?? [];
        const existingBlockPresets = importFresh(filePath)[`${toCamelCase(type)}BlockPresets`] as {
          [T: string]: ShopifySectionPreset[];
        };
        const sectionBlocksPresetOutput = {};
        const sectionPresetOutput = [];

        const addPresets = (presetGroup: Record<string, ShopifySectionPreset[]>, developmentOnly = false, override = false) => {
          Object.entries(presetGroup).forEach(([name, presets]) => {
            const sectionFoundIndex = sectionPresetOutput.findIndex((preset) => preset.name === name);
            if (sectionFoundIndex !== -1 && !override) {
              return;
            }

            const preset = presets[0];
            const presetObject: ShopifySectionPreset = {
              name,
              ...(override && { manual_preset: true }),
              ...(developmentOnly && { development_only: true }),
            };
            if (preset.manual_preset || override) {
              presetObject.manual_preset = true;
            }

            if (preset.settings) {
              presetObject.settings = Object.entries(preset.settings).reduce((acc, [key, value]) => {
                if (schema.settings?.some((setting) => "id" in setting && setting?.id === key)) {
                  acc[key] = value;
                }
                return acc;
              }, {});
              if ("generate_presets" in presetObject.settings) {
                presetObject.settings.generate_presets = "never";
              }
            }
            if (preset.blocks) {
              // @ts-ignore
              presetObject.blocks = mapPresetBlocks(preset.blocks, structuredClone(schema));
            }

            if (sectionFoundIndex !== -1 && override) {
              sectionPresetOutput[sectionFoundIndex] = presetObject;
            } else {
              sectionPresetOutput.push(presetObject);
            }
          });
        };

        existingPresets?.forEach((preset, i, arr) => {
          if (preset.manual_preset) {
            addPresets({ [preset.name]: [preset] });
          }
          if (no_existing_sections && !sectionPresetOutput.length && !arr.some((p) => p.manual_preset)) {
            const bestOption = arr.find((p) => p.name === schema.name);
            if (bestOption) {
              addPresets({ [bestOption.name]: [bestOption] });
            } else {
              addPresets({ [preset.name]: [preset] });
            }
          }
        });

        // Process all categories efficiently
        addPresets(primary);
        addPresets(named, true);
        addPresets(unnamed, true);
        addPresets(development, true);
        addPresets(override, false, true);

        if (sectionPresetOutput.length === 0) {
          sectionPresetOutput.push({ name: schema.name });
        }

        const findBlockById = (s, t) => {
          // Check current block
          if (`_${schema_file_path}__${s.type}` === t) {
            return s;
          }

          // Check nested blocks
          if (Array.isArray(s.blocks)) {
            for (const block of s.blocks) {
              const result = findBlockById(block, t);
              if (result) return result; // short-circuit on match
            }
          }

          return null;
        };

        const addBlockPresets = (type, blockPresets, existingPreset = false, override = false) => {
          const blockSchema = findBlockById(schema, type);
          if (blockSchema && blockPresets?.length) {
            sectionBlocksPresetOutput[type] ??= [];

            blockPresets.forEach((preset) => {
              const name = existingPreset ? preset.name : preset.settings?.title || preset.name || blockSchema.name;
              const blockFoundIndex = sectionBlocksPresetOutput[type].findIndex((preset) => preset.name === name);

              if (blockFoundIndex !== -1 && !override) {
                return;
              }

              const presetObject: ShopifySectionPreset = {
                name,
              };

              if (preset.manual_preset || override) {
                presetObject.manual_preset = true;
              }

              if (preset.settings) {
                presetObject.settings = Object.entries(preset.settings).reduce((acc, [key, value]) => {
                  if (blockSchema.settings?.some((setting) => "id" in setting && setting?.id === key)) {
                    acc[key] = value;
                  }
                  return acc;
                }, {});

                if ("generate_block_presets" in presetObject.settings) {
                  presetObject.settings.generate_block_presets = "never";
                }
              }
              if (preset.blocks) {
                // @ts-ignore
                presetObject.blocks = mapPresetBlocks(preset.blocks, structuredClone(blockSchema), structuredClone(schema));
              }

              if (blockFoundIndex !== -1 && override) {
                sectionBlocksPresetOutput[type][blockFoundIndex] = presetObject;
              } else {
                sectionBlocksPresetOutput[type].push(presetObject);
              }
            });
          }
        };

        if (existingBlockPresets && typeof existingBlockPresets === "object") {
          Object.entries(existingBlockPresets)?.forEach(([type, presets]) => {
            addBlockPresets(
              type,
              presets.filter((p) => p.manual_preset),
              true
            );

            if (
              !block_presets.primary?.[type]?.length &&
              !block_presets.override?.[type]?.length &&
              !sectionBlocksPresetOutput[type]
            ) {
              addBlockPresets(type, [presets[0]], true);
            }
          });
        }

        Object.entries(block_presets.primary).forEach(([type, blockPresets]) => {
          addBlockPresets(type, blockPresets, false, false);
        });
        Object.entries(block_presets.override).forEach(([type, blockPresets]) => {
          addBlockPresets(type, blockPresets, false, true);
        });

        // **Deep Equality Check to Avoid Unnecessary Updates**
        const existingSourceJson = existingPresets.map((preset) => ({
          name: preset.name,
          settings: preset.settings ?? {},
          blocks: preset.blocks ?? [],
          development_only: preset.development_only ?? false,
        }));

        const newSourceJson = sectionPresetOutput.map((preset) => ({
          name: preset.name,
          settings: preset.settings ?? {},
          blocks: preset.blocks ?? [],
          development_only: preset.development_only ?? false,
        }));

        if (
          existingBlockPresets &&
          equal(existingSourceJson, newSourceJson) &&
          equal(existingBlockPresets, sectionBlocksPresetOutput)
        ) {
          // console.log("No Preset Change found");
          completed.push(false);
          return; // **Skip writing & ESLint if unchanged**
        }
        console.log(`Preset Update: ${type}`);

        // Prepare new output file content
        const outputArr = [];

        outputArr.push(`import { ThemeBlocks } from "types/blocks";`);
        outputArr.push(`import { ShopifySectionPreset, ShopifySectionBlockPresetMap } from "types/shopify";`);
        outputArr.push(`import { ${toPascalCase(type)}Section } from "types/sections";`);
        outputArr.push(``);
        outputArr.push(
          `export const ${toCamelCase(type)}Presets: ShopifySectionPreset<${toPascalCase(type)}Section>[] = ${formatObject(
            sectionPresetOutput,
            2
          )};`
        );

        if (!Object.keys(sectionBlocksPresetOutput)?.length) {
          outputArr.push(``);
          outputArr.push(
            `export const ${toCamelCase(
              type
            )}BlockPresets: ShopifySectionBlockPresetMap<Extract<ThemeBlocks, { type: \`_${schema_file_path}__\${string}\` }>> = {};`
          );
        }

        if (Object.keys(sectionBlocksPresetOutput)?.length) {
          outputArr.push(``);
          outputArr.push(
            `export const ${toCamelCase(
              type
            )}BlockPresets: ShopifySectionBlockPresetMap<Extract<ThemeBlocks, { type: \`_${schema_file_path}__\${string}\` }>> = ${formatObject(
              sectionBlocksPresetOutput,
              2
            )};`
          );
        }

        const output = outputArr.join("\n");

        // Save the new output to a temporary file for ESLint
        const tempFilePath = path.join(config.project_root, "@utils", "temp", `${type}__temp.ts`);
        fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
        fs.writeFileSync(tempFilePath, output, "utf8");

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
              },
              ignorePatterns: ["!node_modules/**"], // Force ESLint to include fx-style
            },
          });

          const results = await eslint.lintFiles([tempFilePath]);
          const formattedOutput = results[0]?.output ?? output;

          fs.unlinkSync(tempFilePath);
          writeCompareFile(filePath, formattedOutput, (updated) => {
            if (updated) completed.push(true);
          });
        } catch (error) {
          console.error(error);
          completed.push(false);
        }
      }
    );

    Promise.all(promises).then(() => resolve(true));
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
    return true;
  }
};
