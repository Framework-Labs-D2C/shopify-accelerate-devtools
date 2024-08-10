import { produce } from "immer";
import path from "path";
import { config, root_dir } from "../../shopify-accelerate";
import { writeCompareFile } from "../utils/fs";
import { toLocaleFriendlySnakeCase } from "../utils/to-snake-case";

export const generateSchemaLocales = () => {
  const { theme_path, sources } = config;
  const sections = sources.sectionSchemas;
  const blocks = sources.blockSchemas;
  const settings = sources.settingsSchema;
  const localesDuplicates = sources.locale_duplicates;

  let returnObject = {
    settings_schema: {},
    sections: {},
    blocks: {},
    all: {},
  };

  returnObject = produce(returnObject, (current) => {
    Object.entries(localesDuplicates).forEach(([key, value]) => {
      if (value.length > 1) {
        current["all"][key] = value[0];
      }
    });
  });

  Object.values(sections).forEach((section) => {
    returnObject = produce(returnObject, (current) => {
      const blocks =
        section.blocks?.filter((block) => block.type !== "@app" && block.type !== "@theme") ?? [];

      current.sections[toLocaleFriendlySnakeCase(section.name)] = {
        name: section.name,
        settings: generateSectionSettings(section.settings, localesDuplicates),
        blocks: blocks.length
          ? blocks?.reduce((acc, block) => {
              acc[toLocaleFriendlySnakeCase(block.name)] = {
                name: block.name,
                settings: generateSectionSettings(block.settings, localesDuplicates),
              };
              return acc;
            }, {})
          : undefined,
        presets: section.presets?.reduce((acc, preset) => {
          acc[toLocaleFriendlySnakeCase(preset.name)] = {
            name: preset.name,
          };
          return acc;
        }, {}),
      };
    });
  });

  Object.values(blocks).forEach((schema) => {
    returnObject = produce(returnObject, (current) => {
      const blocks =
        schema.blocks?.filter((block) => block.type !== "@app" && block.type !== "@theme") ?? [];

      current.blocks[toLocaleFriendlySnakeCase(schema.name)] = {
        name: schema.name,
        settings: generateSectionSettings(schema.settings, localesDuplicates),
        blocks: blocks.length
          ? blocks?.reduce((acc, block) => {
              acc[toLocaleFriendlySnakeCase(block.name)] = {
                name: block.name,
                settings: generateSectionSettings(block.settings, localesDuplicates),
              };
              return acc;
            }, {})
          : undefined,
        presets: schema.presets?.reduce((acc, preset) => {
          acc[toLocaleFriendlySnakeCase(preset.name)] = {
            name: preset.name,
          };
          return acc;
        }, {}),
      };
    });
  });

  settings?.forEach((settingsBlock) => {
    if (!("settings" in settingsBlock)) return;

    returnObject = produce(returnObject, (current) => {
      current.settings_schema[toLocaleFriendlySnakeCase(settingsBlock.name)] = {
        name: settingsBlock.name,
        settings: generateSectionSettings(settingsBlock.settings, localesDuplicates),
      };
    });
  });

  const schemaPath = path.join(process.cwd(), theme_path, "locales", "en.default.schema.json");

  writeCompareFile(schemaPath, JSON.stringify(returnObject, null, 2));
};

export const generateSectionSettings = (
  settings,
  sectionLocaleCount: { [T: string]: string[] }
) => {
  if (!settings) return undefined;
  let settingsLocale = {};
  let paragraphCount = 1;
  let headerCount = 1;

  settings?.forEach((setting) => {
    settingsLocale = produce(settingsLocale, (current) => {
      if (setting.type === "paragraph") {
        const key = toLocaleFriendlySnakeCase(setting.content);
        if (sectionLocaleCount[key]?.length > 1) {
          return;
        }
        current[`paragraph__${paragraphCount++}`] = {
          content: setting?.content,
        };
        return;
      }
      if (setting.type === "header") {
        const key = toLocaleFriendlySnakeCase(setting.content);
        if (sectionLocaleCount[key]?.length > 1) {
          return;
        }
        current[`header__${headerCount++}`] = {
          content: setting?.content,
        };
        return;
      }

      if (setting?.id) {
        if (setting.type === "select" || setting.type === "radio") {
          const options = setting.options.reduce(
            (acc, option, index) => {
              const key = toLocaleFriendlySnakeCase(option.label);
              if (sectionLocaleCount[key]?.length > 1) {
                return acc;
              }
              acc[`options__${index + 1}`] = {
                label: option.label,
              };
              return acc;
            },
            // @ts-ignore
            {}
          );

          current[setting.id] = {
            label:
              sectionLocaleCount[toLocaleFriendlySnakeCase(setting?.label)]?.length > 1
                ? undefined
                : setting?.label,
            info:
              sectionLocaleCount[toLocaleFriendlySnakeCase(setting?.info)]?.length > 1
                ? undefined
                : setting?.info,
            placeholder:
              sectionLocaleCount[toLocaleFriendlySnakeCase(setting?.placeholder)]?.length > 1
                ? undefined
                : setting?.placeholder,
            ...options,
          };
          return;
        }
        current[setting.id] = {
          label:
            sectionLocaleCount[toLocaleFriendlySnakeCase(setting?.label)]?.length > 1
              ? undefined
              : setting?.label,
          info:
            sectionLocaleCount[toLocaleFriendlySnakeCase(setting?.info)]?.length > 1
              ? undefined
              : setting?.info,
          placeholder:
            sectionLocaleCount[toLocaleFriendlySnakeCase(setting?.placeholder)]?.length > 1
              ? undefined
              : setting?.placeholder,
        };
      }
    });
  });
  return settingsLocale;
};
