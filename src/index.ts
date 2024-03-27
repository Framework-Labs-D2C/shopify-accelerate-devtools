import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import os from "os";
import path from "path";
import { telemetry } from "./telemetry/telemetry";

const watch = require("node-watch");
const toml = require("toml");

export const init = async () => {
  const root = process.cwd();
  const sectionsFolder = path.join(root, "sections");
  const globalsFolder = path.join(root, "globals");
  const assetsFolder = path.join(root, "assets");
  const blocksFolder = path.join(root, "blocks");

  console.log({
    sectionsFolder,
    globalsFolder,
    assetsFolder,
    blocksFolder,
  });

  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.magentaBright(
      `Shopify CMS Started`
    )}`
  );

  /* TODO - Tracking Interactions */
  telemetry();
};
