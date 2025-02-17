import chalk from "chalk";
import fs from "fs";
import path from "path";
import { config, root_dir } from "../../shopify-accelerate";
import { deleteFile, readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";
import { isObject } from "../utils/is-object";
import { toLocaleFriendlySnakeCase } from "../utils/to-snake-case";
import { generateBlockFileSchema } from "./generate-block-files";
import { generateSectionFiles } from "./generate-section-files";
import { generateSettingsFile } from "./generate-settings-file";

export const generateLiquidFiles = () => {
  const {
    theme_path,
    folders,
    sources,
    targets,
    delete_external_blocks,
    delete_external_layouts,
    delete_external_sections,
    delete_external_snippets,
  } = config;

  const translations: any = {};
  const snippets = sources.snippets;
  const giftCards = sources.giftCards;
  const layouts = sources.layouts;
  const sectionsSchemas = sources.sectionSchemas;
  const blockSchemas = sources.blockSchemas;
  const classic_blockSchemas = sources.classic_blockSchemas;
  const cardSchemas = sources.cardSchemas;

  generateSettingsFile();

  for (const key in sectionsSchemas) {
    const schema = sectionsSchemas[key];

    const schema_file_path = schema.folder.replace(/^_*/gi, "");

    const sectionName = `${schema_file_path}.liquid`;
    const sectionPath = path.join(process.cwd(), theme_path, "sections", sectionName);

    if (schema.disabled) {
      const targetFile = targets.sections.find((target) => target.split(/[\\/]/gi).at(-1) === sectionName);
      if (targetFile) {
        config.targets.sections = config.targets.sections.filter((target) => target !== targetFile);
        deleteFile(path.join(root_dir, targetFile));
      }
      const snippetTargets = targets.snippets.filter(
        (target) => `${target.split(/[\\/]/gi).at(-1).split(".")[0]}.liquid` === sectionName
      );

      if (snippetTargets.length) {
        config.targets.snippets = config.targets.snippets.filter((target) => {
          if (snippetTargets.includes(target)) {
            deleteFile(path.join(root_dir, target));
            return false;
          }
          return true;
        });
      }
      continue;
    }

    const createBlockSchemas = (block) => {
      if (block.disabled || "theme_block" in block) {
        const targetFile = targets.snippets.find(
          (target) => target.split(/[\\/]/gi).at(-1) === `${sectionName.replace(".liquid", "")}.${block.type}.liquid`
        );
        if (targetFile) {
          config.targets.snippets = config.targets.snippets.filter((target) => target !== targetFile);
          deleteFile(path.join(root_dir, targetFile));
        }
      }

      if ("theme_block" in block && block.theme_block) {
        const blockSchema = {
          ...block,
          presets: "presets" in block ? block.presets : [{ name: block.name }],
          folder: schema.folder,
        };

        const blockName = `${schema_file_path}.${blockSchema.type}.liquid`;
        const blockPath = path.join(process.cwd(), theme_path, "blocks", `_${schema_file_path}__${blockSchema.type}.liquid`);
        const targetSnippet = [...snippets].find((snippet) => snippet.includes(blockName));

        if (targetSnippet) {
          snippets.delete(targetSnippet);
        }

        block.blocks?.forEach(createBlockSchemas);

        if (blockSchema.disabled) {
          const targetFile = targets.blocks.find((target) => target.split(/[\\/]/gi).at(-1) === `_${blockName}`);
          if (targetFile) {
            config.targets.blocks = config.targets.blocks.filter((target) => target !== targetFile);
            deleteFile(path.join(root_dir, targetFile));
          }

          return;
        }

        const translationArray = [];

        const rawContent = readFile(path.join(folders.sections, schema.folder, blockName), {
          encoding: "utf-8",
        });

        if (rawContent) {
          const translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (str, group1, group2) => {
            const group = toLocaleFriendlySnakeCase(schema.folder);
            const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
            const backupContent = toLocaleFriendlySnakeCase(group2).trim();
            const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

            if (!(group in translations)) {
              translations[group] = {};
            }

            if (id && !(id in translations[group])) {
              translations[group][id] = group2;
              return `{{ "${group}.${id}" | t }}`;
            }

            if (!(content in translations[group])) {
              translations[group][content] = group2;
              return `{{ "${group}.${content}" | t }}`;
            }

            if (translations[group][content] !== group2) {
              if (!(backupContent in translations[group])) {
                translations[group][backupContent] = group2;
                return `{{ "${group}.${backupContent}" | t }}`;
              }
              if (translations[group][backupContent] !== group2) {
                translations[group][`${content}_2`] = group2;
                return `{{ "${group}.${content}_2" | t }}`;
              }
            }

            if (translations[group][content] === group2) {
              return `{{ "${group}.${content}" | t }}`;
            }

            return group2;
          });

          translationArray.push(translatedContent);
        }

        blockSchema.limit = undefined;

        translationArray.push(generateBlockFileSchema(blockSchema, schema));

        if (config.ignore_blocks?.includes(blockPath.split(/[/\\]/)?.at(-1))) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
              `Ignored: ${blockPath.replace(process.cwd(), "")}`
            )}`
          );
          writeOnlyNew(blockPath, translationArray.join("\n"));
        } else {
          writeCompareFile(blockPath, translationArray.join("\n"));
        }
      }
    };

    schema?.blocks?.forEach(createBlockSchemas);

    let translationArray = [];

    const rawContent = readFile(path.join(folders.sections, schema.folder, sectionName), {
      encoding: "utf-8",
    });

    if (rawContent) {
      let translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (str, group1, group2) => {
        const group = toLocaleFriendlySnakeCase(schema.folder);
        const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
        const backupContent = toLocaleFriendlySnakeCase(group2).trim();
        const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

        if (!(group in translations)) {
          translations[group] = {};
        }

        if (id && !(id in translations[group])) {
          translations[group][id] = group2;
          return `{{ "${group}.${id}" | t }}`;
        }

        if (!(content in translations[group])) {
          translations[group][content] = group2;
          return `{{ "${group}.${content}" | t }}`;
        }

        if (translations[group][content] !== group2) {
          if (!(backupContent in translations[group])) {
            translations[group][backupContent] = group2;
            return `{{ "${group}.${backupContent}" | t }}`;
          }
          if (translations[group][backupContent] !== group2) {
            translations[group][`${content}_2`] = group2;
            return `{{ "${group}.${content}_2" | t }}`;
          }
        }

        if (translations[group][content] === group2) {
          return `{{ "${group}.${content}" | t }}`;
        }

        return group2;
      });

      translatedContent = translatedContent?.replace(
        /\n(\s*){%-?\s*content_for\s*['"]classic-blocks["']\s*-?%}/gi,
        (str, match) => {
          match = match.replace(/\n/gi, "");
          const arr = [`\n${match}{% liquid`];
          arr.push(`${match}  for block in section.blocks`);
          for (const key in blockSchemas) {
            const schema = blockSchemas[key];
            if (schema.disabled) continue;
            arr.push(`${match}    if block.type == "${schema_file_path}"`);
            arr.push(
              `${match}      render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
            );
            arr.push(`${match}    endif`);
          }
          arr.push(`${match}  endfor`);
          arr.push(`${match}%}`);

          return arr.join("\n");
        }
      );

      translatedContent = translatedContent?.replace(/\n(\s*)content_for\s*['"]classic-blocks["']\s*\n/gi, (str, match) => {
        match = match.replace(/\n/gi, "");
        const arr = [`\n${match}`];
        arr.push(`${match}for block in section.blocks`);
        for (const key in blockSchemas) {
          const schema = blockSchemas[key];
          if (schema.disabled) continue;
          arr.push(`${match}  if block.type == "${schema_file_path}"`);
          arr.push(
            `${match}    render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
          );
          arr.push(`${match}  endif`);
        }
        arr.push(`${match}endfor`);
        arr.push(``);

        return arr.join("\n");
      });

      translatedContent = translatedContent?.replace(
        /\n(\s*){%-?\s*content_for\s*['"]classic-block["']\s*-?%}/gi,
        (str, match) => {
          match = match.replace(/\n/gi, "");
          const arr = [`\n${match}{% liquid`];
          for (const key in blockSchemas) {
            const schema = blockSchemas[key];
            if (schema.disabled) continue;
            arr.push(`${match}  if block.type == "${schema_file_path}"`);
            arr.push(
              `${match}    render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
            );
            arr.push(`${match}  endif`);
          }
          arr.push(`${match}%}`);

          return arr.join("\n");
        }
      );
      translatedContent = translatedContent?.replace(/\n(\s*)content_for\s*['"]classic-block["']\s*\n/gi, (str, match) => {
        match = match.replace(/\n/gi, "");
        const arr = [`\n${match}`];
        for (const key in blockSchemas) {
          const schema = blockSchemas[key];
          if (schema.disabled) continue;
          arr.push(`${match}if block.type == "${schema_file_path}"`);
          arr.push(
            `${match}  render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
          );
          arr.push(`${match}endif`);
        }
        arr.push(``);
        return arr.join("\n");
      });

      translationArray.push(translatedContent);
    }

    if (schema.section_as_snippet) {
      const snippetPath = path.join(process.cwd(), theme_path, "snippets", sectionName);

      if (config.ignore_snippets?.includes(snippetPath.split(/[/\\]/)?.at(-1))) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
            `Ignored: ${snippetPath.replace(process.cwd(), "")}`
          )}`
        );
        writeOnlyNew(snippetPath, translationArray.join("\n"));
      } else {
        writeCompareFile(snippetPath, translationArray.join("\n"));
      }

      snippets.add(snippetPath);

      translationArray = [`{%- render "${schema_file_path}" -%}`];
    }

    translationArray.push(generateSectionFiles(schema));

    if (config.ignore_sections?.includes(sectionPath.split(/[/\\]/)?.at(-1))) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
          `Ignored: ${sectionPath.replace(process.cwd(), "")}`
        )}`
      );
      writeOnlyNew(sectionPath, translationArray.join("\n"));
    } else {
      writeCompareFile(sectionPath, translationArray.join("\n"));
    }
  }

  for (const key in blockSchemas) {
    const schema = blockSchemas[key];

    const schema_file_path = schema.folder;

    const sectionName = `${schema_file_path}.liquid`;
    const blockPath = path.join(process.cwd(), theme_path, "blocks", sectionName);

    if (schema.disabled) {
      const targetFile = targets.blocks.find((target) => target.split(/[\\/]/gi).at(-1) === sectionName);
      if (targetFile) {
        config.targets.blocks = config.targets.blocks.filter((target) => target !== targetFile);
        deleteFile(path.join(root_dir, targetFile));
      }

      continue;
    }

    const createBlockSchemas = (block) => {
      if (block.disabled || "theme_block" in block) {
        const targetFile = targets.snippets.find(
          (target) => target.split(/[\\/]/gi).at(-1) === `${sectionName.replace(".liquid", "")}.${block.type}.liquid`
        );
        if (targetFile) {
          config.targets.snippets = config.targets.snippets.filter((target) => target !== targetFile);
          deleteFile(path.join(root_dir, targetFile));
        }
      }

      if ("theme_block" in block && block.theme_block) {
        const blockSchema = {
          ...block,
          presets: "presets" in block ? block.presets : [{ name: block.name }],
          folder: schema.folder,
        };

        const blockName = `${schema_file_path}.${blockSchema.type}.liquid`;
        const blockPath = path.join(
          process.cwd(),
          theme_path,
          "blocks",
          `_${schema_file_path}__${blockSchema.type}.liquid`.replace(/^_+/gi, "_")
        );

        const targetSnippet = [...snippets].find((snippet) => snippet.includes(blockName));

        if (targetSnippet) {
          snippets.delete(targetSnippet);
        }

        block.blocks?.forEach(createBlockSchemas);

        if (blockSchema.disabled) {
          const targetFile = targets.blocks.find((target) => target.split(/[\\/]/gi).at(-1) === `_${blockName}`);
          if (targetFile) {
            config.targets.blocks = config.targets.blocks.filter((target) => target !== targetFile);
            deleteFile(path.join(root_dir, targetFile));
          }

          return;
        }

        const translationArray = [];

        const rawContent = readFile(path.join(folders.blocks, schema.folder, blockName), {
          encoding: "utf-8",
        });

        if (rawContent) {
          const translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (str, group1, group2) => {
            const group = toLocaleFriendlySnakeCase(schema.folder);
            const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
            const backupContent = toLocaleFriendlySnakeCase(group2).trim();
            const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

            if (!(group in translations)) {
              translations[group] = {};
            }

            if (id && !(id in translations[group])) {
              translations[group][id] = group2;
              return `{{ "${group}.${id}" | t }}`;
            }

            if (!(content in translations[group])) {
              translations[group][content] = group2;
              return `{{ "${group}.${content}" | t }}`;
            }

            if (translations[group][content] !== group2) {
              if (!(backupContent in translations[group])) {
                translations[group][backupContent] = group2;
                return `{{ "${group}.${backupContent}" | t }}`;
              }
              if (translations[group][backupContent] !== group2) {
                translations[group][`${content}_2`] = group2;
                return `{{ "${group}.${content}_2" | t }}`;
              }
            }

            if (translations[group][content] === group2) {
              return `{{ "${group}.${content}" | t }}`;
            }

            return group2;
          });

          translationArray.push(translatedContent);
        }

        blockSchema.limit = undefined;

        translationArray.push(generateBlockFileSchema(blockSchema, schema));

        if (config.ignore_blocks?.includes(blockPath.split(/[/\\]/)?.at(-1))) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
              `Ignored: ${blockPath.replace(process.cwd(), "")}`
            )}`
          );
          writeOnlyNew(blockPath, translationArray.join("\n"));
        } else {
          writeCompareFile(blockPath, translationArray.join("\n"));
        }
      }
    };

    schema?.blocks?.forEach(createBlockSchemas);

    const translationArray = [];

    const rawContent = readFile(path.join(folders.blocks, schema.folder, sectionName), {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (str, group1, group2) => {
        const group = toLocaleFriendlySnakeCase(schema.folder);
        const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
        const backupContent = toLocaleFriendlySnakeCase(group2).trim();
        const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

        if (!(group in translations)) {
          translations[group] = {};
        }

        if (id && !(id in translations[group])) {
          translations[group][id] = group2;
          return `{{ "${group}.${id}" | t }}`;
        }

        if (!(content in translations[group])) {
          translations[group][content] = group2;
          return `{{ "${group}.${content}" | t }}`;
        }

        if (translations[group][content] !== group2) {
          if (!(backupContent in translations[group])) {
            translations[group][backupContent] = group2;
            return `{{ "${group}.${backupContent}" | t }}`;
          }
          if (translations[group][backupContent] !== group2) {
            translations[group][`${content}_2`] = group2;
            return `{{ "${group}.${content}_2" | t }}`;
          }
        }

        if (translations[group][content] === group2) {
          return `{{ "${group}.${content}" | t }}`;
        }

        return group2;
      });

      translationArray.push(translatedContent);
    }

    translationArray.push(generateBlockFileSchema(schema));

    if (config.ignore_blocks?.includes(blockPath.split(/[/\\]/)?.at(-1))) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
          `Ignored: ${blockPath.replace(process.cwd(), "")}`
        )}`
      );
      writeOnlyNew(blockPath, translationArray.join("\n"));
    } else {
      writeCompareFile(blockPath, translationArray.join("\n"));
    }
  }

  for (const key in classic_blockSchemas) {
    const schema = classic_blockSchemas[key];

    const schema_file_path = schema.folder.replace(/^_*/gi, "");

    const sectionName = `${schema_file_path}.liquid`;
    const targetSectionName = `_blocks.${schema_file_path}.liquid`;

    if (schema.disabled) {
      const targetFile = targets.snippets.find((target) => target.split(/[\\/]/gi).at(-1) === targetSectionName);
      if (targetFile) {
        config.targets.snippets = config.targets.snippets.filter((target) => target !== targetFile);
        deleteFile(path.join(root_dir, targetFile));
      }

      continue;
    }

    const translationArray = [];

    const rawContent = readFile(path.join(folders.classic_blocks, schema.folder, sectionName), {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (str, group1, group2) => {
        const group = toLocaleFriendlySnakeCase(schema.folder);
        const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
        const backupContent = toLocaleFriendlySnakeCase(group2).trim();
        const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

        if (!(group in translations)) {
          translations[group] = {};
        }

        if (id && !(id in translations[group])) {
          translations[group][id] = group2;
          return `{{ "${group}.${id}" | t }}`;
        }

        if (!(content in translations[group])) {
          translations[group][content] = group2;
          return `{{ "${group}.${content}" | t }}`;
        }

        if (translations[group][content] !== group2) {
          if (!(backupContent in translations[group])) {
            translations[group][backupContent] = group2;
            return `{{ "${group}.${backupContent}" | t }}`;
          }
          if (translations[group][backupContent] !== group2) {
            translations[group][`${content}_2`] = group2;
            return `{{ "${group}.${content}_2" | t }}`;
          }
        }

        if (translations[group][content] === group2) {
          return `{{ "${group}.${content}" | t }}`;
        }

        return group2;
      });

      translationArray.push(translatedContent);
    }

    translationArray.push(generateBlockFileSchema(schema));
  }

  for (const key in cardSchemas) {
    const schema = cardSchemas[key];

    const schema_file_path = schema.folder.replace(/^_*/gi, "");
    const sectionName = `${schema_file_path}.liquid`;
    const targetSectionName = `_card.${schema_file_path}.liquid`;

    if (schema.disabled) {
      const targetFile = targets.snippets.find((target) => target.split(/[\\/]/gi).at(-1) === targetSectionName);
      if (targetFile) {
        config.targets.snippets = config.targets.snippets.filter((target) => target !== targetFile);
        deleteFile(path.join(root_dir, targetFile));
      }

      continue;
    }

    const translationArray = [];

    const rawContent = readFile(path.join(folders.cards, schema.folder, sectionName), {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (str, group1, group2) => {
        const group = toLocaleFriendlySnakeCase(schema.folder);
        const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
        const backupContent = toLocaleFriendlySnakeCase(group2).trim();
        const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

        if (!(group in translations)) {
          translations[group] = {};
        }

        if (id && !(id in translations[group])) {
          translations[group][id] = group2;
          return `{{ "${group}.${id}" | t }}`;
        }

        if (!(content in translations[group])) {
          translations[group][content] = group2;
          return `{{ "${group}.${content}" | t }}`;
        }

        if (translations[group][content] !== group2) {
          if (!(backupContent in translations[group])) {
            translations[group][backupContent] = group2;
            return `{{ "${group}.${backupContent}" | t }}`;
          }
          if (translations[group][backupContent] !== group2) {
            translations[group][`${content}_2`] = group2;
            return `{{ "${group}.${content}_2" | t }}`;
          }
        }

        if (translations[group][content] === group2) {
          return `{{ "${group}.${content}" | t }}`;
        }

        return group2;
      });

      translationArray.push(translatedContent);
    }

    translationArray.push(generateBlockFileSchema(schema));
  }

  for (let i = 0; i < snippets.size; i++) {
    const snippet = [...snippets][i];
    const snippetName = snippet.split(/[\\/]/gi).at(-1);

    const snippetTargetName = snippet?.includes(folders.classic_blocks)
      ? `_blocks.${snippetName}`
      : snippet?.includes(folders.cards)
      ? `_card.${snippetName}`
      : snippetName;

    const section = Object.values(sectionsSchemas).find((section) => section.path.includes(snippet.replace(snippetName, "")));
    const sectionBlockSchemas = section?.blocks?.find((block) => new RegExp(`\\.${block.type}\\.`, "gi").test(snippetName));

    if (section && (section.disabled || sectionBlockSchemas?.disabled)) {
      continue;
    }

    const block = Object.values(classic_blockSchemas).find((block) => block.path.includes(snippet.replace(snippetName, "")));

    if (block && block.disabled) {
      continue;
    }

    const snippetTargetPath = path.join(process.cwd(), theme_path, "snippets", snippetTargetName);

    const returnArr = [];

    const rawContent = readFile(snippet, {
      encoding: "utf-8",
    });

    if (rawContent) {
      let translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (_, group1, group2) => {
        const group = toLocaleFriendlySnakeCase(snippet.split(/[\\/]/gi).at(-1).split(".").at(0)).trim();
        const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
        const backupContent = toLocaleFriendlySnakeCase(group2).trim();
        const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

        if (!(group in translations)) {
          translations[group] = {};
        }

        if (id && !(id in translations[group])) {
          translations[group][id] = group2;
          return `{{ "${group}.${id}" | t }}`;
        }

        if (!(content in translations[group])) {
          translations[group][content] = group2;
          return `{{ "${group}.${content}" | t }}`;
        }

        if (translations[group][content] !== group2) {
          if (!(backupContent in translations[group])) {
            translations[group][backupContent] = group2;
            return `{{ "${group}.${backupContent}" | t }}`;
          }
          if (translations[group][backupContent] !== group2) {
            translations[group][`${content}_2`] = group2;
            return `{{ "${group}.${content}_2" | t }}`;
          }
        }
        if (translations[group][content] === group2) {
          return `{{ "${group}.${content}" | t }}`;
        }

        return group2;
      });

      translatedContent = translatedContent?.replace(
        /\n(\s*){%-?\s*content_for\s*['"]classic-blocks["']\s*-?%}/gi,
        (str, match) => {
          match = match.replace(/\n/gi, "");
          const arr = [`\n${match}{% liquid`];
          arr.push(`${match}  for block in section.blocks`);
          for (const key in classic_blockSchemas) {
            const schema = classic_blockSchemas[key];
            const schema_file_path = schema.folder.replace(/^_*/gi, "");

            if (schema.disabled) continue;
            arr.push(`${match}    if block.type == "${schema_file_path}"`);
            arr.push(
              `${match}      render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
            );
            arr.push(`${match}    endif`);
          }
          arr.push(`${match}  endfor`);
          arr.push(`${match}%}`);

          return arr.join("\n");
        }
      );

      translatedContent = translatedContent?.replace(/\n(\s*)content_for\s*['"]classic-blocks["']\s*\n/gi, (str, match) => {
        match = match.replace(/\n/gi, "");
        const arr = [`\n${match}`];
        arr.push(`${match}for block in section.blocks`);
        for (const key in classic_blockSchemas) {
          const schema = classic_blockSchemas[key];
          const schema_file_path = schema.folder.replace(/^_*/gi, "");

          if (schema.disabled) continue;
          arr.push(`${match}  if block.type == "${schema_file_path}"`);
          arr.push(
            `${match}    render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
          );
          arr.push(`${match}  endif`);
        }
        arr.push(`${match}endfor`);
        arr.push(``);

        return arr.join("\n");
      });

      translatedContent = translatedContent?.replace(
        /\n(\s*){%-?\s*content_for\s*['"]classic-block["']\s*-?%}/gi,
        (str, match) => {
          match = match.replace(/\n/gi, "");
          const arr = [`\n${match}{% liquid`];
          for (const key in classic_blockSchemas) {
            const schema = classic_blockSchemas[key];
            const schema_file_path = schema.folder.replace(/^_*/gi, "");

            if (schema.disabled) continue;
            arr.push(`${match}  if block.type == "${schema_file_path}"`);
            arr.push(
              `${match}    render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
            );
            arr.push(`${match}  endif`);
          }
          arr.push(`${match}%}`);

          return arr.join("\n");
        }
      );
      translatedContent = translatedContent?.replace(/\n(\s*)content_for\s*['"]classic-block["']\s*\n/gi, (str, match) => {
        match = match.replace(/\n/gi, "");
        const arr = [`\n${match}`];
        for (const key in classic_blockSchemas) {
          const schema = classic_blockSchemas[key];
          const schema_file_path = schema.folder.replace(/^_*/gi, "");

          if (schema.disabled) continue;
          arr.push(`${match}if block.type == "${schema_file_path}"`);
          arr.push(
            `${match}  render "_blocks.${schema_file_path}", block: block, forloop: forloop, section_type: section_type, form: form`
          );
          arr.push(`${match}endif`);
        }
        arr.push(``);
        return arr.join("\n");
      });

      returnArr.push(translatedContent);
    }

    if (config.ignore_snippets?.includes(snippetTargetPath.split(/[/\\]/)?.at(-1))) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
          `Ignored: ${snippetTargetPath.replace(process.cwd(), "")}`
        )}`
      );
      writeOnlyNew(snippetTargetPath, returnArr.join("\n"));
    } else {
      writeCompareFile(snippetTargetPath, returnArr.join("\n"));
    }
  }

  for (let i = 0; i < giftCards.length; i++) {
    const giftCard = giftCards[i];
    const giftCardName = giftCard.split(/[\\/]/gi).at(-1);

    const giftCardPath = path.join(process.cwd(), theme_path, "templates", giftCardName);

    const returnArr = [];

    const rawContent = readFile(giftCard, {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (_, group1, group2) => {
        const group = toLocaleFriendlySnakeCase(giftCard.split(/[\\/]/gi).at(-1).split(".").at(0)).trim();
        const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
        const backupContent = toLocaleFriendlySnakeCase(group2).trim();
        const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

        if (!(group in translations)) {
          translations[group] = {};
        }

        if (id && !(id in translations[group])) {
          translations[group][id] = group2;
          return `{{ "${group}.${id}" | t }}`;
        }

        if (!(content in translations[group])) {
          translations[group][content] = group2;
          return `{{ "${group}.${content}" | t }}`;
        }

        if (translations[group][content] !== group2) {
          if (!(backupContent in translations[group])) {
            translations[group][backupContent] = group2;
            return `{{ "${group}.${backupContent}" | t }}`;
          }
          if (translations[group][backupContent] !== group2) {
            translations[group][`${content}_2`] = group2;
            return `{{ "${group}.${content}_2" | t }}`;
          }
        }
        if (translations[group][content] === group2) {
          return `{{ "${group}.${content}" | t }}`;
        }

        return group2;
      });
      returnArr.push(translatedContent);
    }

    writeCompareFile(giftCardPath, returnArr.join("\n"));
  }

  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    const layoutName = layout.split(/[\\/]/gi).at(-1);
    const layoutPath = path.join(process.cwd(), theme_path, "layout", layoutName);

    const returnArr = [];

    const rawContent = readFile(layout, {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(/<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi, (_, group1, group2) => {
        const group = toLocaleFriendlySnakeCase(layout.split(/[\\/]/gi).at(-1).split(".").at(0)).trim();
        const content = toLocaleFriendlySnakeCase(group2?.split(" ")?.slice(0, 2)?.join("_") ?? "").trim();
        const backupContent = toLocaleFriendlySnakeCase(group2).trim();
        const id = toLocaleFriendlySnakeCase(group1?.replace(/id="(.*)"/gi, "$1") ?? "").trim();

        if (!(group in translations)) {
          translations[group] = {};
        }

        if (id && !(id in translations[group])) {
          translations[group][id] = group2;
          return `{{ "${group}.${id}" | t }}`;
        }

        if (!(content in translations[group])) {
          translations[group][content] = group2;
          return `{{ "${group}.${content}" | t }}`;
        }

        if (translations[group][content] !== group2) {
          if (!(backupContent in translations[group])) {
            translations[group][backupContent] = group2;
            return `{{ "${group}.${backupContent}" | t }}`;
          }
          if (translations[group][backupContent] !== group2) {
            translations[group][`${content}_2`] = group2;
            return `{{ "${group}.${content}_2" | t }}`;
          }
        }
        if (translations[group][content] === group2) {
          return `{{ "${group}.${content}" | t }}`;
        }

        return group2;
      });
      returnArr.push(translatedContent);
    }

    if (config.ignore_layouts?.includes(layoutPath.split(/[/\\]/)?.at(-1))) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
          `Ignored: ${layoutPath.replace(process.cwd(), "")}`
        )}`
      );
      if (layoutPath.split(/[/\\]/)?.at(-1) === "theme.liquid") {
        writeCompareFile(layoutPath.replace("theme.liquid", "theme.dev.liquid"), returnArr.join("\n"));
      }
      writeOnlyNew(layoutPath, returnArr.join("\n"));
    } else {
      writeCompareFile(layoutPath, returnArr.join("\n"));
    }
  }

  const transformTranslations = (input, prevKey = "") => {
    if (isObject(input)) {
      return Object.entries(input).reduce<any>((acc, [key, val]) => {
        acc[key] = transformTranslations(val, `${prevKey ? `${prevKey}.` : ""}${key}`);
        return acc;
      }, {});
    }
    if (typeof input === "string") {
      return `{{ '${prevKey}' | t }}`;
    }
  };

  const translationsJs = `<script data-no-block>
  window.translations = ${JSON.stringify(transformTranslations(translations), undefined, 2)};
</script>
  `;

  const translationTypes = `export type Translations = ${JSON.stringify(translations, undefined, 2)
    .replace(/(\s+)([^\n:]*):([^\n{]*?),?\n/gi, "$1/* $3 */\n$1$2: string;\n")
    .replace(/"/gi, "")
    .replace(/,/gi, ";")
    .replace(/}\n/gi, "};\n")
    .replace(/\n\n/gi, "\n")};
declare global {
  interface Window {
    translations?: Translations;
  }
}
`;

  writeCompareFile(
    path.join(process.cwd(), theme_path, "locales", "en.default.json"),
    JSON.stringify(translations, undefined, 2)
  );
  writeCompareFile(path.join(process.cwd(), theme_path, "snippets", "_layout.translations.liquid"), translationsJs);
  writeCompareFile(path.join(folders.types, "translations.ts"), translationTypes);

  const dynamicJsImports = [];

  sources.sectionsJs.forEach((name) => {
    const filename = name.split(/[\\/]/gi).at(-1);
    const section = Object.values(sectionsSchemas).find((section) => section.path.includes(name.replace(filename, "")));
    const targetName = `__section--${filename.replace(/\.(ts)x?$/gi, ".js")}`;
    const targetFile = targets.dynamicJs.find((file) => file.includes(targetName));

    if (section && !section.disabled) {
      dynamicJsImports.push(`<script type="module" src="{{ '${targetName}' | asset_url }}" defer></script>`);
    } else if (targetFile) {
      deleteFile(path.join(root_dir, targetFile));
      config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== targetFile);
    }
  });

  sources.blocksJs.forEach((name) => {
    const filename = name.split(/[\\/]/gi).at(-1);
    const block = Object.values(blockSchemas).find((section) => section.path.includes(name.replace(filename, "")));
    const targetName = `__block--${filename.replace(/\.(ts)x?$/gi, ".js")}`;
    const targetFile = targets.dynamicJs.find((file) => file.includes(targetName));

    if (block && !block.disabled) {
      dynamicJsImports.push(`<script type="module" src="{{ '${targetName}' | asset_url }}" defer></script>`);
    } else if (targetFile) {
      deleteFile(path.join(root_dir, targetFile));
      config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== targetFile);
    }
  });

  sources.classic_blocksJs.forEach((name) => {
    const filename = name.split(/[\\/]/gi).at(-1);
    const block = Object.values(classic_blockSchemas).find((section) => section.path.includes(name.replace(filename, "")));
    const targetName = `__classic_block--${filename.replace(/\.(ts)x?$/gi, ".js")}`;
    const targetFile = targets.dynamicJs.find((file) => file.includes(targetName));

    if (block && !block.disabled) {
      dynamicJsImports.push(`<script type="module" src="{{ '${targetName}' | asset_url }}" defer></script>`);
    } else if (targetFile) {
      deleteFile(path.join(root_dir, targetFile));
      config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== targetFile);
    }
  });

  targets.dynamicJs.forEach((name) => {
    const targetName = name.split(/[\\/]/gi).at(-1).replace(/\.js$/gi, "");

    const sectionFile = sources.sectionsJs.find(
      (section) =>
        section.includes(`\\${targetName.replace(/__section--/gi, "")}.ts`) ||
        section.includes(`/${targetName.replace(/__section--/gi, "")}.ts`)
    );

    if (sectionFile) {
      const filename = sectionFile?.split(/[\\/]/gi)?.at(-1);

      const section = Object.values(sectionsSchemas).find((section) => section.path.includes(sectionFile.replace(filename, "")));

      if (!section || section.disabled) {
        deleteFile(path.join(root_dir, name));
        config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== name);
      }
      return;
    }

    const blockFile = sources.blocksJs.find((section) => section.includes(targetName.replace(/__block--/gi, "")));

    if (blockFile) {
      const filename = blockFile?.split(/[\\/]/gi)?.at(-1);

      const block = Object.values(blockSchemas).find((section) => section.path.includes(blockFile.replace(filename, "")));

      if (!block || block.disabled) {
        deleteFile(path.join(root_dir, name));
        config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== name);
      }
      return;
    }
    const classicBlockFile = sources.classic_blocksJs.find((section) =>
      section.includes(targetName.replace(/__classic_block--/gi, ""))
    );

    if (classicBlockFile) {
      const filename = classicBlockFile?.split(/[\\/]/gi)?.at(-1);

      const block = Object.values(classic_blockSchemas).find((section) =>
        section.path.includes(classicBlockFile.replace(filename, ""))
      );

      if (!block || block.disabled) {
        deleteFile(path.join(root_dir, name));
        config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== name);
      }
      return;
    }

    deleteFile(path.join(root_dir, name));
    config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== name);
  });

  writeCompareFile(
    path.join(process.cwd(), theme_path, "snippets", "_layout.dynamic_imports.liquid"),
    dynamicJsImports.join("\n")
  );

  if (delete_external_snippets) {
    targets.snippets.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = [...snippets].find((sourcePath) =>
        sourcePath?.includes(folders.classic_blocks)
          ? `_blocks.${sourcePath.split(/[\\/]/gi).at(-1)}` === fileName
          : sourcePath.split(/[\\/]/gi).at(-1) === fileName
      );
      if (
        fileName.includes("_layout.translations.liquid") ||
        fileName.includes("_layout.dynamic_imports.liquid") ||
        /^replo/gi.test(fileName) ||
        /^pandectes/gi.test(fileName) ||
        /^locksmith/gi.test(fileName) ||
        /^shogun/gi.test(fileName)
      ) {
        return;
      }
      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_sections) {
    targets.sections.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.sectionsLiquid.find((sourcePath) => sourcePath.split(/[\\/]/gi).at(-1) === fileName);
      if (
        /^replo/gi.test(fileName) ||
        /^pandectes/gi.test(fileName) ||
        /^locksmith/gi.test(fileName) ||
        /^shogun/gi.test(fileName)
      ) {
        return;
      }
      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_layouts) {
    targets.layout.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.layouts.find((sourcePath) => sourcePath.split(/[\\/]/gi).at(-1) === fileName);
      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_blocks) {
    targets.blocks.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile =
        sources.blocksLiquid.find((sourcePath) => sourcePath.split(/[\\/]/gi).at(-1) === fileName) ||
        Object.values(sources.sectionSchemas)?.find((schema) => {
          const schema_file_path = schema.folder.replace(/^_*/gi, "");

          const hasMatchingBlock = (block) => {
            if (
              "theme_block" in block &&
              block.theme_block &&
              !block.disabled &&
              `_${schema_file_path}__${block.type}.liquid` === fileName
            ) {
              return true;
            }
            return block?.blocks?.some(hasMatchingBlock) || false;
          };
          return schema.blocks?.some(hasMatchingBlock);
        }) ||
        Object.values(sources.blockSchemas)?.find((schema) => {
          const schema_file_path = schema.folder.replace(/^_*/gi, "");

          const hasMatchingBlock = (block) => {
            if (
              "theme_block" in block &&
              block.theme_block &&
              !block.disabled &&
              `_${schema_file_path}__${block.type}.liquid` === fileName
            ) {
              return true;
            }
            return block?.blocks?.some(hasMatchingBlock) || false;
          };
          return schema.blocks?.some(hasMatchingBlock);
        });

      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }
};
