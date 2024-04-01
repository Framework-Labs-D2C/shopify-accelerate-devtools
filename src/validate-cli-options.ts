import chalk from "chalk";
import fs from "fs";

import json2toml from "json2toml";
import path from "path";
import userInput from "prompts";
import { config } from "../shopify-accelerate";
import { readFile, writeCompareFile, writeOnlyNew } from "./utils/fs";

export const validateCliOptions = async (
  {
    store,
    theme_id,
    environment = "development",
  }: {
    store?: string;
    theme_id?: string;
    environment?: string;
  } = { environment: "development", store: undefined, theme_id: undefined }
) => {
  const { environments } = config;
  const { ...currentEnvironment } = environments[environment] ?? {
    store: store?.replace(/\.myshopify\.com/gi, ""),
    theme: theme_id,
    path: `./themes/${environment}`,
    environment,
  };

  if (store && currentEnvironment.store !== store) {
    const { update_store } = await userInput([
      {
        type: "confirm",
        name: "update_store",
        message: `Do you want to update the current (${environment}) environment store from "${
          currentEnvironment.store
        }" to "${store?.replace(/\.myshopify\.com/gi, "")}"?`,
      },
    ]);
    if (update_store) {
      currentEnvironment.store = store;
    }
  }

  if (theme_id && currentEnvironment.theme !== theme_id) {
    const { update_theme_id } = await userInput([
      {
        type: "confirm",
        name: "update_theme_id",
        message: `Do you want to update the current (${environment}) environment theme_id from "${currentEnvironment.theme}" to "${theme_id}"?`,
      },
    ]);
    if (update_theme_id) {
      currentEnvironment.theme = theme_id;
    }
  }

  const prompts = [];
  if (!store && !currentEnvironment.store) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
        `Store handle missing.`
      )}`
    );
    prompts.push({
      type: "text",
      name: "store",
      message:
        "Please enter the Shopify Store Handle (http://{handle}.myshopify.com/admin / https://admin.shopify.com/store/{handle}) for your setup",
    });
  }
  if (!theme_id && !currentEnvironment.theme) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Theme ID missing.`)}`
    );
    prompts.push({
      type: "text",
      name: "theme_id",
      message: `Shopify theme id. I.e. \`https://admin.shopify.com/store/${
        currentEnvironment?.store ?? `<store_id>`
      }/themes/${currentEnvironment?.store ? "current" : `<theme_id>`}/editor\``,
    });
  }

  if (
    (store && currentEnvironment.store !== store) ||
    (theme_id && currentEnvironment.theme !== theme_id)
  ) {
    prompts.push({
      type: "text",
      name: "environment",
      message: `New environment name:`,
    });
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
        `Environment mismatch: Please rename the environment or re-run the CLI`
      )}`
    );
  }

  const results = await userInput(prompts);
  if (results) {
    environment = results.environment ?? environment;
    currentEnvironment.path = `./themes/${environment}`;
    currentEnvironment.theme = results.theme_id ?? theme_id ?? currentEnvironment.theme;
    currentEnvironment.store =
      results.store?.replace(/\.myshopify\.com/gi, "") ??
      store?.replace(/\.myshopify\.com/gi, "") ??
      currentEnvironment?.store?.replace(/\.myshopify\.com/gi, "");
  }

  config.environments[environment] = currentEnvironment;
  config.environment = environment;
  config.theme_path = currentEnvironment?.path;
  config.theme_id = +currentEnvironment?.theme;
  config.store = currentEnvironment?.store?.replace(/\.myshopify\.com/gi, "");

  const { project_root, package_templates } = config;

  writeOnlyNew(
    path.join(project_root, ".env"),
    readFile(path.join(package_templates, "/.env.template"))
  );

  if (
    !currentEnvironment?.store ||
    !currentEnvironment?.theme ||
    !currentEnvironment?.path ||
    !environment
  ) {
    throw new Error("Missing information to initialize the theme environment");
  }

  process.env.THEME_PATH = currentEnvironment?.path;
  writeCompareFile(
    path.join(process.cwd(), "shopify.theme.toml"),
    json2toml({ environments: config.environments }, { newlineAfterSection: true })
  );
};
