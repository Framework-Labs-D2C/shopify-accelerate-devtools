import chalk from "chalk";
import path from "path";
import { config } from "../../shopify-accelerate";
import { deleteFile, readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";

export const generateAssetFiles = () => {
  const { theme_path, sources, targets, delete_external_assets, ignore_assets } = config;

  sources.assets.forEach((file) => {
    if (/\.ts$/gi.test(file)) return;
    const fileName = file.split(/[\\/]/gi).at(-1);
    const targetPath = path.join(process.cwd(), theme_path, "assets", fileName);

    const rawContent = readFile(file, { encoding: "utf-8" });
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
      const targetFile =
        sources.assets.find((sourcePath) => sourcePath.split(/[\\/]/gi).at(-1).includes(fileName)) ||
        sources.assetsTs.find((sourcePath) =>
          sourcePath.split(/[\\/]/gi).at(-1).includes(fileName.replace(/\.js/gi, "").replace(/^_+/gi, ""))
        );

      if (
        /^replo/gi.test(fileName) ||
        /^pandectes/gi.test(fileName) ||
        /^locksmith/gi.test(fileName) ||
        /^theme/gi.test(fileName) ||
        /\.js\.map$/gi.test(fileName) ||
        /\.d\.ts/gi.test(fileName) ||
        /^shogun/gi.test(fileName)
      ) {
        return;
      }
      if (!targetFile) {
        deleteFile(path.join(process.cwd(), file));
      }
    });
  }
};
