import fs from "fs";
import path from "path";
import { config } from "../../shopify-accelerate";
import { getAllDirectories, readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";
import { toCamelCase } from "../utils/to-camel-case";
import { capitalize, toPascalCase } from "../utils/to-pascal-case";

export const generateMissingPresetsFiles = (dirName: string) => {
  if (
    !path.join(dirName).includes(path.join(config.folders.sections)) ||
    path.join(dirName) === path.join(config.folders.sections)
  ) {
    return;
  }
  const fileName = dirName.split(/[/\\]/gi).at(-1)?.replace(/^_*/gi, "");
  const exists = fs.existsSync(path.join(dirName, "_presets.ts"));
  const presetsContent = exists ? readFile(path.join(dirName, "_presets.ts")) : "";
  const isEmpty = !presetsContent?.includes(`export const ${toCamelCase(fileName)}Presets:`);

  const section = config.sources.sectionSchemas[toCamelCase(fileName)];
  const name = section?.name ?? capitalize(fileName).replace(/[-_]/gi, " ");

  if (exists && !isEmpty) {
    return;
  }

  const writeFile = isEmpty ? writeCompareFile : writeOnlyNew;

  writeFile(
    path.join(dirName, "_presets.ts"),
    `import { ThemeBlocks } from "types/blocks";
import { ShopifySectionPreset, ShopifySectionBlockPresetMap } from "types/shopify";
import { ${toPascalCase(fileName)}Section } from "types/sections";

export const ${toCamelCase(fileName)}Presets: ShopifySectionPreset<${toPascalCase(fileName)}Section>[] = [
  { name: "${name}" },
];
export const ${toCamelCase(
      fileName
    )}BlockPresets: ShopifySectionBlockPresetMap<Extract<ThemeBlocks, { type: \`_${fileName}__\${string}\` }>> = {};

`
  );
  config.sources.sectionsPresetFiles = [...new Set(config.sources.sectionsPresetFiles), path.join(dirName, "_presets.ts")];
};

export const generateAllMissingPresetsFiles = () => {
  const directories = [...getAllDirectories(config.folders.sections)];

  directories.forEach((name) => {
    generateMissingPresetsFiles(name);
  });
};
