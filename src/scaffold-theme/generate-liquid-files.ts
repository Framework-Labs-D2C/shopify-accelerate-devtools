import chalk from "chalk";
import fs from "fs";
import path from "path";
import { ShopifySection, ShopifySettings } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";
import { writeCompareFile } from "../utils/fs";
import { toLocaleFriendlySnakeCase } from "../utils/to-snake-case";

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

  generateSettingsFile();

  for (const key in sectionsSchemas) {
    const section = sectionsSchemas[key];
    if (section.disabled) continue;

    const sectionName = `${section.folder}.liquid`;
    const sectionPath = path.join(process.cwd(), theme_path, "sections", sectionName);

    const translationArray = [];

    const rawContent = fs.readFileSync(path.join(folders.sections, section.folder, sectionName), {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(
        /<t(\s+[^>]*)*>((.|\r|\n)*?)<\/t>/gi,
        (str, group1, group2) => {
          const group = toLocaleFriendlySnakeCase(section.folder);
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

    translationArray.push(generateSectionFiles(section));

    writeCompareFile(sectionPath, translationArray.join("\n"));
  }

  for (let i = 0; i < snippets.length; i++) {
    const snippet = snippets[i];
    const snippetName = snippet.split(/[\\/]/gi).at(-1);

    const snippetPath = path.join(process.cwd(), theme_path, "snippets", snippetName);

    const returnArr = [];

    const rawContent = fs.readFileSync(snippet, {
      encoding: "utf-8",
    });

    if (rawContent) {
      const translatedContent = rawContent.replace(
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

  let localesFile = "en.default.json";
  if (process.env.SHOPIFY_CMS_LOCALES) {
    localesFile = process.env.SHOPIFY_CMS_LOCALES;
  }
  const translationsPath = path.join(process.cwd(), theme_path, "locales", localesFile);
  const translationJsPath = path.join(
    process.cwd(),
    theme_path,
    "snippets",
    "_layout.translations.liquid"
  );
  const translationTypesPath = path.join(folders.types, "translations.ts");

  function isObject(x: any): x is Object {
    return x !== null && typeof x === "object" && !Array.isArray(x);
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

  writeCompareFile(translationsPath, JSON.stringify(translations, undefined, 2));
  writeCompareFile(translationJsPath, translationsJs);
  writeCompareFile(translationTypesPath, translationTypes);

  if (delete_external_snippets) {
    targets.snippets.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = snippets.find((sourcePath) =>
        sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
      );
      if (fileName.includes("_layout.translations.liquid")) {
        return;
      }
      if (!targetFile) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Deleted: ${file}`)}`
        );
        fs.unlinkSync(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_sections) {
    targets.sections.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.sectionsLiquid.find((sourcePath) =>
        sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
      );
      if (!targetFile) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Deleted: ${file}`)}`
        );
        fs.unlinkSync(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_layouts) {
    targets.layout.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.layouts.find((sourcePath) =>
        sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
      );
      if (!targetFile) {
        console.log(sources.layouts);
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Deleted: ${file}`)}`
        );
        fs.unlinkSync(path.join(process.cwd(), file));
      }
    });
  }

  if (delete_external_blocks) {
    targets.blocks.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.blocks.find((sourcePath) =>
        sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
      );
      if (!targetFile) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Deleted: ${file}`)}`
        );
        fs.unlinkSync(path.join(process.cwd(), file));
      }
    });
  }
};

