import chalk from "chalk";
import fs from "fs";
import { is } from "immer/src/utils/common";
import watch from "node-watch";
import path from "path";
import { useGlobals } from "../../shopify-accelerate";
import { buildTheme } from "../scaffold-theme/build-theme";
import { generateLiquidFiles } from "../scaffold-theme/generate-liquid-files";
import { generateSchemaLocales } from "../scaffold-theme/generate-schema-locales";
import { generateSchemaVariables } from "../scaffold-theme/generate-schema-variables";
import { generateSectionsTypes } from "../scaffold-theme/generate-section-types";
import { generateSettingTypes } from "../scaffold-theme/generate-setting-types";
import { getSchemaSources, getSources, getTargets, isAsset, isLiquid, isTypeScriptSchema } from "../scaffold-theme/parse-files";
import { parseLocales } from "../scaffold-theme/parse-locales";
import { writeCompareFile, writeOnlyNew } from "../utils/fs";

export const watchTheme = () => {
  const { folders, theme_path, ignore_assets, delete_external_assets, targets } =
    useGlobals.getState();

  watch(Object.values(folders), { recursive: true }, (event, name) => {
    const startTime = Date.now();

    if (isTypeScriptSchema(name)) {
      getSchemaSources();
      parseLocales();
      generateSchemaVariables();
      generateSchemaLocales();
      generateSectionsTypes();
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
          fs.unlinkSync(targetPath);
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(
              `Deleted: ${name}`
            )}`
          );
        }
      }
    }

    if (isLiquid(name)) {
      generateLiquidFiles();
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(
          `${Date.now() - startTime}ms`
        )}] ${chalk.cyan(`File modified: ${name.replace(process.cwd(), "")}`)}`
      );
    }
  });
};
