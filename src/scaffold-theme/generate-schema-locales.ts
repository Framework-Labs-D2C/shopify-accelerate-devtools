import { produce } from "immer";
import path from "path";
import { config, root_dir } from "../../shopify-accelerate";
import { writeCompareFile } from "../utils/fs";
import { toLocaleFriendlySnakeCase, toSnakeCase } from "../utils/to-snake-case";

export const generateSchemaLocales = () => {
  const { theme_path, sources, disabled_locales } = config;
  const sections = sources.sectionSchemas;
  const blocks = sources.blockSchemas;
  const classic_blocks = sources.classic_blockSchemas;
  const cards = sources.cardSchemas;
  const settings = [...(sources.settingsSchema ?? [])];

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
      const blocks = section.blocks?.filter((block) => block.type !== "@app" && block.type !== "@theme") ?? [];

      const settings = generateSectionSettings(section.settings, localesDuplicates);

      const presets = section.presets?.reduce((acc, preset) => {
        acc[toLocaleFriendlySnakeCase(preset.name)] =
          preset.name?.length > 25
            ? {
                name: preset.name,
              }
            : undefined;

        if (!Object.values(acc[toLocaleFriendlySnakeCase(preset.name)] ?? {})?.filter(Boolean)?.length) {
          delete acc[toLocaleFriendlySnakeCase(preset.name)];
        }

        return acc;
      }, {});

      const translatedBlocks = blocks?.reduce((acc, block) => {
        const blockSettings = generateSectionSettings(block.settings, localesDuplicates);

        acc[toLocaleFriendlySnakeCase(block.name)] = {
          name: block.name?.length > 25 ? block.name : undefined,
          settings: Object.values(blockSettings ?? {})?.filter(Boolean)?.length ? blockSettings : undefined,
        };
        if (!Object.values(acc[toLocaleFriendlySnakeCase(block.name)] ?? {})?.filter(Boolean)?.length) {
          delete acc[toLocaleFriendlySnakeCase(block.name)];
        }

        return acc;
      }, {});

      current.sections[toLocaleFriendlySnakeCase(section.name)] = {
        name: section?.name?.length <= 25 ? undefined : section.name,
        settings: Object.values(settings ?? {})?.filter(Boolean)?.length ? settings : undefined,
        blocks: blocks.length && Object.values(translatedBlocks ?? {})?.filter(Boolean)?.length ? translatedBlocks : undefined,
        presets: Object.values(presets ?? {})?.filter(Boolean)?.length ? presets : undefined,
      };

      if (!Object.values(current.sections[toLocaleFriendlySnakeCase(section.name)] ?? {})?.filter(Boolean)?.length) {
        delete current.sections[toLocaleFriendlySnakeCase(section.name)];
      }
    });
  });

  Object.values(blocks).forEach((schema) => {
    returnObject = produce(returnObject, (current) => {
      const blocks = schema.blocks?.filter((block) => block.type !== "@app" && block.type !== "@theme") ?? [];

      const settings = generateSectionSettings(schema.settings, localesDuplicates);

      const presets = schema.presets?.reduce((acc, preset) => {
        acc[toLocaleFriendlySnakeCase(preset.name)] =
          preset.name?.length > 25
            ? {
                name: preset.name,
              }
            : undefined;

        if (!Object.values(acc[toLocaleFriendlySnakeCase(preset.name)] ?? {})?.filter(Boolean)?.length) {
          delete acc[toLocaleFriendlySnakeCase(preset.name)];
        }
        return acc;
      }, {});

      const translatedBlocks = blocks?.reduce((acc, block) => {
        const blockSettings = generateSectionSettings(block.settings, localesDuplicates);

        acc[toLocaleFriendlySnakeCase(block.name)] = {
          name: block.name?.length > 25 ? block.name : undefined,
          settings: Object.values(blockSettings ?? {})?.filter(Boolean)?.length ? blockSettings : undefined,
        };

        if (!Object.values(acc[toLocaleFriendlySnakeCase(block.name)] ?? {})?.filter(Boolean)?.length) {
          delete acc[toLocaleFriendlySnakeCase(block.name)];
        }

        return acc;
      }, {});

      current.blocks[toLocaleFriendlySnakeCase(schema.name)] = {
        name: schema.name?.length > 25 ? schema.name : undefined,
        settings: Object.values(settings ?? {})?.filter(Boolean)?.length ? settings : undefined,
        blocks: blocks.length && Object.values(translatedBlocks ?? {})?.filter(Boolean)?.length ? translatedBlocks : undefined,
        presets: Object.values(presets ?? {})?.filter(Boolean)?.length ? presets : undefined,
      };

      if (!Object.values(current.blocks[toLocaleFriendlySnakeCase(schema.name)] ?? {})?.filter(Boolean)?.length) {
        delete current.blocks[toLocaleFriendlySnakeCase(schema.name)];
      }
    });
  });

  Object.values(classic_blocks).forEach((schema) => {
    returnObject = produce(returnObject, (current) => {
      const settings = generateSectionSettings(schema.settings, localesDuplicates);

      const presets = schema.presets?.reduce((acc, preset) => {
        acc[toLocaleFriendlySnakeCase(preset.name)] =
          preset.name?.length > 25
            ? {
                name: preset.name,
              }
            : undefined;

        if (!Object.values(acc[toLocaleFriendlySnakeCase(preset.name)] ?? {})?.filter(Boolean)?.length) {
          delete acc[toLocaleFriendlySnakeCase(preset.name)];
        }
        return acc;
      }, {});

      current.blocks[toLocaleFriendlySnakeCase(schema.name)] = {
        name: schema.name?.length > 25 ? schema.name : undefined,
        settings: Object.values(settings ?? {})?.filter(Boolean)?.length ? settings : undefined,
        presets: Object.values(presets ?? {})?.filter(Boolean)?.length ? presets : undefined,
      };

      if (!Object.values(current.blocks[toLocaleFriendlySnakeCase(schema.name)] ?? {})?.filter(Boolean)?.length) {
        delete current.blocks[toLocaleFriendlySnakeCase(schema.name)];
      }
    });
  });

  for (const key in cards) {
    const card = cards[key];
    settings.push({
      name: `Card: ${card.name}`,
      settings:
        card.settings?.map((setting) =>
          "id" in setting ? { ...setting, id: `c_${toSnakeCase(card.folder)}__${setting.id}` } : setting
        ) ?? [],
    });
  }

  settings?.forEach((settingsBlock) => {
    if (!("settings" in settingsBlock)) return;

    returnObject = produce(returnObject, (current) => {
      const settings = generateSectionSettings(settingsBlock.settings, localesDuplicates);

      current.settings_schema[toLocaleFriendlySnakeCase(settingsBlock.name)] = {
        name: settingsBlock.name?.length > 25 ? settingsBlock.name : undefined,
        settings: Object.values(settings ?? {})?.filter(Boolean)?.length ? settings : undefined,
      };

      if (!Object.values(current.settings_schema[toLocaleFriendlySnakeCase(settingsBlock.name)] ?? {})?.filter(Boolean)?.length) {
        delete current.settings_schema[toLocaleFriendlySnakeCase(settingsBlock.name)];
      }
    });
  });

  const schemaPath = path.join(process.cwd(), theme_path, "locales", "en.default.schema.json");

  writeCompareFile(schemaPath, JSON.stringify(returnObject, null, 2));
};

