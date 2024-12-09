import { ShopifyBlock } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";
import { toLocaleFriendlySnakeCase } from "../utils/to-snake-case";

export const generateBlockFiles = ({
  name,
  disabled,
  generate_block_files,
  path,
  folder,
  ...section
}: ShopifyBlock & { path: string; folder: string }) => {
  const blockName = toLocaleFriendlySnakeCase(name);
  const { sources, disabled_locales } = config;
  const localeDuplicates = sources.locale_duplicates;
  let paragraphCount = 1;
  let headerCount = 1;

  const localizedBlock = {
    name: name?.length <= 25 ? name : `t:blocks.${blockName}.name`,
    ...section,
    settings: section?.settings?.map((setting) => {
      const settingsBase = `t:blocks.${blockName}.settings`;
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
      if (block.type && !name) return { name, ...block };

      return {
        name:
          name?.length <= 25
            ? name
            : `t:blocks.${blockName}.blocks.${toLocaleFriendlySnakeCase(name)}.name`,
        ...block,
        settings: block?.settings?.map((setting) => {
          const settingsBase = `t:blocks.${blockName}.blocks.${toLocaleFriendlySnakeCase(
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
        name:
          name?.length <= 25
            ? name
            : `t:blocks.${blockName}.presets.${toLocaleFriendlySnakeCase(name)}.name`,
        ...preset,
      };
    }),
  };

  return `{% schema %}
${JSON.stringify(localizedBlock, undefined, 2)}
{% endschema %}
`;
};
