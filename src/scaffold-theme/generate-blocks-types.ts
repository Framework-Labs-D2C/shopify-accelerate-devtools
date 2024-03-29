import path from "path";
import { ShopifyBlock, ShopifySection, ShopifySettingsInput } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";
import { capitalize } from "../utils/capitalize";
import { writeCompareFile } from "../utils/fs";
import { toPascalCase } from "../utils/to-pascal-case";

export const generateBlocksTypes = () => {
  const { folders, sources } = config;
  const sections = sources.blockSchemas;

  const blockTypesPath = path.join(folders.types, "blocks.ts");

  const imports = getImports(sections);
  let sectionUnionType = "export type ThemeBlocks =";
  let typeContent = "";
  for (const key in sections) {
    const schema = sections[key] as ShopifyBlock;

    typeContent += `${blockToTypes(schema, key)}\n`;
    sectionUnionType += `\n  | ${capitalize(key)}Block`;
  }

  if (!typeContent) return;

  const finalContent = `${imports + typeContent + sectionUnionType};\n`;

  writeCompareFile(blockTypesPath, finalContent);
};

export const getImports = (sections: { [T: string]: ShopifyBlock }) => {
  const localTypes = [];

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
    schema.blocks?.forEach((block) => {
      block?.settings?.forEach(analyseSetting, localTypes);
    });
  }

  if (localTypes.length) {
    return `import { ${localTypes.join(", ")} } from "./shopify";\n\n`;
  }
  return ``;
};

export const blockToTypes = (section, key) => {
  const filename = section.folder;
  const arr = [];
  const settings: ShopifySettingsInput[] = section.settings
    ?.filter((s) => s.type !== "header" && s.type !== "paragraph")
    .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

  arr.push(`export type ${capitalize(key)}Block = {`);
  if (section.blocks?.some((block) => block.type === "@theme")) {
    arr.push(`  blocks: ThemeBlocks[];`);
  }
  arr.push(`  id: string;`);
  if (settings?.length) {
    arr.push(`  settings: {`);
    arr.push(
      settings
        .map(
          (setting) =>
            `    /** Input type: ${setting.type} */\n    ` +
            `${/[^\w_]/gi.test(setting.id) ? `"${setting.id}"` : `${setting.id}`}${getSettingsType(
              setting
            )};`
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
  arr.push(`  type: "${filename}";`);
  arr.push(`};`);

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
      return "?: _Color_liquid | string";
    case "color_background":
      return "?: string";
    case "font_picker":
      return ": _Font_liquid | _Font_options";
    case "html":
      return "?: string";
    case "image_picker":
      return "?: _Image_liquid | string";
    case "link_list":
      return "?: _Linklist_liquid";
    case "liquid":
      return "?: string";
    case "page":
      return "?: _Page_liquid | string";
    case "product": {
      if (setting.id.includes("__handle_only")) {
        return "?: string";
      }
      return "?: _Product_liquid";
    }
    case "product_list": {
      if (setting.id.includes("__handle_only")) {
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
      return "?:  _Video_liquid";
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
