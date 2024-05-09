#!/usr/bin/env ts-node-script

import fs from "fs";
import path from "path";
import toml from "toml";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ShopifyBlock, ShopifySection, ShopifySettings } from "./@types/shopify";
import { runEsbuild } from "./src/esbuild/esbuild";
import { buildTheme } from "./src/scaffold-theme/build-theme";
import { generateConfigFiles } from "./src/scaffold-theme/generate-config-files";
import { shopifyCliPull } from "./src/shopify-cli/pull";
import { runTailwindCSSWatcher } from "./src/tailwind/tailwind-watch";
import { readFile } from "./src/utils/fs";
import { JSONParse } from "./src/utils/json";
import { validateCliOptions } from "./src/validate-cli-options";
import { watchTheme } from "./src/watch-theme/watch-theme";

const { Command } = require("commander");
const program = new Command();
require("dotenv").config();

const tomlFile = fs.existsSync(path.join(process.cwd(), "shopify.theme.toml"))
  ? toml.parse(
      readFile(path.join(process.cwd(), "shopify.theme.toml"), {
        encoding: "utf-8",
      })
    )
  : null;

const shopify_toml = tomlFile
  ? JSONParse<{
      environments: {
        [T: string]: {
          theme: string | number;
          store: string;
          path: string;
          ignore?: string[];
          output?: "json";
          live?: boolean;
          "allow-live"?: boolean;
        };
      };
    }>(JSON.stringify(tomlFile))
  : { environments: {} };

export type GlobalsState = {
  package_root: string;
  package_templates: string;
  package_types: string;
  project_root: ReturnType<typeof process.cwd>;

  theme_id: number;
  theme_path: string;
  store: string;
  environment: keyof (typeof shopify_toml)["environments"];
  environments: (typeof shopify_toml)["environments"];
  ignore_blocks: string[];
  ignore_snippets: string[];
  ignore_layouts: string[];
  ignore_sections: string[];
  ignore_assets: string[];
  delete_external_layouts?: boolean;
  delete_external_sections?: boolean;
  delete_external_snippets?: boolean;
  delete_external_blocks?: boolean;
  delete_external_assets?: boolean;
  disabled_locales?: boolean;
  disabled_theme_blocks?: boolean;
  sources: {
    snippets: string[];
    layouts: string[];
    sectionsLiquid: string[];
    sectionsSchemaFiles: string[];
    sectionsJs: string[];
    blocksLiquid: string[];
    blocksSchemaFiles: string[];
    blocksJs: string[];
    blockSchemas: { [T: string]: ShopifyBlock & { path: string; folder: string } };
    assets: string[];
    giftCards: string[];
    configs: string[];
    sectionGroups: string[];
    templates: string[];
    customerTemplates: string[];
    settingsFile: string[];
    locale_duplicates: { [T: string]: string[] };
    settingsSchema: ShopifySettings;
    sectionSchemas: { [T: string]: ShopifySection & { path: string; folder: string } };
  };
  targets: {
    assets: string[];
    dynamicJs: string[];
    blocks: string[];
    layout: string[];
    locales: string[];
    snippets: string[];
    sections: string[];
    settings: string;
    giftCards: string[];
    sectionGroups: string[];
    configs: string[];
    templates: string[];
    customerTemplates: string[];
  };
  folders: {
    types: string;
    utils: string;
    sections: string;
    layout: string;
    blocks: string;
    snippets: string;
    templates: string;
    assets: string;
    config: string;
  };
};

