#!/usr/bin/env ts-node-script

import path from "path";
import toml from "toml";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { init } from "./src";
import { runTailwindCSSWatcher } from "./tailwind/tailwind-watch";

import { readFileSync } from "./utils/fs";
import { JSONParse } from "./utils/json";

const { Command } = require("commander");
const program = new Command();
require("dotenv").config();

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
  package_root: string;
  root: ReturnType<typeof process.cwd>;
  env: typeof process.env;
  shopify_settings: typeof settings;
};

export const useGlobals = create(
  immer<GlobalsState>((set, get) => {
    /*Initial State*/
    return {
      env: process.env,
      package_root: path.resolve(__dirname),
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
    process.env.SHOPIFY_STORE_ID
  )
  .option(
    "-t, --theme <theme_id>",
    "Shopify store id. I.e. `https://admin.shopify.com/store/<store_id>/themes/<theme_id>/edit`",
    process.env.SHOPIFY_THEME_ID
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

    runTailwindCSSWatcher();
  });

program.parse(process.argv);
