import chalk from "chalk";
import fs from "fs";
import path from "path";
import { useGlobals } from "../../shopify-accelerate";
import { writeCompareFile, writeOnlyNew } from "../utils/fs";

export const generateAssetFiles = () => {
  const { theme_path, sources, targets, delete_external_assets, ignore_assets } =
    useGlobals.getState();

  sources.assets.forEach((file) => {
    const fileName = file.split(/[\\/]/gi).at(-1);
    const targetPath = path.join(process.cwd(), theme_path, "assets", fileName);

    const rawContent = fs.readFileSync(file, { encoding: "utf-8" });

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
  });

  if (delete_external_assets) {
    targets.assets.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      const targetFile = sources.assets.find((sourcePath) =>
        sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)
      );

      if (!targetFile) {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Deleted: ${file}`)}`
        );
        fs.unlinkSync(path.join(process.cwd(), file));
      }
    });
  }
};
