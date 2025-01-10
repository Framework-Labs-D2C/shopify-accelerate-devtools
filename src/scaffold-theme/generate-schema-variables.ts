import chalk from "chalk";
import fs from "fs";
import path from "path";
import { toSnakeCase } from "../utils/to-snake-case";
import { ShopifyBlock, ShopifyCard, ShopifySection, ShopifyThemeBlock } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";

export const generateSchemaVariables = () => {
  const { folders, sources } = config;

  const sections = sources.sectionSchemas as {
    [T: string]: ShopifySection<{ blocks: any; settings: any }> & { path: string; folder: string };
  };

  for (const key in sections) {
    const schema = sections[key];

    const sectionLiquid = path.join(folders.sections, schema.folder, `${schema.folder}.liquid`);

    const start = "{%- comment -%} Auto Generated Variables start {%- endcomment -%}";
    const end = "{%- comment -%} Auto Generated Variables end {%- endcomment -%}";

    const variables = [start];
    variables.push("{%- liquid");
    variables.push(`  assign section_type = "${schema.folder}"`);

    schema.settings?.forEach((setting) => {
      if (setting.type === "header" || setting.type === "paragraph") return;
      variables.push(
        `  assign ${RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id} = section.settings.${setting.id}`
      );
    });

    variables.push("-%}");
    variables.push(end);
    variables.push("");
    variables.push("");

    const variableContent = schema.settings && schema.settings.length ? variables.join("\n") : "";

    if (!fs.existsSync(sectionLiquid)) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
          `Created: ${sectionLiquid.replace(process.cwd(), "")}`
        )}`
      );
      fs.writeFileSync(sectionLiquid, schema.settings ? variables.join("\n") : "");
      config.sources.sectionsLiquid = [...new Set([...config.sources.sectionsLiquid, sectionLiquid])];
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

    schema.blocks?.forEach((block) => {
      if (block.type === "@app") return;
      if (block.type === "@theme") return;
      if (!block.name) return;
      // @ts-ignore
      if (Array.isArray(schema.generate_block_files) && !schema.generate_block_files?.includes(block.type)) {
        return;
      }

      const blockPath = path.join(folders.sections, schema.folder, `${schema.folder}.${block.type}.liquid`);

      const blockVariables = [start];
      blockVariables.push("{%- liquid");
      blockVariables.push(`  assign block_type = "${block.type}"`);
      blockVariables.push(`  assign section_type = "${schema.folder}"`);

      block?.settings?.forEach((setting) => {
        if (setting.type === "header" || setting.type === "paragraph") return;
        blockVariables.push(
          `  assign ${RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id} = block.settings.${setting.id}`
        );
      });

      blockVariables.push("-%}");
      blockVariables.push(end);
      blockVariables.push("");
      blockVariables.push("");

      const variableContent = block?.settings && block?.settings?.length ? blockVariables.join("\n") : "";

      if (!fs.existsSync(blockPath)) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
            `Created: ${blockPath.replace(process.cwd(), "")}`
          )}`
        );
        fs.writeFileSync(blockPath, block?.settings ? blockVariables.join("\n") : "");
        config.sources.snippets.add(blockPath);
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

  const blocks = sources.blockSchemas as {
    [T: string]: ShopifyThemeBlock<{ blocks: any; settings: any }> & { path: string; folder: string };
  };

  for (const key in blocks) {
    const schema = blocks[key];

    const itemLiquid = path.join(folders.blocks, schema.folder, `${schema.folder}.liquid`);

    const start = "{%- comment -%} Auto Generated Variables start {%- endcomment -%}";
    const end = "{%- comment -%} Auto Generated Variables end {%- endcomment -%}";

    const variables = [start];
    variables.push("{%- liquid");
    variables.push(`  assign block_type = "${schema.folder}"`);

    schema.settings?.forEach((setting) => {
      if (setting.type === "header" || setting.type === "paragraph") return;
      variables.push(
        `  assign ${RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id} = block.settings.${setting.id}`
      );
    });

    variables.push("-%}");
    variables.push(end);
    variables.push("");
    variables.push("");

    const variableContent = schema.settings && schema.settings.length ? variables.join("\n") : "";

    if (!fs.existsSync(itemLiquid)) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
          `Created: ${itemLiquid.replace(process.cwd(), "")}`
        )}`
      );
      fs.writeFileSync(itemLiquid, schema.settings ? variables.join("\n") : "");
      config.sources.blocksLiquid = [...new Set([...config.sources.blocksLiquid, itemLiquid])];
    }

    if (fs.existsSync(itemLiquid)) {
      const itemContent = fs.readFileSync(itemLiquid, {
        encoding: "utf-8",
      });

      if (itemContent.includes(start) && itemContent.includes(end)) {
        const newContent = itemContent.replace(
          // eslint-disable-next-line max-len
          /({%- comment -%} Auto Generated Variables start {%- endcomment -%})(.|\n|\r)*({%- comment -%} Auto Generated Variables end {%- endcomment -%})(\r|\n|\s)*/gim,
          variableContent
        );

        if (itemContent !== newContent) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
              `Updated: ${itemLiquid.replace(process.cwd(), "")}`
            )}`
          );
          fs.writeFileSync(itemLiquid, newContent);
        }
      }

      if (!itemContent.includes(start) && !itemContent.includes(end) && variableContent) {
        const newContent = variableContent + itemContent;

        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
            `Updated: ${itemLiquid.replace(process.cwd(), "")}`
          )}`
        );
        fs.writeFileSync(itemLiquid, newContent);
      }
    }

    /*schema.blocks?.forEach((block) => {
      if (block.type === "@app") return;
      if (block.type === "@theme") return;

      const blockPath = path.join(folders.sections, schema.folder, `${schema.folder}.${block.type}.liquid`);

      const blockVariables = [start];
      blockVariables.push("{%- liquid");
      blockVariables.push(`  assign block_type = "${block.type}"`);
      blockVariables.push(`  assign blocK_section_type = "${schema.folder}"`);

      block?.settings?.forEach((setting) => {
        if (setting.type === "header" || setting.type === "paragraph") return;
        blockVariables.push(
          `  assign ${RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id} = block.settings.${setting.id}`
        );
      });

      blockVariables.push("-%}");
      blockVariables.push(end);
      blockVariables.push("");
      blockVariables.push("");

      const variableContent = block?.settings && block?.settings?.length ? blockVariables.join("\n") : "";

      if (!fs.existsSync(blockPath)) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
            `Created: ${blockPath.replace(process.cwd(), "")}`
          )}`
        );
        fs.writeFileSync(blockPath, block?.settings ? blockVariables.join("\n") : "");
        config.sources.snippets = [...new Set([...config.sources.snippets, blockPath])];
      }

      if (fs.existsSync(blockPath)) {
        const blockContent = fs.readFileSync(blockPath, {
          encoding: "utf-8",
        });
        if (blockContent.includes(start) && blockContent.includes(end)) {
          const newContent = blockContent.replace(
            // eslint-disable-next-line max-len
            /({%- comment -%} Auto Generated Variables start {%- endcomment -%})(.|\n|\r)*({%- comment -%} Auto Generated Variables end {%- endcomment -%})(\r|\n|\s)*!/gim,
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
    });*/
  }

  const classic_blocks = sources.classic_blockSchemas as {
    [T: string]: ShopifyBlock<{ settings: any }> & { path: string; folder: string };
  };

  for (const key in classic_blocks) {
    const schema = classic_blocks[key];

    const itemLiquid = path.join(folders.classic_blocks, schema.folder, `${schema.folder}.liquid`);

    const start = "{%- comment -%} Auto Generated Variables start {%- endcomment -%}";
    const end = "{%- comment -%} Auto Generated Variables end {%- endcomment -%}";

    const variables = [start];
    variables.push("{%- liquid");

    variables.push(`  assign block_type = "_blocks.${schema.folder}"`);

    schema.settings?.forEach((setting) => {
      if (setting.type === "header" || setting.type === "paragraph") return;
      variables.push(
        `  assign ${RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id} = block.settings.${setting.id}`
      );
    });

    variables.push("-%}");
    variables.push(end);
    variables.push("");
    variables.push("");

    const variableContent = schema.settings && schema.settings.length ? variables.join("\n") : "";

    if (!fs.existsSync(itemLiquid)) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
          `Created: ${itemLiquid.replace(process.cwd(), "")}`
        )}`
      );
      fs.writeFileSync(itemLiquid, schema.settings ? variables.join("\n") : "");
      config.sources.classic_blocksLiquid = [...new Set([...config.sources.classic_blocksLiquid, itemLiquid])];
      config.sources.snippets.add(itemLiquid);
    }

    if (fs.existsSync(itemLiquid)) {
      const itemContent = fs.readFileSync(itemLiquid, {
        encoding: "utf-8",
      });

      if (itemContent.includes(start) && itemContent.includes(end)) {
        const newContent = itemContent.replace(
          // eslint-disable-next-line max-len
          /({%- comment -%} Auto Generated Variables start {%- endcomment -%})(.|\n|\r)*({%- comment -%} Auto Generated Variables end {%- endcomment -%})(\r|\n|\s)*/gim,
          variableContent
        );

        if (itemContent !== newContent) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
              `Updated: ${itemLiquid.replace(process.cwd(), "")}`
            )}`
          );
          fs.writeFileSync(itemLiquid, newContent);
        }
      }

      if (!itemContent.includes(start) && !itemContent.includes(end) && variableContent) {
        const newContent = variableContent + itemContent;

        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
            `Updated: ${itemLiquid.replace(process.cwd(), "")}`
          )}`
        );
        fs.writeFileSync(itemLiquid, newContent);
      }
    }
  }

  const cards = sources.cardSchemas as {
    [T: string]: ShopifyCard<{ settings: any }> & { path: string; folder: string };
  };

  for (const key in cards) {
    const schema = cards[key];

    const liquidFilePath = path.join(folders.cards, schema.folder, `${schema.folder}.liquid`);

    const start = "{%- comment -%} Auto Generated Variables start {%- endcomment -%}";
    const end = "{%- comment -%} Auto Generated Variables end {%- endcomment -%}";

    const variables = [start];
    variables.push("{%- liquid");
    variables.push(`  comment`);
    variables.push(`    Call via:  {% render "_card.${schema.folder}" %}`);
    variables.push(`  endcomment`);
    variables.push(`  assign card_type = "${schema.folder}"`);

    schema.settings?.forEach((setting) => {
      if (setting.type === "header" || setting.type === "paragraph") return;
      variables.push(
        `  assign ${RESERVED_VARIABLES.includes(setting.id) ? `_${setting.id}` : setting.id} = settings.c_${toSnakeCase(
          schema.folder
        )}__${setting.id}`
      );
    });

    variables.push("-%}");
    variables.push(end);
    variables.push("");
    variables.push("");

    const variableContent = schema.settings && schema.settings.length ? variables.join("\n") : "";

    if (!fs.existsSync(liquidFilePath)) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
          `Created: ${liquidFilePath.replace(process.cwd(), "")}`
        )}`
      );
      fs.writeFileSync(liquidFilePath, schema.settings ? variables.join("\n") : "");
      config.sources.cardsLiquid = [...new Set([...config.sources.cardsLiquid, liquidFilePath])];
    }

    if (fs.existsSync(liquidFilePath)) {
      const cardContent = fs.readFileSync(liquidFilePath, {
        encoding: "utf-8",
      });

      if (cardContent.includes(start) && cardContent.includes(end)) {
        const newContent = cardContent.replace(
          // eslint-disable-next-line max-len
          /({%- comment -%} Auto Generated Variables start {%- endcomment -%})(.|\n|\r)*({%- comment -%} Auto Generated Variables end {%- endcomment -%})(\r|\n|\s)*/gim,
          variableContent
        );

        if (cardContent !== newContent) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
              `Updated: ${liquidFilePath.replace(process.cwd(), "")}`
            )}`
          );
          fs.writeFileSync(liquidFilePath, newContent);
        }
      }

      if (!cardContent.includes(start) && !cardContent.includes(end) && variableContent) {
        const newContent = variableContent + cardContent;

        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
            `Updated: ${liquidFilePath.replace(process.cwd(), "")}`
          )}`
        );
        fs.writeFileSync(liquidFilePath, newContent);
      }
    }
  }
};

export const RESERVED_VARIABLES = [
  "additional_checkout_buttons",
  "all_country_option_tags",
  "all_products",
  "article",
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
  "form",
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
