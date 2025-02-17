import path from "path";
import { ShopifySection, ShopifySettingsInput } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";
import { capitalize } from "../utils/capitalize";
import { writeCompareFile } from "../utils/fs";
import { toPascalCase } from "../utils/to-pascal-case";

export const generateSectionsTypes = () => {
  const { folders, sources } = config;
  const sections = sources.sectionSchemas;

  const sectionTypesPath = path.join(folders.types, "sections.ts");

  const imports = getImports(sections);
  let sectionUnionType = "export type Sections =";
  let typeContent = "";
  for (const key in sections) {
    const schema = sections[key] as ShopifySection;

    typeContent += `${sectionToTypes(schema, key)}\n`;
    sectionUnionType += `\n  | ${capitalize(key)}Section`;
  }

  if (!typeContent) return;

  const finalContent = `${imports + typeContent + sectionUnionType};\n`;

  writeCompareFile(sectionTypesPath, finalContent);
};

export const getImports = (sections: { [T: string]: ShopifySection }) => {
  const localTypes = [];
  let themeBlocks = false;
  let classicThemeBlocks = false;
  const analyseSetting = (setting) => {
    if (setting.type === "richtext") {
      if (localTypes.includes("_BlockTag")) return;
      localTypes.push("_BlockTag");
    }
    if (setting.type === "article") {
      if (localTypes.includes("_Article_liquid")) return;
      localTypes.push("_Article_liquid");
    }
    if (setting.type === "blog") {
      if (localTypes.includes("_Blog_liquid")) return;
      localTypes.push("_Blog_liquid");
    }
    if (setting.type === "collection" && !setting.id.includes("__handle_only")) {
      if (localTypes.includes("_Collection_liquid")) return;
      localTypes.push("_Collection_liquid");
    }
    if (setting.type === "collection_list" && !setting.id.includes("__handle_only")) {
      if (localTypes.includes("_Collection_liquid")) return;
      localTypes.push("_Collection_liquid");
    }
    if (setting.type === "color") {
      if (localTypes.includes("_Color_liquid")) return;
      localTypes.push("_Color_liquid");
    }
    if (setting.type === "image_picker") {
      if (localTypes.includes("_Image_liquid")) return;
      localTypes.push("_Image_liquid");
    }
    if (setting.type === "font_picker") {
      if (localTypes.includes("_Font_liquid")) return;
      localTypes.push("_Font_liquid");
    }
    if (setting.type === "font_picker") {
      if (localTypes.includes("_Font_options")) return;
      localTypes.push("_Font_options");
    }
    if (setting.type === "link_list") {
      if (localTypes.includes("_Linklist_liquid")) return;
      localTypes.push("_Linklist_liquid");
    }
    if (setting.type === "page") {
      if (localTypes.includes("_Page_liquid")) return;
      localTypes.push("_Page_liquid");
    }
    if (setting.type === "product" && !setting.id.includes("__handle_only")) {
      if (localTypes.includes("_Product_liquid")) return;
      localTypes.push("_Product_liquid");
    }
    if (setting.type === "product_list" && !setting.id.includes("__handle_only")) {
      if (localTypes.includes("_Product_liquid")) return;
      localTypes.push("_Product_liquid");
    }
    if (setting.type === "video") {
      if (localTypes.includes("_Video_liquid")) return;
      localTypes.push("_Video_liquid");
    }
  };

  for (const key in sections) {
    const schema = sections[key];

    schema.settings?.forEach(analyseSetting, localTypes);
    if (
      schema.blocks?.some(
        (block) =>
          block.type === "@theme" ||
          `theme_block` in block ||
          (!block.name && block.type && block.type !== "@app" && block.type !== "@theme" && block.type !== "@classic_theme")
      )
    ) {
      themeBlocks = true;
    }
    if (schema.blocks?.some((block) => block.type === "@classic_theme")) {
      classicThemeBlocks = true;
    }
    schema.blocks?.forEach((block) => {
      block?.settings?.forEach(analyseSetting, localTypes);
    });
  }

  const returnArr = [];

  if (localTypes.length) {
    returnArr.push(`import { ${localTypes.join(", ")} } from "./shopify";`);
  }

  if (themeBlocks) {
    returnArr.push(`import { ThemeBlocks } from "./blocks";`);
  }
  if (classicThemeBlocks) {
    returnArr.push(`import { ClassicThemeBlocks } from "./classic-blocks";`);
  }
  returnArr.push(``);
  return returnArr.join("\n");
};