export const generateSectionFiles = ({
  name,
  disabled_block_files,
  generate_block_files,
  disabled,
  path,
  folder,
  ...section
}: ShopifySection & { path: string; folder: string }) => {
  const sectionName = toLocaleFriendlySnakeCase(name);
  const { sources, disabled_locales } = config;
  const localeDuplicates = sources.locale_duplicates;
  let paragraphCount = 1;
  let headerCount = 1;

  const localizedSection = {
    name: disabled_locales ? name : `t:sections.${sectionName}.name`,
    ...section,
    settings: section?.settings?.map((setting) => {
      const settingsBase = `t:sections.${sectionName}.settings`;
      if (setting.type === "paragraph") {
        return {
          ...setting,
          content:
            "content" in setting
              ? disabled_locales && !setting.content.includes(" ") && setting.content.length < 500
                ? setting.content
                : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length > 1
                ? `t:all.${toLocaleFriendlySnakeCase(setting.content)}`
                : `${settingsBase}.paragraph__${paragraphCount++}.content`
              : undefined,
        };
      }
      if (setting.type === "header") {
        return {
          ...setting,
          content:
            "content" in setting
              ? disabled_locales && !setting.content.includes(" ") && setting.content.length < 500
                ? setting.content
                : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length > 1
                ? `t:all.${toLocaleFriendlySnakeCase(setting.content)}`
                : `${settingsBase}.header__${headerCount++}.content`
              : undefined,
        };
      }
      return {
        ...setting,
        label:
          "label" in setting
            ? disabled_locales
              ? setting.label
              : localeDuplicates[toLocaleFriendlySnakeCase(setting.label)]?.length > 1
              ? `t:all.${toLocaleFriendlySnakeCase(setting.label)}`
              : `${settingsBase}.${setting.id}.label`
            : undefined,
        info:
          "info" in setting
            ? disabled_locales && setting.info.length < 500
              ? setting.info
              : localeDuplicates[toLocaleFriendlySnakeCase(setting.info)]?.length > 1
              ? `t:all.${toLocaleFriendlySnakeCase(setting.info)}`
              : `${settingsBase}.${setting.id}.info`
            : undefined,
        placeholder:
          "placeholder" in setting && typeof setting.placeholder === "string"
            ? disabled_locales
              ? setting.placeholder
              : localeDuplicates[toLocaleFriendlySnakeCase(setting.placeholder)]?.length > 1
              ? `t:all.${toLocaleFriendlySnakeCase(setting.placeholder)}`
              : `${settingsBase}.${setting.id}.placeholder`
            : undefined,
        options:
          "options" in setting
            ? disabled_locales
              ? setting.options
              : setting.options.map((option, index) => ({
                  ...option,
                  label:
                    localeDuplicates[toLocaleFriendlySnakeCase(option.label)]?.length > 1
                      ? `t:all.${toLocaleFriendlySnakeCase(option.label)}`
                      : `${settingsBase}.${setting.id}.options__${index + 1}.label`,
                }))
            : undefined,
      };
    }),
    blocks: section.blocks?.map(({ name, ...block }) => {
      let paragraphCount = 1;
      let headerCount = 1;

      if (block.type === "@app") return { name, ...block };

      return {
        name: disabled_locales
          ? name
          : `t:sections.${sectionName}.blocks.${toLocaleFriendlySnakeCase(name)}.name`,
        ...block,
        settings: block?.settings?.map((setting) => {
          const settingsBase = `t:sections.${sectionName}.blocks.${toLocaleFriendlySnakeCase(
            name
          )}.settings`;

          if (setting.type === "paragraph") {
            return {
              ...setting,
              content:
                "content" in setting
                  ? disabled_locales &&
                    !setting.content.includes(" ") &&
                    setting.content.length < 500
                    ? setting.content
                    : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length > 1
                    ? `t:all.${toLocaleFriendlySnakeCase(setting.content)}`
                    : `${settingsBase}.paragraph__${paragraphCount++}.content`
                  : undefined,
            };
          }
          if (setting.type === "header") {
            return {
              ...setting,
              content:
                "content" in setting
                  ? disabled_locales &&
                    !setting.content.includes(" ") &&
                    setting.content.length < 500
                    ? setting.content
                    : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length > 1
                    ? `t:all.${toLocaleFriendlySnakeCase(setting.content)}`
                    : `${settingsBase}.header__${headerCount++}.content`
                  : undefined,
            };
          }
          return {
            ...setting,
            label:
              "label" in setting
                ? disabled_locales
                  ? setting.label
                  : localeDuplicates[toLocaleFriendlySnakeCase(setting.label)]?.length > 1
                  ? `t:all.${toLocaleFriendlySnakeCase(setting.label)}`
                  : `${settingsBase}.${setting.id}.label`
                : undefined,
            info:
              "info" in setting
                ? disabled_locales && setting.info.length < 500
                  ? setting.info
                  : localeDuplicates[toLocaleFriendlySnakeCase(setting.info)]?.length > 1
                  ? `t:all.${toLocaleFriendlySnakeCase(setting.info)}`
                  : `${settingsBase}.${setting.id}.info`
                : undefined,
            placeholder:
              "placeholder" in setting && typeof setting.placeholder === "string"
                ? disabled_locales
                  ? setting.placeholder
                  : localeDuplicates[toLocaleFriendlySnakeCase(setting.placeholder)]?.length > 1
                  ? `t:all.${toLocaleFriendlySnakeCase(setting.placeholder)}`
                  : `${settingsBase}.${setting.id}.placeholder`
                : undefined,
            options:
              "options" in setting
                ? disabled_locales
                  ? setting.options
                  : setting.options.map((option, index) => ({
                      ...option,
                      label:
                        localeDuplicates[toLocaleFriendlySnakeCase(option.label)]?.length > 1
                          ? `t:all.${toLocaleFriendlySnakeCase(option.label)}`
                          : `${settingsBase}.${setting.id}.options__${index + 1}.label`,
                    }))
                : undefined,
          };
        }),
      };
    }),
    presets: section.presets?.map(({ name, ...preset }) => {
      return {
        name: disabled_locales
          ? name
          : `t:sections.${sectionName}.presets.${toLocaleFriendlySnakeCase(name)}.name`,
        ...preset,
      };
    }),
  };

  return `{% schema %}
${JSON.stringify(localizedSection, undefined, 2)}
{% endschema %}
`;
};

