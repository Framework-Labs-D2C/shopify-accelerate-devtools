import { ShopifySection } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";
import { toLocaleFriendlySnakeCase } from "../utils/to-snake-case";

export const generateSectionFiles = ({
  name,
  generate_block_files,
  disabled,
  path,
  folder,
  ...section
}: ShopifySection & { path: string; folder: string }) => {
  const sectionName = toLocaleFriendlySnakeCase(name);
  const { sources, disabled_locales, disabled_theme_blocks } = config;
  const localeDuplicates = sources.locale_duplicates;
  let paragraphCount = 1;
  let headerCount = 1;

  const localizedSection = {
    name: name?.length <= 25 ? name : `t:sections.${sectionName}.name`,
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
            ? disabled_locales && setting.label.length <= 50
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
            ? disabled_locales && setting.placeholder.length <= 50
              ? setting.placeholder
              : localeDuplicates[toLocaleFriendlySnakeCase(setting.placeholder)]?.length > 1
              ? `t:all.${toLocaleFriendlySnakeCase(setting.placeholder)}`
              : `${settingsBase}.${setting.id}.placeholder`
            : undefined,
        options:
          "options" in setting
            ? disabled_locales && setting.options.every((option) => option.label.length <= 50)
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
    blocks: section?.blocks
      ?.filter((block) => !block?.disabled)
      ?.reduce((acc, { name, disabled, ...block }) => {
        let paragraphCount = 1;
        let headerCount = 1;

        if (block.type === "@app") {
          acc.push({ name, ...block });
          return acc;
        }
        if (block.type === "@theme") {
          if (disabled_theme_blocks) {
            for (const key in sources.blockSchemas) {
              let paragraphCount = 1;
              let headerCount = 1;
              const schema = sources.blockSchemas[key];

              if (!schema || schema.disabled) {
                continue;
              }
              acc.push({
                name:
                  schema.name?.length <= 25
                    ? schema.name
                    : `t:blocks.${toLocaleFriendlySnakeCase(schema?.name)}.name`,
                type: schema.folder,
                settings: schema?.settings?.map((setting) => {
                  const settingsBase = `t:blocks.${toLocaleFriendlySnakeCase(
                    schema?.name
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
                            : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length >
                              1
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
                            setting.content.length <= 50
                            ? setting.content
                            : localeDuplicates[toLocaleFriendlySnakeCase(setting.content)]?.length >
                              1
                            ? `t:all.${toLocaleFriendlySnakeCase(setting.content)}`
                            : `${settingsBase}.header__${headerCount++}.content`
                          : undefined,
                    };
                  }
                  return {
                    ...setting,
                    label:
                      "label" in setting
                        ? disabled_locales && setting.label.length <= 50
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
                        ? disabled_locales && setting.placeholder.length <= 50
                          ? setting.placeholder
                          : localeDuplicates[toLocaleFriendlySnakeCase(setting.placeholder)]
                              ?.length > 1
                          ? `t:all.${toLocaleFriendlySnakeCase(setting.placeholder)}`
                          : `${settingsBase}.${setting.id}.placeholder`
                        : undefined,
                    options:
                      "options" in setting
                        ? disabled_locales &&
                          setting.options.every((option) => option.label.length <= 50)
                          ? setting.options
                          : setting.options.map((option, index) => ({
                              ...option,
                              label:
                                localeDuplicates[toLocaleFriendlySnakeCase(option.label)]?.length >
                                1
                                  ? `t:all.${toLocaleFriendlySnakeCase(option.label)}`
                                  : `${settingsBase}.${setting.id}.options__${index + 1}.label`,
                            }))
                        : undefined,
                  };
                }),
              });
            }
            return acc;
          }
          acc.push({ name, ...block });
          return acc;
        }

        acc.push({
          name:
            name?.length <= 25
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
                      setting.content.length <= 50
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
                  ? disabled_locales && setting.label.length <= 50
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
                  ? disabled_locales && setting.placeholder.length <= 50
                    ? setting.placeholder
                    : localeDuplicates[toLocaleFriendlySnakeCase(setting.placeholder)]?.length > 1
                    ? `t:all.${toLocaleFriendlySnakeCase(setting.placeholder)}`
                    : `${settingsBase}.${setting.id}.placeholder`
                  : undefined,
              options:
                "options" in setting
                  ? disabled_locales && setting.options.every((option) => option.label.length <= 50)
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
        });

        return acc;
      }, []),
    presets: section.presets?.map(({ name, ...preset }) => {
      return {
        name:
          name?.length <= 25
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