export const sectionToTypes = (section, key) => {
  const filename = section.folder;
  const arr = [];
  const settings: ShopifySettingsInput[] = section.settings
    ?.filter((s) => s.type !== "header" && s.type !== "paragraph")
    .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  const hasNonThemeBlocks = section.blocks?.filter((b) => b.type !== "@app" && b.type !== "@theme" && b.type !== "@classic_theme")
    ?.length;
  const hasThemeBlocks = section.blocks?.some((block) => block.type === "@theme");
  const hasClassicThemeBlocks = section.blocks?.some((block) => block.type === "@classic_theme");

  arr.push(`export type ${capitalize(key)}Section = {`);
  if (hasNonThemeBlocks && !hasThemeBlocks && !hasClassicThemeBlocks) {
    arr.push(`  blocks: ${capitalize(key)}Blocks[];`);
  }
  if (!hasNonThemeBlocks && hasThemeBlocks && !hasClassicThemeBlocks) {
    arr.push(`  blocks: ThemeBlocks[];`);
  }
  if (!hasNonThemeBlocks && !hasThemeBlocks && hasClassicThemeBlocks) {
    arr.push(`  blocks: ClassicThemeBlocks[];`);
  }
  if (hasNonThemeBlocks && !hasThemeBlocks && hasClassicThemeBlocks) {
    arr.push(`  blocks: (${capitalize(key)}Blocks | ClassicThemeBlocks)[];`);
  }
  if (!hasNonThemeBlocks && !hasThemeBlocks && !hasClassicThemeBlocks) {
    arr.push(`  blocks${config.headless ? "?" : ""}: never[];`);
  }
  arr.push(`  id${config.headless ? "?" : ""}: string;`);
  arr.push(`  disabled?: boolean;`);
  arr.push(`  settings${!settings?.length ? "?" : ""}: {`);
  if (settings?.length) {
    arr.push(
      settings
        .map(
          (setting) =>
            `    /** Input type: ${setting.type} */\n    ` +
            `${/[^\w_]/gi.test(setting.id) ? `"${setting.id}"` : `${setting.id}`}${getSettingsType(setting)};`
        )
        .sort((a, b) => {
          const aX = a.split("\n")[1];
          const bX = b.split("\n")[1];
          if (aX.includes("?") && !bX.includes("?")) {
            return 1;
          } else if (!aX.includes("?") && bX.includes("?")) {
            return -1;
          } else if (aX > bX) {
            return 1;
          } else if (aX < bX) {
            return -1;
          } else {
            return 0;
          }
        })
        .join("\n")
    );
  }
  arr.push(`  };`);
  arr.push(`  type: "${filename}";`);
  arr.push(`};`);

  if (section.blocks?.length) {
    section.blocks?.forEach((block) => {
      if (!block.name || block.theme_block) {
        return;
      }
      const blockSettings: ShopifySettingsInput[] = block?.settings
        ?.filter((s) => s.type !== "header" && s.type !== "paragraph")
        .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

      arr.push("");
      arr.push(`export type ${capitalize(key)}Blocks${toPascalCase(block.type.replace("@", ""))} = {`);
      arr.push(`  id${config.headless ? "?" : ""}: string;`);

      if (blockSettings?.length) {
        arr.push(`  settings: {`);
        arr.push(
          blockSettings
            .map(
              (setting) =>
                `    /** Input type: ${setting.type} */\n    ` +
                `${/[^\w_]/gi.test(setting.id) ? `"${setting.id}"` : `${setting.id}`}${getSettingsType(setting)};`
            )
            .sort((a, b) => {
              const aX = a.split("\n")[1];
              const bX = b.split("\n")[1];
              if (aX.includes("?") && !bX.includes("?")) {
                return 1;
              } else if (!aX.includes("?") && bX.includes("?")) {
                return -1;
              } else if (aX > bX) {
                return 1;
              } else if (aX < bX) {
                return -1;
              } else {
                return 0;
              }
            })
            .join("\n")
        );
        arr.push(`  };`);
      }

      arr.push(`  type: "${block.type}";`);
      arr.push(`};`);
    });
  }

  if (section.blocks?.length && section.blocks?.length === 1) {
    const block = section.blocks[0];
    if (block.type === "@app" || block.type === "@theme" || block.type === "@classic_theme") {
    } else if (!block.name && block.type) {
      arr.push("");
      arr.push(`export type ${capitalize(key)}Blocks = Extract<ThemeBlocks, { type: "${block.type}" }>;`);
    } else if (block.theme_block) {
      arr.push("");
      arr.push(
        `export type ${capitalize(key)}Blocks = Extract<ThemeBlocks, { type: "_${section.folder.replace(/^_*/gi, "")}__${
          block.type
        }" }>;`
      );
    } else {
      arr.push("");
      arr.push(`export type ${capitalize(key)}Blocks = ${capitalize(key)}Blocks${toPascalCase(block.type.replace("@", ""))};`);
    }
  }

  if (section.blocks?.length && section.blocks?.length > 1) {
    arr.push("");
    arr.push(`export type ${capitalize(key)}Blocks =`);

    section.blocks?.forEach((block, i) => {
      if (block.type === "@app" || block.type === "@theme" || block.type === "@classic_theme") {
      } else if (!block.name && block.type) {
        if (section.blocks?.length - 1 === i) {
          arr.push(`  | Extract<ThemeBlocks, { type: "${block.type}" }>;`);
        } else {
          arr.push(`  | Extract<ThemeBlocks, { type: "${block.type}" }>`);
        }
      } else if (block.theme_block) {
        if (section.blocks?.length - 1 === i) {
          arr.push(`  | Extract<ThemeBlocks, { type: "_${section.folder.replace(/^_*/gi, "")}__${block.type}" }>;`);
        } else {
          arr.push(`  | Extract<ThemeBlocks, { type: "_${section.folder.replace(/^_*/gi, "")}__${block.type}" }>`);
        }
      } else {
        if (section.blocks?.length - 1 === i) {
          arr.push(`  | ${capitalize(key)}Blocks${toPascalCase(block.type.replace("@", ""))};`);
        } else {
          arr.push(`  | ${capitalize(key)}Blocks${toPascalCase(block.type.replace("@", ""))}`);
        }
      }
    });
  }
  arr.push("");
  return arr.join("\n");
};

