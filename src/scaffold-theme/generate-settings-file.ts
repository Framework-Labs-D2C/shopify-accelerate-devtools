import path from "path";
import { config, root_dir } from "../../shopify-accelerate";
import { writeCompareFile } from "../utils/fs";
import { toLocaleFriendlySnakeCase, toSnakeCase } from "../utils/to-snake-case";

export const generateSettingsFile = () => {
  const { theme_path, sources, disabled_locales } = config;
  const localeDuplicates = sources.locale_duplicates;
  const settingsSchema = [...(sources.settingsSchema ?? [])];

  // const cards = sources.cardSchemas;
  /* for (const key in cards) {
    const card = cards[key];
    settingsSchema.push({
      name: `Card: ${card.name}`,
      settings:
        card.settings?.map((setting) =>
          "id" in setting ? { ...setting, id: `c_${toSnakeCase(card.folder)}__${setting.id}` } : setting
        ) ?? [],
    });
  }*/

  const localizedSettings = settingsSchema.map(({ name, ...settingsBlock }) => {
    if (!("settings" in settingsBlock)) return { name, ...settingsBlock };
    const settingsName = toLocaleFriendlySnakeCase(name);
    let paragraphCount = 1;
    let headerCount = 1;

    return {
      name: name?.length <= 25 ? name : `t:settings_schema.${settingsName}.name`,
      ...settingsBlock,
      settings: settingsBlock.settings?.map((setting) => {
        const settingsBase = `t:settings_schema.${settingsName}.settings`;
        if (setting.type === "paragraph") {
          return {
            ...setting,
            content:
              "content" in setting
                ? disabled_locales && !setting.content.includes(" ") && setting.content.length <= 500
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
                ? disabled_locales && !setting.content.includes(" ") && setting.content.length <= 50
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
                ? setting.options.map((option, index) => ({
                    ...option,
                    label:
                      option.label.length <= 50
                        ? option.label
                        : localeDuplicates[toLocaleFriendlySnakeCase(option.label)]?.length > 1
                        ? `t:all.${toLocaleFriendlySnakeCase(option.label)}`
                        : `${settingsBase}.${setting.id}.options__${index + 1}.label`,
                  }))
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

  const schemaContent = JSON.stringify(localizedSettings, undefined, 2).split("\n");
  /* TODO: This should only be a temporary bugfix and not stay long !!!*/
  schemaContent[schemaContent.length - 2] = schemaContent[schemaContent.length - 2].replace("}", "},");

  writeCompareFile(path.join(process.cwd(), theme_path, "config", "settings_schema.json"), schemaContent.join("\n"));
};
