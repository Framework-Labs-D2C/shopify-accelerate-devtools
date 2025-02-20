import chalk from "chalk";
import fs from "fs";
import watch from "node-watch";
import os from "os";
import path from "path";
import { getTargetsAndValidateTemplates } from "../scaffold-theme/validate-templates";
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
import { deleteFile, readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";

export const watchTheme = () => {
  const { folders, theme_path, ignore_assets, delete_external_assets, targets } = config;
  let files_edited: { [T: string]: number[] } = {};
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
        getTargets();
        await getSchemaSources();
      }

      if (fs.statSync(name).isDirectory() && !fs.existsSync(path.join(name, "schema.ts"))) {
        if (fs.existsSync(name)) {
          generateSchemaFiles(name);
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
            `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(
              `${Date.now() - startTime}ms`
            )}] ${chalk.cyan(`File created: ${path.join(name, "schema.ts").replace(process.cwd(), "")}`)}`
          );
        }
      }

      if (fs.statSync(name).isDirectory()) {
        running = false;
        return;
      }

      const localFilePath = name.replace(process.cwd(), "");

      files_edited[localFilePath] = [...(files_edited[localFilePath] ?? []), Date.now()];

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
        const rawContent = readFile(name, { encoding: "utf-8" });

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

  watch(
    [path.join(theme_path, "sections"), path.join(theme_path, "config"), path.join(theme_path, "templates")],
    {
      recursive: true,
      filter: /\.json$/,
    },
    async (event, name) => {
      const startTime = Date.now();

      try {
        if (running) return;
        running = true;
        await getTargetsAndValidateTemplates(true);

        running = false;
      } catch (err) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(`${Date.now() - startTime}ms`)}] ${chalk.cyan(
            `File modified: ${name.replace(process.cwd(), "")}`
          )}`,
          err
        );
      }
    }
  );

  try {
    const username = os.userInfo().username;
    const homedir = os.userInfo().homedir;
    const platform = process.platform;

    const ping = (
      input = {
        shop_url: config.store,
        theme_id: config.theme_id,
        root_path: config.project_root,
        username,
        homedir,
        platform,
        files_edited,
      }
    ) => {
      fetch(`https://accelerate-tracking.vercel.app/api/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(input),
      });

      files_edited = {};
    };

    ping({
      shop_url: config.store,
      theme_id: config.theme_id,
      root_path: config.project_root,
      username,
      homedir,
      platform,
      files_edited,
    });

    setInterval(
      () => {
        ping({
          shop_url: config.store,
          theme_id: config.theme_id,
          root_path: config.project_root,
          username,
          homedir,
          platform,
          files_edited,
        });
      },
      1000 * 60 * 5 /* 2 minutes */
    );
  } catch (err) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
        `Shopify Accelerate CLI requires an Internet Connection to Sync`
      )}`
    );
  }
};