export const getSettingsType = (setting: ShopifySettingsInput) => {
  switch (setting.type) {
    case "article":
      return "?: _Article_liquid | string";
    case "checkbox":
      return ": boolean";
    case "number":
      return "?: number";
    case "radio":
      return `: ${setting.options.map(({ value }) => `"${value}"`).join(" | ")}`;
    case "range":
      return ": number";
    case "select":
      return `: ${setting.options.map(({ value }) => `"${value}"`).join(" | ")}`;
    case "text":
      return "?: string";
    case "textarea":
      return "?: string";
    case "blog":
      return "?: _Blog_liquid | string";
    case "collection": {
      if (setting.id.includes("__handle_only")) {
        return "?: string";
      }
      return "?: _Collection_liquid";
    }
    case "collection_list": {
      if (setting.id.includes("__handle_only")) {
        return "?: string[]";
      }
      return "?: _Collection_liquid[]";
    }
    case "color":
      return config.headless ? "?: string" : "?: _Color_liquid | string";
    case "color_background":
      return "?: string";
    case "font_picker":
      return config.headless ? ": string" : ": _Font_liquid | _Font_options";
    case "html":
      return "?: string";
    case "image_picker":
      return config.headless ? "?: { src?: string | null, alt?: string | null }" : "?: _Image_liquid | string";
    case "link_list":
      return "?: _Linklist_liquid";
    case "liquid":
      return "?: string";
    case "page":
      return "?: _Page_liquid | string";
    case "product": {
      if (setting.id.includes("__handle_only") || config.headless) {
        return "?: string";
      }
      return "?: _Product_liquid";
    }
    case "product_list": {
      if (setting.id.includes("__handle_only") || config.headless) {
        return "?: string[]";
      }
      return "?: _Product_liquid[]";
    }
    case "color_scheme_group":
      return `?: {\n    [T:string]: {${setting.definition
        .map((option) => {
          if ("id" in option) {
            return `\n      ${option.id}: string;`;
          }
          return "";
        })
        .join("")}\n    }\n  }`;
    case "richtext":
      return "?: `<${_BlockTag}${string}</${_BlockTag}>`";
    case "inline_richtext":
      return "?: string";
    case "url":
      return "?: string";
    case "video":
      return config.headless
        ? "?:  { src?: string | null,  mimeType?: string | null, alt?: string | null }"
        : "?:  _Video_liquid";
    case "video_url":
      return "?:  `${string}youtube${string}` | `${string}vimeo${string}`";
    case "font":
      return "?: string";
    case "color_scheme":
      return "?: string";
    case "text_alignment":
      return `: "left" | "center" | "right"`;
  }
};
