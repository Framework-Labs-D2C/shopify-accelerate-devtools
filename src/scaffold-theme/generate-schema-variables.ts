import chalk from "chalk";
import fs from "fs";
import path from "path";
import { ShopifySection } from "../../@types/shopify";
import { useGlobals } from "../../shopify-accelerate";

export const generateSchemaVariables = () => {
  const { folders, sources } = useGlobals.getState();

  const sections = sources.sectionSchemas as {
    [T: string]: ShopifySection<{ blocks: any; settings: any }> & { path: string; folder: string };
  };
  for (const key in sections) {
    const section = sections[key];

    const sectionLiquid = path.join(folders.sections, section.folder, `${section.folder}.liquid`);

    const start = "{%- comment -%} Auto Generated Variables start {%- endcomment -%}";
    const end = "{%- comment -%} Auto Generated Variables end {%- endcomment -%}";

    const variables = [start];
    variables.push("{%- liquid");

    section.settings?.forEach((setting) => {
      if (setting.type === "header" || setting.type === "paragraph") return;
      variables.push(
        `  assign ${
          RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id
        } = section.settings.${setting.id}`
      );
    });

    variables.push("-%}");
    variables.push(end);
    variables.push("");
    variables.push("");

    const variableContent = section.settings && section.settings.length ? variables.join("\n") : "";

    if (!fs.existsSync(sectionLiquid)) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
          `Created: ${sectionLiquid.replace(process.cwd(), "")}`
        )}`
      );
      fs.writeFileSync(sectionLiquid, section.settings ? variables.join("\n") : "");
    }

    if (fs.existsSync(sectionLiquid)) {
      const sectionContent = fs.readFileSync(sectionLiquid, {
        encoding: "utf-8",
      });

      if (sectionContent.includes(start) && sectionContent.includes(end)) {
        const newContent = sectionContent.replace(
          // eslint-disable-next-line max-len
          /({%- comment -%} Auto Generated Variables start {%- endcomment -%})(.|\n|\r)*({%- comment -%} Auto Generated Variables end {%- endcomment -%})(\r|\n|\s)*/gim,
          variableContent
        );

        if (sectionContent !== newContent) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
              `Updated: ${sectionLiquid.replace(process.cwd(), "")}`
            )}`
          );
          fs.writeFileSync(sectionLiquid, newContent);
        }
      }

      if (!sectionContent.includes(start) && !sectionContent.includes(end) && variableContent) {
        const newContent = variableContent + sectionContent;

        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
            `Updated: ${sectionLiquid.replace(process.cwd(), "")}`
          )}`
        );
        fs.writeFileSync(sectionLiquid, newContent);
      }
    }

    if (section.disabled_block_files) {
      continue;
    }
    section.blocks?.forEach((block) => {
      if (block.type === "@app") return;
      if (
        Array.isArray(section.generate_block_files) &&
        !section.generate_block_files.includes(block.type)
      ) {
        return;
      }

      const blockPath = path.join(
        folders.sections,
        section.folder,
        `${section.folder}.${block.type}.liquid`
      );

      const blockVariables = [start];
      blockVariables.push("{%- liquid");

      block?.settings?.forEach((setting) => {
        if (setting.type === "header" || setting.type === "paragraph") return;
        blockVariables.push(
          `  assign ${
            RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id
          } = block.settings.${setting.id}`
        );
      });

      blockVariables.push("-%}");
      blockVariables.push(end);
      blockVariables.push("");
      blockVariables.push("");

      const variableContent =
        block?.settings && block?.settings?.length ? blockVariables.join("\n") : "";

      if (!fs.existsSync(blockPath)) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
            `Created: ${blockPath.replace(process.cwd(), "")}`
          )}`
        );
        fs.writeFileSync(blockPath, block?.settings ? blockVariables.join("\n") : "");
      }

      if (fs.existsSync(blockPath)) {
        const blockContent = fs.readFileSync(blockPath, {
          encoding: "utf-8",
        });
        if (blockContent.includes(start) && blockContent.includes(end)) {
          const newContent = blockContent.replace(
            // eslint-disable-next-line max-len
            /({%- comment -%} Auto Generated Variables start {%- endcomment -%})(.|\n|\r)*({%- comment -%} Auto Generated Variables end {%- endcomment -%})(\r|\n|\s)*/gim,
            variableContent
          );

          if (blockContent !== newContent) {
            console.log(
              `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
                `Updated: ${blockPath.replace(process.cwd(), "")}`
              )}`
            );
            fs.writeFileSync(blockPath, newContent);
          }
        }

        if (!blockContent.includes(start) && !blockContent.includes(end) && variableContent) {
          const newContent = variableContent + blockContent;

          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
              `Updated: ${blockPath.replace(process.cwd(), "")}`
            )}`
          );
          fs.writeFileSync(blockPath, newContent);
        }
      }
    });
  }
};

export const RESERVED_VARIABLES = [
  "additional_checkout_buttons",
  "all_country_option_tags",
  "all_products",
  "articles",
  "blogs",
  "canonical_url",
  "collections",
  "content_for_additional_checkout_buttons",
  "content_for_header",
  "content_for_index",
  "content_for_layout",
  "country_option_tags",
  "current_page",
  "customer",
  "handle",
  "images",
  "linklists",
  "page_description",
  "page_image",
  "page_title",
  "pages",
  "powered_by_link",
  "settings",
  "collection",
  "canonical_url ",
  "product",
  "shop",
  "page",
  "blog",
  "request",
  "scripts",
  "paginate",
  "checkout",
  "location",
  "current_tags",
  "block",
  "blocks",
  "currency",
  "date",
  "gift_card",
  "routes",
  "sitemap",
  "theme",
  "shop_locale",
  "template",
  "search",
  "recommendations",
  "group",
];