export const generateSectionSettings = (settings, localesDuplicates: { [T: string]: string[] }) => {
  if (!settings) return undefined;
  const { disabled_locales } = config;
  let settingsLocale = {};
  let paragraphCount = 1;
  let headerCount = 1;

  settings?.forEach((setting) => {
    settingsLocale = produce(settingsLocale, (current) => {
      if (setting.type === "paragraph") {
        const key = toLocaleFriendlySnakeCase(setting.content);
        if (
          localesDuplicates[key]?.length > 1 ||
          (disabled_locales && !setting.content.includes(" ") && setting.content.length < 500)
        ) {
          return;
        }
        current[`paragraph__${paragraphCount++}`] = {
          content: setting?.content,
        };
        return;
      }
      if (setting.type === "header") {
        const key = toLocaleFriendlySnakeCase(setting.content);
        if (
          localesDuplicates[key]?.length > 1 ||
          (disabled_locales && !setting.content.includes(" ") && setting.content.length < 500)
        ) {
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
              if (localesDuplicates[key]?.length > 1 || disabled_locales) {
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
              localesDuplicates[toLocaleFriendlySnakeCase(setting?.label)]?.length > 1 || disabled_locales
                ? undefined
                : setting?.label,
            info:
              localesDuplicates[toLocaleFriendlySnakeCase(setting?.info)]?.length > 1 ||
              (disabled_locales && (setting?.info?.length ?? 0) < 500)
                ? undefined
                : setting?.info,
            placeholder:
              localesDuplicates[toLocaleFriendlySnakeCase(setting?.placeholder)]?.length > 1 || disabled_locales
                ? undefined
                : setting?.placeholder,
            ...options,
          };
          if (!Object.values(current[setting.id]).filter(Boolean)?.length) {
            current[setting.id] = undefined;
          }
          return;
        }
        current[setting.id] = {
          label:
            localesDuplicates[toLocaleFriendlySnakeCase(setting?.label)]?.length > 1 || disabled_locales
              ? undefined
              : setting?.label,
          info:
            localesDuplicates[toLocaleFriendlySnakeCase(setting?.info)]?.length > 1 ||
            (disabled_locales && (setting?.info?.length ?? 0) < 500)
              ? undefined
              : setting?.info,
          placeholder:
            localesDuplicates[toLocaleFriendlySnakeCase(setting?.placeholder)]?.length > 1 || disabled_locales
              ? undefined
              : setting?.placeholder,
        };
        if (!Object.values(current[setting.id]).filter(Boolean)?.length) {
          current[setting.id] = undefined;
        }
      }
    });
  });
  return settingsLocale;
};
