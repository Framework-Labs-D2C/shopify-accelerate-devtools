import path from "path";
import { toSnakeCase } from "../utils/to-snake-case";
import { ShopifySettings, ShopifySettingsInput } from "../../@types/shopify";
import { config, root_dir } from "../../shopify-accelerate";
import { writeCompareFile } from "../utils/fs";
import { getSettingsType } from "./generate-section-types";

export const generateSettingTypes = () => {
  const { sources } = config;
  // const cards = sources.cardSchemas;
  const sourceSettings = [...(sources.settingsSchema ?? [])];

  /*for (const key in cards) {
    const card = cards[key];
    sourceSettings.push({
      name: `Card: ${card.name}`,
      settings:
        card.settings?.map((setting) =>
          "id" in setting ? { ...setting, id: `c_${toSnakeCase(card.folder)}__${setting.id}` } : setting
        ) ?? [],
    });
  }*/

  const settings =
    sourceSettings?.reduce((acc: ShopifySettingsInput[], group) => {
      if (!("settings" in group)) return acc;

      return [
        ...acc,
        ...((group.settings as any)
          .filter((s) => s.type !== "header" && s.type !== "paragraph")
          .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)) as ShopifySettingsInput[]),
      ];
    }, []) ?? [];

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

  settings.forEach(analyseSetting);
  const arr = [];
  arr.push(`export type SettingsSchema = {`);
  if (settings?.length) {
    arr.push(
      settings
        .map(
          (setting) =>
            `  /** Input type: ${setting.type} */\n  ` +
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
  arr.push(`};`);

  const typesContent = `import { ${localTypes.join(", ")} } from "./shopify";\n\n${arr.join("\n")}\n`;

  const settingsTypesPath = process.env.SHOPIFY_ACCELERATE_TYPES
    ? path.join(process.cwd(), process.env.SHOPIFY_ACCELERATE_TYPES, "settings.ts")
    : path.join(root_dir, "@types", "settings.ts");

  writeCompareFile(settingsTypesPath, typesContent);
};