export const generateSettingsFile = () => {
  const { theme_path, sources, disabled_locales } = config;
  const localeDuplicates = sources.locale_duplicates;
  const settingsSchema = sources.settingsSchema;
  const localizedSettings = settingsSchema.map(({ name, ...settingsBlock }) => {
    if (!("settings" in settingsBlock)) return { name, ...settingsBlock };
    const settingsName = toLocaleFriendlySnakeCase(name);
    let paragraphCount = 1;
    let headerCount = 1;

    return {
      name: disabled_locales ? name : `t:settings_schema.${settingsName}.name`,
      ...settingsBlock,
      settings: settingsBlock.settings?.map((setting) => {
        const settingsBase = `t:settings_schema.${settingsName}.settings`;
        if (setting.type === "paragraph") {
          return {
            ...setting,
            content:
              "content" in setting
                ? disabled_locales && !setting.content.includes(" ") && setting.content.length < 500
                  ? setting.content
                  : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length > 1
                  ? `t:all.${toLocaleFriendlySnakeCase(setting.content)}`
                  : `${settingsBase}.paragraph__${paragraphCount++}.content`
                : undefined,
          };
        }
        if (setting.type === "header") {
          return {
            ...setting,
            content:
              "content" in setting
                ? disabled_locales && !setting.content.includes(" ") && setting.content.length < 500
                  ? setting.content
                  : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length > 1
                  ? `t:all.${toLocaleFriendlySnakeCase(setting.content)}`
                  : `${settingsBase}.header__${headerCount++}.content`
                : undefined,
          };
        }

        return {
          ...setting,
          label:
            "label" in setting
              ? disabled_locales
                ? setting.label
                : localeDuplicates[toLocaleFriendlySnakeCase(setting.label)]?.length > 1
                ? `t:all.${toLocaleFriendlySnakeCase(setting.label)}`
                : `${settingsBase}.${setting.id}.label`
              : undefined,
          info:
            "info" in setting
              ? disabled_locales && setting.info.length < 500
                ? setting.info
                : localeDuplicates[toLocaleFriendlySnakeCase(setting.info)]?.length > 1
                ? `t:all.${toLocaleFriendlySnakeCase(setting.info)}`
                : `${settingsBase}.${setting.id}.info`
              : undefined,
          placeholder:
            "placeholder" in setting && typeof setting.placeholder === "string"
              ? disabled_locales
                ? setting.placeholder
                : localeDuplicates[toLocaleFriendlySnakeCase(setting.placeholder)]?.length > 1
                ? `t:all.${toLocaleFriendlySnakeCase(setting.placeholder)}`
                : `${settingsBase}.${setting.id}.placeholder`
              : undefined,
          options:
            "options" in setting
              ? disabled_locales
                ? setting.options
                : setting.options.map((option, index) => ({
                    ...option,
                    label:
                      localeDuplicates[toLocaleFriendlySnakeCase(option.label)]?.length > 1
                        ? `t:all.${toLocaleFriendlySnakeCase(option.label)}`
                        : `${settingsBase}.${setting.id}.options__${index + 1}.label`,
                  }))
              : undefined,
        };
      }),
    };
  });

  const schemaContent = JSON.stringify(localizedSettings, undefined, 2);

  writeCompareFile(
    path.join(process.cwd(), theme_path, "config", "settings_schema.json"),
    schemaContent
  );
};
