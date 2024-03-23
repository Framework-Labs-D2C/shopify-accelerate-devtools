#!/usr/bin/env ts-node-script
console.log(process.cwd(), "shopify-theme-dev: process.cwd()");
import fs from "fs";
import path from "path";
import toml from "toml";
import { immer } from "zustand/middleware/immer";
import { init } from "./src";
const { Command } = require("commander");
const program = new Command();
require("dotenv").config();
import { create } from "zustand";
import { readFileSync } from "./utils/fs";
import { JSONParse } from "./utils/json";

const settings = JSONParse<{
  environments: {
    [T: string]: {
      theme: string;
      store: string;
      path: string;
      ignore?: string[];
      output: "json";
      live?: boolean;
      "allow-live": boolean;
    };
  };
}>(
  JSON.stringify(
    toml.parse(
      readFileSync(path.join(process.cwd(), "template", "shopify.theme.toml"), {
        encoding: "utf-8",
      })
    )
  )
);

export type GlobalsState = {
  root: ReturnType<typeof process.cwd>;
  env: typeof process.env;
  shopify_settings: typeof settings;
};

export const useGlobals = create(
  immer<GlobalsState>((set, get) => {
    /*Initial State*/
    return {
      env: process.env,
      root: process.cwd(),
      shopify_settings: settings,
    };
  })
);

program
  .name("shopify-accelerate")
  .description("CLI for Accelerated Shopify Theme development")
  .version(require(path.join("./", "package.json")).version);

program
  .command("init")
  .description("Initialize a local development environment from an existing Shopify theme")
  // .argument("<string>", "string to split")
  .option(
    "-s, --store <store_id>",
    "Shopify store id. I.e `https://admin.shopify.com/store/<store_id>` or `https://<store_id>.myshopify.com`",
    process.env.SHOPIFY_STORE_ID ?? "accelerate-preview.myshopify.com"
  )
  .option(
    "-t, --theme <theme_id>",
    "Shopify store id. I.e. `https://admin.shopify.com/store/<store_id>/themes/<theme_id>/edit`",
    process.env.SHOPIFY_THEME_ID ?? "1234567890"
  )
  .option("-e, --environment <environment_name>", "Development environment name", "development")
  .option(
    "--path <pathname>",
    "Shopify themes path. Uses as root folder for each development environment. I.e <pathname>/<environment_name>",
    process.env.SHOPIFY_THEMES_PATH ?? "./themes"
  )
  .action((options) => {
    // Parse options and replace with correct defaults?
    const limit = options.first ? 1 : undefined;
    console.log(useGlobals.getState());
    console.log(options);
    // init();
  });

program.parse(process.argv);