export const config: GlobalsState = {
  ignore_blocks:
    process.env.SHOPIFY_ACCELERATE_IGNORE_BLOCKS?.split(",").map((str) => str.trim()) ?? [],
  ignore_snippets:
    process.env.SHOPIFY_ACCELERATE_IGNORE_SNIPPETS?.split(",").map((str) => str.trim()) ?? [],
  ignore_layouts:
    process.env.SHOPIFY_ACCELERATE_IGNORE_LAYOUTS?.split(",").map((str) => str.trim()) ?? [],
  ignore_sections:
    process.env.SHOPIFY_ACCELERATE_IGNORE_SECTIONS?.split(",").map((str) => str.trim()) ?? [],
  ignore_assets:
    process.env.SHOPIFY_ACCELERATE_IGNORE_ASSETS?.split(",").map((str) => str.trim()) ?? [],
  delete_external_layouts: process.env.SHOPIFY_ACCELERATE_DELETE_EXTERNAL_LAYOUTS === "true",
  delete_external_sections: process.env.SHOPIFY_ACCELERATE_DELETE_EXTERNAL_SECTIONS === "true",
  delete_external_snippets: process.env.SHOPIFY_ACCELERATE_DELETE_EXTERNAL_SNIPPETS === "true",
  delete_external_blocks: process.env.SHOPIFY_ACCELERATE_DELETE_EXTERNAL_BLOCKS === "true",
  delete_external_assets: process.env.SHOPIFY_ACCELERATE_DELETE_EXTERNAL_ASSETS === "true",
  disabled_locales: process.env.SHOPIFY_ACCELERATE_DISABLED_LOCALES === "true",
  disabled_theme_blocks: process.env.SHOPIFY_ACCELERATE_DISABLE_THEME_BLOCKS === "true",
  package_root: path.resolve(__dirname),
  project_root: process.cwd(),
  package_templates: path.join(path.resolve(__dirname), "./src/templates"),
  package_types: path.join(path.resolve(__dirname), "./@types"),
  sources: {
    snippets: [],
    layouts: [],
    sectionsLiquid: [],
    sectionsSchemaFiles: [],
    sectionsJs: [],
    blocksLiquid: [],
    blocksSchemaFiles: [],
    blocksJs: [],
    assets: [],
    giftCards: [],
    configs: [],
    sectionGroups: [],
    templates: [],
    customerTemplates: [],
    settingsFile: [],
    locale_duplicates: {},
    settingsSchema: null,
    sectionSchemas: {},
    blockSchemas: {},
  },
  targets: {
    assets: [],
    dynamicJs: [],
    blocks: [],
    layout: [],
    locales: [],
    snippets: [],
    sections: [],
    settings: null,
    giftCards: [],
    sectionGroups: [],
    configs: [],
    templates: [],
    customerTemplates: [],
  },
  folders: {
    types: path.join(process.cwd(), "@types"),
    utils: path.join(process.cwd(), "@utils"),
    sections: path.join(process.cwd(), "sections"),
    layout: path.join(process.cwd(), "layout"),
    blocks: path.join(process.cwd(), "blocks"),
    snippets: path.join(process.cwd(), "snippets"),
    templates: path.join(process.cwd(), "templates"),
    assets: path.join(process.cwd(), "assets"),
    config: path.join(process.cwd(), "config"),
  },
  environments: Object.entries(shopify_toml?.environments ?? {})?.reduce((acc, [key, val]) => {
    acc[key] = {
      ...val,
      store: val?.store?.replace(/\.myshopify\.com/gi, ""),
    };
    return acc;
  }, {}),
  environment: shopify_toml?.environments?.["development"]
    ? "development"
    : Object.keys(shopify_toml?.environments)?.[0] ?? "development",
  theme_id: +shopify_toml?.environments?.["development"]?.theme,
  theme_path: shopify_toml?.environments?.["development"]?.path ?? "./theme/development",
  store: shopify_toml?.environments?.["development"]?.store,
};

program
  .name("shopify-accelerate")
  .description("CLI for Accelerated Shopify Theme development")
  .version(require(path.join("./", "package.json")).version);

program
  .command("init")
  .description("Initialize a local development environment from an existing Shopify theme")
  // .argument("<string>", "string to split")
  .option("-e, --environment <environment_name>", "Development environment name", "development")
  .option(
    "-s, --store <store_id>",
    "Shopify store id. I.e `https://admin.shopify.com/store/<store_id>` or `https://<store_id>.myshopify.com`"
  )
  .option(
    "-t, --theme <theme_id>",
    "Shopify store id. I.e. `https://admin.shopify.com/store/<store_id>/themes/<theme_id>/editor`"
  )
  .action(async (options) => {
    await validateCliOptions(options);
    buildTheme();
    generateConfigFiles();
    await shopifyCliPull();
  });

program
  .command("dev")
  .description("Shopify Theme Development")
  // .argument("<string>", "string to split")
  .option("-e, --environment <environment_name>", "Development environment name", "development")
  .option(
    "-s, --store <store_id>",
    "Shopify store id. I.e `https://admin.shopify.com/store/<store_id>` or `https://<store_id>.myshopify.com`"
  )
  .option(
    "-t, --theme <theme_id>",
    "Shopify store id. I.e. `https://admin.shopify.com/store/<store_id>/themes/<theme_id>/editor`"
  )
  .action(async (options) => {
    await validateCliOptions(options);
    buildTheme();
    generateConfigFiles();
    runEsbuild();
    runTailwindCSSWatcher();
    watchTheme();
  });

program
  .command("tailwind")
  .description("TailwindCSS Watcher")
  .option("-e, --environment <environment_name>", "Development environment name", "development")
  .option(
    "-s, --store <store_id>",
    "Shopify store id. I.e `https://admin.shopify.com/store/<store_id>` or `https://<store_id>.myshopify.com`"
  )
  .option(
    "-t, --theme <theme_id>",
    "Shopify store id. I.e. `https://admin.shopify.com/store/<store_id>/themes/<theme_id>/editor`"
  )
  .action(async (options) => {
    await validateCliOptions(options);
    runTailwindCSSWatcher();
  });

program
  .command("esbuild")
  .description("ESBuild Watcher")
  .option("-e, --environment <environment_name>", "Development environment name", "development")
  .option(
    "-s, --store <store_id>",
    "Shopify store id. I.e `https://admin.shopify.com/store/<store_id>` or `https://<store_id>.myshopify.com`"
  )
  .option(
    "-t, --theme <theme_id>",
    "Shopify store id. I.e. `https://admin.shopify.com/store/<store_id>/themes/<theme_id>/editor`"
  )
  .action(async (options) => {
    await validateCliOptions(options);
    runEsbuild();
  });

program.parse(process.argv);
