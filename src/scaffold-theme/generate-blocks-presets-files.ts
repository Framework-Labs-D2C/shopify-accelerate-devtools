import fs from "fs";
import path from "path";
import { config } from "../../shopify-accelerate";
import { getAllDirectories, readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";
import { toCamelCase } from "../utils/to-camel-case";
import { capitalize, toPascalCase } from "../utils/to-pascal-case";

export const generateBlocksMissingPresetsFiles = (dirName: string) => {
  if (!path.join(dirName).includes(path.join(config.folders.blocks)) || path.join(dirName) === path.join(config.folders.blocks)) {
    return;
  }

  const fileName = dirName.split(/[/\\]/gi).at(-1);
  const exists = fs.existsSync(path.join(dirName, "_presets.ts"));
  const presetsContent = exists ? readFile(path.join(dirName, "_presets.ts")) : "";
  const isEmpty = !presetsContent?.includes(`export const ${toCamelCase(fileName)}Presets:`);

  const block = config.sources.blockSchemas[toCamelCase(fileName)];
  const name = block?.name ?? capitalize(fileName).replace(/[-_]/gi, " ");

  if (exists && !isEmpty) {
    return;
  }

  const writeFile = isEmpty ? writeCompareFile : writeOnlyNew;

  writeFile(
    path.join(dirName, "_presets.ts"),
    `import type { ${toPascalCase(fileName)}Block, ThemeBlocks } from "types/blocks";
import type { ShopifySectionPreset, ShopifySectionBlockPresetMap } from "types/shopify";

export const ${toCamelCase(fileName)}Presets: ShopifySectionPreset<${toPascalCase(fileName)}Block>[] = [{ name: "${name}" }];
export const ${toCamelCase(
      fileName
    )}BlockPresets: ShopifySectionBlockPresetMap<Extract<ThemeBlocks, { type: \`_${fileName?.replace(
      /^_*/gi,
      ""
    )}__\${string}\` }>> = {};

`
  );
  config.sources.blocksPresetFiles = [...new Set(config.sources.blocksPresetFiles), path.join(dirName, "_presets.ts")];
};

export const generateAllMissingBlockPresetsFiles = () => {
  const directories = [...getAllDirectories(config.folders.blocks)];

  directories.forEach((name) => {
    generateBlocksMissingPresetsFiles(name);
  });
};
