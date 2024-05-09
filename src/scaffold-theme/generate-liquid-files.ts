import chalk from "chalk";
import fs from "fs";
import path from "path";
import { config } from "../../shopify-accelerate";
import { deleteFile, writeCompareFile } from "../utils/fs";
import { isObject } from "../utils/is-object";
import { toLocaleFriendlySnakeCase } from "../utils/to-snake-case";
import { generateBlockFiles } from "./generate-block-files";
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
    disabled_theme_blocks,
  } = config;

  const translations: any = {};
  const snippets = sources.snippets;
  const giftCards = sources.giftCards;
  const layouts = sources.layouts;
  const sectionsSchemas = sources.sectionSchemas;
  const blockSchemas = sources.blockSchemas;

  generateSettingsFile();

  for (const key in sectionsSchemas) {
    const schema = sectionsSchemas[key];

    const sectionName = `${schema.folder}.liquid`;
    const sectionPath = path.join(process.cwd(), theme_path, "sections", sectionName);

    if (schema.disabled) {
      const targetFile = targets.sections.find(
        (target) => target.split(/[\\/]/gi).at(-1) === sectionName
      );
      if (targetFile) {
        config.targets.sections = config.targets.sections.filter((target) => target !== targetFile);
        deleteFile(path.join(process.cwd(), targetFile));
      }
      const snippetTargets = targets.snippets.filter(
        (target) => `${target.split(/[\\/]/gi).at(-1).split(".")[0]}.liquid` === sectionName
      );

      if (snippetTargets.length) {
        config.targets.snippets = config.targets.snippets.filter((target) => {
          if (snippetTargets.includes(target)) {
            deleteFile(path.join(process.cwd(), target));
            return false;
          }
          return true;
        });
      }
      continue;
    }

    let translationArray = [];

    const rawContent = fs.readFileSync(path.join(folders.sections, schema.folder, sectionName), {
      encoding: "utf-8",
    });

    if (rawContent) {
      let translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (str, group1, group2) => {
          const group = toLocaleFriendlySnakeCase(schema.folder);
          const content = toLocaleFriendlySnakeCase(
            group2?.split(" ")?.slice(0, 2)?.join("_") ?? ""
          ).trim();
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
        }
      );
      if (disabled_theme_blocks) {
        translatedContent = translatedContent?.replace(
          /\n(\s*){%-?\s*content_for\s*['"]blocks["']\s*-?%}/gi,
          (str, match) => {
            const arr = [`\n${match}{% liquid`];
            arr.push(`${match}  for block in section.blocks`);
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}    if block.type == "${key}"`);
              arr.push(`${match}      render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}    endif`);
            }
            arr.push(`${match}  endfor`);
            arr.push(`${match}%}`);

            return arr.join("\n");
          }
        );

        translatedContent = translatedContent?.replace(
          /\n(\s*)content_for\s*['"]blocks["']\s*\n/gi,
          (str, match) => {
            const arr = [`\n${match}`];
            arr.push(`${match}for block in section.blocks`);
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}  if block.type == "${key}"`);
              arr.push(`${match}    render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}  endif`);
            }
            arr.push(`${match}endfor`);
            arr.push(``);
            return arr.join("\n");
          }
        );

        translatedContent = translatedContent?.replace(
          /\n(\s*){%-?\s*content_for\s*['"]block["']\s*-?%}/gi,
          (str, match) => {
            const arr = [`\n${match}{% liquid`];
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}  if block.type == "${key}"`);
              arr.push(`${match}    render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}  endif`);
            }
            arr.push(`${match}%}`);

            return arr.join("\n");
          }
        );
        translatedContent = translatedContent?.replace(
          /\n(\s*)content_for\s*['"]block["']\s*\n/gi,
          (str, match) => {
            const arr = [`\n${match}`];
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}if block.type == "${key}"`);
              arr.push(`${match}  render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}endif`);
            }
            arr.push(``);

            return arr.join("\n");
          }
        );
      }
      translationArray.push(translatedContent);
    }

    if (schema.section_as_snippet) {
      const snippetPath = path.join(process.cwd(), theme_path, "snippets", sectionName);
      writeCompareFile(snippetPath, translationArray.join("\n"));
      snippets.push(snippetPath);
      translationArray = [`{%- render "${schema.folder}" -%}`];
    }
    translationArray.push(generateSectionFiles(schema));

    writeCompareFile(sectionPath, translationArray.join("\n"));
  }

  for (const key in blockSchemas) {
    const schema = blockSchemas[key];

    const sectionName = `${schema.folder}.liquid`;
    const sectionPath = disabled_theme_blocks
      ? path.join(process.cwd(), theme_path, "snippets", sectionName)
      : path.join(process.cwd(), theme_path, "blocks", sectionName);

    if (schema.disabled) {
      const targetFile = targets.blocks.find(
        (target) => target.split(/[\\/]/gi).at(-1) === sectionName
      );
      if (targetFile) {
        config.targets.blocks = config.targets.blocks.filter((target) => target !== targetFile);
        deleteFile(path.join(process.cwd(), targetFile));
      }

      const snippetTargets = targets.snippets.filter((target) => {
        return (
          target
            .split(/[\\/]/gi)
            .at(-1)
            .replace(/_blocks\./gi, "") === sectionName
        );
      });

      if (snippetTargets.length) {
        config.targets.snippets = config.targets.snippets.filter((target) => {
          if (snippetTargets.includes(target)) {
            deleteFile(path.join(process.cwd(), target));
            return false;
          }
          return true;
        });
      }
      continue;
    }

    const translationArray = [];

    const rawContent = fs.readFileSync(path.join(folders.blocks, schema.folder, sectionName), {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (str, group1, group2) => {
          const group = toLocaleFriendlySnakeCase(schema.folder);
          const content = toLocaleFriendlySnakeCase(
            group2?.split(" ")?.slice(0, 2)?.join("_") ?? ""
          ).trim();
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
        }
      );

      translationArray.push(translatedContent);
    }

    translationArray.push(generateBlockFiles(schema));
    if (disabled_theme_blocks) continue;

    writeCompareFile(sectionPath, translationArray.join("\n"));
  }

  for (let i = 0; i < snippets.length; i++) {
    const snippet = snippets[i];
    const snippetName = snippet.split(/[\\/]/gi).at(-1);

    const section = Object.values(sectionsSchemas).find((section) =>
      section.path.includes(snippet.replace(snippetName, ""))
    );
    if (section && section.disabled) {
      continue;
    }
    const block = Object.values(blockSchemas).find((section) =>
      section.path.includes(snippet.replace(snippetName, ""))
    );
    if (block && block.disabled) {
      continue;
    }
    const snippetPath =
      disabled_theme_blocks && snippet?.includes(folders.blocks)
        ? path.join(process.cwd(), theme_path, "snippets", `_blocks.${snippetName}`)
        : path.join(process.cwd(), theme_path, "snippets", snippetName);

    const returnArr = [];

    const rawContent = fs.readFileSync(snippet, {
      encoding: "utf-8",
    });

    if (rawContent) {
      let translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (_, group1, group2) => {
          const group = toLocaleFriendlySnakeCase(
            snippet.split(/[\\/]/gi).at(-1).split(".").at(0)
          ).trim();
          const content = toLocaleFriendlySnakeCase(
            group2?.split(" ")?.slice(0, 2)?.join("_") ?? ""
          ).trim();
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
        }
      );

      if (disabled_theme_blocks) {
        translatedContent = translatedContent?.replace(
          /\n(\s*){%-?\s*content_for\s*['"]blocks["']\s*-?%}/gi,
          (str, match) => {
            const arr = [`\n${match}{% liquid`];
            arr.push(`${match}  for block in section.blocks`);
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}    if block.type == "${key}"`);
              arr.push(`${match}      render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}    endif`);
            }
            arr.push(`${match}  endfor`);
            arr.push(`${match}%}`);

            return arr.join("\n");
          }
        );

        translatedContent = translatedContent?.replace(
          /\n(\s*)content_for\s*['"]blocks["']\s*\n/gi,
          (str, match) => {
            const arr = [`\n${match}`];
            arr.push(`${match}for block in section.blocks`);
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}  if block.type == "${key}"`);
              arr.push(`${match}    render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}  endif`);
            }
            arr.push(`${match}endfor`);
            arr.push(``);
            return arr.join("\n");
          }
        );

        translatedContent = translatedContent?.replace(
          /\n(\s*){%-?\s*content_for\s*['"]block["']\s*-?%}/gi,
          (str, match) => {
            const arr = [`\n${match}{% liquid`];
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}  if block.type == "${key}"`);
              arr.push(`${match}    render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}  endif`);
            }
            arr.push(`${match}%}`);

            return arr.join("\n");
          }
        );
        translatedContent = translatedContent?.replace(
          /\n(\s*)content_for\s*['"]block["']\s*\n/gi,
          (str, match) => {
            const arr = [`\n${match}`];
            for (const key in blockSchemas) {
              const schema = blockSchemas[key];
              if (schema.disabled) continue;
              arr.push(`${match}if block.type == "${key}"`);
              arr.push(`${match}  render "_blocks.${key}", block: block, forloop: forloop`);
              arr.push(`${match}endif`);
            }
            arr.push(``);

            return arr.join("\n");
          }
        );
      }

      returnArr.push(translatedContent);
    }

    writeCompareFile(snippetPath, returnArr.join("\n"));
  }

  for (let i = 0; i < giftCards.length; i++) {
    const giftCard = giftCards[i];
    const giftCardName = giftCard.split(/[\\/]/gi).at(-1);

    const giftCardPath = path.join(process.cwd(), theme_path, "templates", giftCardName);

    const returnArr = [];

    const rawContent = fs.readFileSync(giftCard, {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (_, group1, group2) => {
          const group = toLocaleFriendlySnakeCase(
            giftCard.split(/[\\/]/gi).at(-1).split(".").at(0)
          ).trim();
          const content = toLocaleFriendlySnakeCase(
            group2?.split(" ")?.slice(0, 2)?.join("_") ?? ""
          ).trim();
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
        }
      );
      returnArr.push(translatedContent);
    }

    writeCompareFile(giftCardPath, returnArr.join("\n"));
  }

  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    const layoutName = layout.split(/[\\/]/gi).at(-1);
    const layoutPath = path.join(process.cwd(), theme_path, "layout", layoutName);

    const returnArr = [];

    const rawContent = fs.readFileSync(layout, {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (_, group1, group2) => {
          const group = toLocaleFriendlySnakeCase(
            layout.split(/[\\/]/gi).at(-1).split(".").at(0)
          ).trim();
          const content = toLocaleFriendlySnakeCase(
            group2?.split(" ")?.slice(0, 2)?.join("_") ?? ""
          ).trim();
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
        }
      );
      returnArr.push(translatedContent);
    }

    writeCompareFile(layoutPath, returnArr.join("\n"));
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
  writeCompareFile(
    path.join(process.cwd(), theme_path, "snippets", "_layout.translations.liquid"),
    translationsJs
  );
  writeCompareFile(path.join(folders.types, "translations.ts"), translationTypes);

  const dynamicJsImports = [];

  sources.sectionsJs.forEach((name) => {
    const filename = name.split(/[\\/]/gi).at(-1);
    const section = Object.values(sectionsSchemas).find((section) =>
      section.path.includes(name.replace(filename, ""))
    );
    const targetName = `__section--${filename.replace(/\.(ts)x?$/gi, ".js")}`;
    const targetFile = targets.dynamicJs.find((file) => file.includes(targetName));

    if (section && !section.disabled) {
      dynamicJsImports.push(
        `<link rel="preload" as="script" href="{{ '${targetName}' | asset_url }}">`
      );
      dynamicJsImports.push(
        `<script type="module" src="{{ '${targetName}' | asset_url }}" defer></script>`
      );
    } else if (targetFile) {
      deleteFile(path.join(process.cwd(), targetFile));
      config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== targetFile);
    }
  });

  sources.blocksJs.forEach((name) => {
    const filename = name.split(/[\\/]/gi).at(-1);
    const block = Object.values(blockSchemas).find((section) =>
      section.path.includes(name.replace(filename, ""))
    );
    const targetName = `__block--${filename.replace(/\.(ts)x?$/gi, ".js")}`;
    const targetFile = targets.dynamicJs.find((file) => file.includes(targetName));

    if (block && !block.disabled) {
      dynamicJsImports.push(
        `<link rel="preload" as="script" href="{{ '${targetName}' | asset_url }}">`
      );
      dynamicJsImports.push(
        `<script type="module" src="{{ '${targetName}' | asset_url }}" defer></script>`
      );
    } else if (targetFile) {
      deleteFile(path.join(process.cwd(), targetFile));
      config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== targetFile);
    }
  });

  targets.dynamicJs.forEach((name) => {
    const targetName = name.split(/[\\/]/gi).at(-1).replace(/\.js$/gi, "");

    const sectionFile = sources.sectionsJs.find((section) =>
      section.includes(targetName.replace(/__section--/gi, ""))
    );

    if (sectionFile) {
      const filename = sectionFile?.split(/[\\/]/gi)?.at(-1);

      const section = Object.values(sectionsSchemas).find((section) =>
        section.path.includes(sectionFile.replace(filename, ""))
      );

      if (!section || section.disabled) {
        deleteFile(path.join(process.cwd(), name));
        config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== name);
      }
      return;
    }

    const blockFile = sources.blocksJs.find((section) =>
      section.includes(targetName.replace(/__block--/gi, ""))
    );

    if (blockFile) {
      const filename = blockFile?.split(/[\\/]/gi)?.at(-1);

      const block = Object.values(blockSchemas).find((section) =>
        section.path.includes(blockFile.replace(filename, ""))
      );

      if (!block || block.disabled) {
        deleteFile(path.join(process.cwd(), name));
        config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== name);
      }
      return;
    }
    deleteFile(path.join(process.cwd(), name));
    config.targets.dynamicJs = config.targets.dynamicJs.filter((target) => target !== name);
  });

  writeCompareFile(
    path.join(process.cwd(), theme_path, "snippets", "_layout.dynamic-imports.liquid"),
    dynamicJsImports.join("\n")
  );

  if (delete_external_snippets) {
    targets.snippets.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = snippets.find((sourcePath) =>
        disabled_theme_blocks && sourcePath?.includes(folders.blocks)
          ? `_blocks.${sourcePath.split(/[\\/]/gi).at(-1)}` === fileName
          : sourcePath.split(/[\\/]/gi).at(-1) === fileName
      );
      if (
        fileName.includes("_layout.translations.liquid") ||
        fileName.includes("_layout.dynamic-imports.liquid")
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
      const targetFile = sources.sectionsLiquid.find(
        (sourcePath) => sourcePath.split(/[\\/]/gi).at(-1) === fileName
      );
      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_layouts) {
    targets.layout.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.layouts.find(
        (sourcePath) => sourcePath.split(/[\\/]/gi).at(-1) === fileName
      );
      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_blocks) {
    targets.blocks.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.blocksLiquid.find(
        (sourcePath) => sourcePath.split(/[\\/]/gi).at(-1) === fileName
      );
      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }
};
