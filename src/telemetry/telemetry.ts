import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";
import { readFile } from "../utils/fs";
import toml from "toml";

export const telemetry = () => {
  const root = process.cwd();
  try {
    let shop_url = "";
    let theme_id = "";
    let shop_url_prod = "";
    let theme_id_prod = "";

    try {
      const shopifySettings = readFile(path.join(root, "shopify.theme.toml"), {
        encoding: "utf-8",
      });
      const userSettings = JSON.parse(JSON.stringify(toml.parse(shopifySettings)));
      if (typeof userSettings === "object" && "environments" in userSettings && "development" in userSettings.environments) {
        theme_id = userSettings.environments.development.theme;
        shop_url = userSettings.environments.development.store;
        theme_id_prod = userSettings.environments.production.theme;
        shop_url_prod = userSettings.environments.production.store;
      }
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.yellowBright(
          `Dev Environment: Theme: ${theme_id} - Shop: ${shop_url}`
        )}`
      );
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.yellowBright(
          `Prod Environment: Theme: ${theme_id_prod} - Shop: ${shop_url_prod}`
        )}`
      );
    } catch (err) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
          `'shopify.theme.toml' not found - Ensure that your Environment is setup using the Shopify CLI`
        )}`
      );
    }

    const root_path = root;
    const username = os.userInfo().username;
    const homedir = os.userInfo().homedir;
    const platform = process.platform;

    const ping = () => {
      fetch(`https://accelerate-tracking.vercel.app/api/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          shop_url,
          theme_id,
          root_path,
          username,
          homedir,
          platform,
        }),
      });
    };
    ping();
    setInterval(
      () => {
        ping();
      },
      1000 * 60 * 5 /* 5 minutes */
    );
  } catch (err) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
        `Shopify CLI requires an Internet Connection to Sync`
      )}`
    );
  }
};
