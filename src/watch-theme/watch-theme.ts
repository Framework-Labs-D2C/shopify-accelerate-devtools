import chalk from "chalk";
import fs from "fs";
import watch from "node-watch";
import path from "path";
import { generateCardsTypes } from "../scaffold-theme/generate-card-types";
import { delay } from "../utils/delay";
import { generateSchemaFiles } from "../scaffold-theme/generate-schema-files";

import { config } from "../../shopify-accelerate";
import { generateThemeBlocksTypes } from "../scaffold-theme/generate-theme-blocks-types";
import { generateClassicBlocksTypes } from "../scaffold-theme/generate-classic-blocks-types";
import { generateLiquidFiles } from "../scaffold-theme/generate-liquid-files";
import { generateSchemaLocales } from "../scaffold-theme/generate-schema-locales";
import { generateSchemaVariables } from "../scaffold-theme/generate-schema-variables";
import { generateSectionsTypes } from "../scaffold-theme/generate-section-types";
import { generateSettingTypes } from "../scaffold-theme/generate-setting-types";
import { getSchemaSources, getSources, getTargets, isAsset, isBlockTs, isLiquid, isSectionTs, isTypeScriptSchema } from "../scaffold-theme/parse-files";
import { parseLocales } from "../scaffold-theme/parse-locales";
import { deleteFile, writeCompareFile, writeOnlyNew } from "../utils/fs";

export const watchTheme = () => {
  const { folders, theme_path, ignore_assets, delete_external_assets, targets } = config;

  let running = false;
  watch(Object.values(folders), { recursive: true }, async (event, name) => {
    const startTime = Date.now();
    try {
      if (running) return;
      const fileName = name.split(/[/\\]/gi).at(-1);

      running = true;

      if (event === "remove") {
        await getSources();
        getTargets();

        if (isAsset(name) && !/\.ts$/gi.test(name)) {
          const targetPath = path.join(process.cwd(), theme_path, "assets", fileName);

          if (event === "remove" && delete_external_assets) {
            const targetFile = fs.existsSync(targetPath);

            if (targetFile) {
              deleteFile(targetPath);
            }
          }
        }

        if (/^schema\.ts$/gi.test(fileName)) {
          await delay(20);
          if (fs.existsSync(name.replace(/[\\/]schema.ts$/gi, ""))) {
            generateSchemaFiles(name.replace(/[\\/]schema.ts$/gi, ""));
          }
        }
        running = false;
        return;
      }

      if (/^schema\.ts$/gi.test(fileName)) {
        generateSchemaFiles(name.replace(/[\\/]schema.ts$/gi, ""));
      }

      if (fs.statSync(name).isDirectory() && !fs.existsSync(path.join(name, "schema.ts"))) {
        if (fs.existsSync(name)) {
          generateSchemaFiles(name);
        }
      }

      if (isTypeScriptSchema(name)) {
        getTargets();
        await getSchemaSources();
        parseLocales();
        generateSchemaVariables();
        generateSchemaLocales();
        generateSectionsTypes();
        generateThemeBlocksTypes();
        generateClassicBlocksTypes();
        generateCardsTypes();
        generateSettingTypes();
        generateLiquidFiles();
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(`${Date.now() - startTime}ms`)}] ${chalk.cyan(
            `File modified: ${name.replace(process.cwd(), "")}`
          )}`
        );
      }
      if (isAsset(name) && !/\.ts$/gi.test(name)) {
        const fileName = name.split(/[\\/]/gi).at(-1);
        const targetPath = path.join(process.cwd(), theme_path, "assets", fileName);
        const rawContent = fs.readFileSync(name, { encoding: "utf-8" });

        if (ignore_assets?.includes(targetPath.split(/[/\\]/)?.at(-1))) {
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
              `Ignored: ${targetPath.replace(process.cwd(), "")}`
            )}`
          );
          writeOnlyNew(targetPath, rawContent);
        } else {
          writeCompareFile(targetPath, rawContent);
        }
      }
      if (isLiquid(name) || isSectionTs(name) || isBlockTs(name)) {
        getTargets();
        await getSources();
        generateSchemaVariables();
        generateLiquidFiles();
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(`${Date.now() - startTime}ms`)}] ${chalk.cyan(
            `File modified: ${name.replace(process.cwd(), "")}`
          )}`
        );
      }
      running = false;
    } catch (err) {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(`${Date.now() - startTime}ms`)}] ${chalk.cyan(
          `File modified: ${name.replace(process.cwd(), "")}`
        )}`,
        err
      );
    }
  });
};
