import chalk from "chalk";
import fs from "fs";
import watch from "node-watch";
import path from "path";
import { config } from "../../shopify-accelerate";
import { generateBlocksTypes } from "../scaffold-theme/generate-blocks-types";
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
  watch(Object.values(folders), { recursive: true }, (event, name) => {
    if (running) return;
    const startTime = Date.now();
    running = true;
    if (event === "remove") {
      getSources();
      getTargets();
    }
    if (isTypeScriptSchema(name)) {
      getTargets();
      getSchemaSources();
      parseLocales();
      generateSchemaVariables();
      generateSchemaLocales();
      generateSectionsTypes();
      generateBlocksTypes();
      generateSettingTypes();
      generateLiquidFiles();
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(
          `${Date.now() - startTime}ms`
        )}] ${chalk.cyan(`File modified: ${name.replace(process.cwd(), "")}`)}`
      );
    }
    if (isAsset(name)) {
      const fileName = name.split(/[\\/]/gi).at(-1);
      const targetPath = path.join(process.cwd(), theme_path, "assets", fileName);

      if (event !== "remove") {
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

      if (event === "remove" && delete_external_assets) {
        const targetFile = fs.existsSync(targetPath);

        if (targetFile) {
          deleteFile(targetPath);
        }
      }
    }
    if (isLiquid(name) || isSectionTs(name) || isBlockTs(name)) {
      getTargets();
      getSources();
      generateSchemaVariables();
      generateLiquidFiles();
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(
          `${Date.now() - startTime}ms`
        )}] ${chalk.cyan(`File modified: ${name.replace(process.cwd(), "")}`)}`
      );
    }
    running = false;
  });
};
