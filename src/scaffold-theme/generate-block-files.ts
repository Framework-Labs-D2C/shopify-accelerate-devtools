import { ShopifyBlock } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";
import { toLocaleFriendlySnakeCase } from "../utils/to-snake-case";

export const generateBlockFiles = ({
  name,
  type,
  disabled,
  path,
  folder,
  ...section
}: ShopifyBlock & { path: string; folder: string }) => {
  const sectionName = toLocaleFriendlySnakeCase(name);
  const { sources, disabled_locales } = config;
  const localeDuplicates = sources.locale_duplicates;
  let paragraphCount = 1;
  let headerCount = 1;

  const localizedSection = {
    name: disabled_locales ? name : `t:blocks.${sectionName}.name`,
    ...section,
    settings: section?.settings?.map((setting) => {
      const settingsBase = `t:blocks.${sectionName}.settings`;
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
      if (block.type === "@theme") return { name, ...block };

      return {
        name: disabled_locales
          ? name
          : `t:blocks.${sectionName}.blocks.${toLocaleFriendlySnakeCase(name)}.name`,
        ...block,
        settings: block?.settings?.map((setting) => {
          const settingsBase = `t:blocks.${sectionName}.blocks.${toLocaleFriendlySnakeCase(
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
          : `t:blocks.${sectionName}.presets.${toLocaleFriendlySnakeCase(name)}.name`,
        ...preset,
      };
    }),
  };

  return `{% schema %}
${JSON.stringify(localizedSection, undefined, 2)}
{% endschema %}
`;
};
