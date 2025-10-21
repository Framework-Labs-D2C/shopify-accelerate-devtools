import fs from "fs";
import path from "path";
import { getSources } from "./parse-files";
import { config } from "../../shopify-accelerate";
import { getAllDirectories, readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";
import { toCamelCase } from "../utils/to-camel-case";
import { capitalize, toPascalCase } from "../utils/to-pascal-case";

export const generateSchemaFiles = (dirName: string) => {
  const folder = dirName.split(/[/\\]/gi).at(-1);
  const fileName = folder?.replace(/^_*/gi, "");
  const exists = fs.existsSync(path.join(dirName, "_schema.ts"));
  const schemaContent = exists ? readFile(path.join(dirName, "_schema.ts"), { encoding: "utf-8" }) : "";
  const isEmpty = !schemaContent?.includes(`export const ${toCamelCase(fileName)}:`);

  if (exists && !isEmpty) {
    return;
  }

  const writeFile = isEmpty ? writeCompareFile : writeOnlyNew;

  if (dirName.includes(config.folders.sections) && dirName !== config.folders.sections) {
    const presetsFile = config.sources.sectionsPresetFiles.find((file) => file.includes(dirName));
    writeFile(
      path.join(dirName, "_schema.ts"),
      `import type{ ShopifySection } from "types/shopify.js";
import type { ${toPascalCase(fileName)}Section } from "types/sections";
${
  presetsFile
    ? `import { ${toCamelCase(fileName)}Presets, ${toCamelCase(fileName)}BlockPresets } from "sections/${folder}/_presets";\n`
    : ""
}
export const ${toCamelCase(fileName)}: ShopifySection<${toPascalCase(fileName)}Section> = {
  name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
  settings: [],
  presets: ${
    presetsFile
      ? `${toCamelCase(fileName)}Presets,`
      : `[
    {
      name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
    },
  ],`
  }
  blockPresets: ${presetsFile ? `${toCamelCase(fileName)}BlockPresets` : `{}`},
  disabled_on: {
    groups: ["custom.global", "custom.header", "custom.modal", "custom.card"],
  },
};
`
    );
  }

  if (dirName.includes(config.folders.blocks) && dirName !== config.folders.blocks) {
    const presetsFile = config.sources.blocksPresetFiles.find((file) => file.includes(dirName));
    writeFile(
      path.join(dirName, "_schema.ts"),
      `import type { ShopifyThemeBlock } from "types/shopify.js";
import type { ${toPascalCase(fileName)}Block } from "types/blocks.js";
${
  presetsFile
    ? `import { ${toCamelCase(fileName)}Presets, ${toCamelCase(fileName)}BlockPresets } from "blocks/${folder}/_presets";\n`
    : ""
}
export const ${toCamelCase(fileName)}: ShopifyThemeBlock<${toPascalCase(fileName)}Block> = {
  name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
  settings: [],
  tag: null,
  presets: ${
    presetsFile
      ? `${toCamelCase(fileName)}Presets,`
      : `[
    {
      name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
    },
  ],`
  }
  blockPresets: ${presetsFile ? `${toCamelCase(fileName)}BlockPresets` : `{}`},
};
`
    );
  }

  if (dirName.includes(config.folders.classic_blocks) && dirName !== config.folders.classic_blocks) {
    writeFile(
      path.join(dirName, "_schema.ts"),
      `import type { ShopifyBlock } from "types/shopify.js";
import type { ${toPascalCase(fileName)}Block } from "types/classic-blocks.js";

export const ${toCamelCase(fileName)}: ShopifyThemeBlock<${toPascalCase(fileName)}Block> = {
  name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
  settings: [],
  presets: [
    {
      name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
    },
  ],
};
`
    );
  }

  if (dirName.includes(config.folders.cards) && dirName !== config.folders.cards) {
    writeFile(
      path.join(dirName, "_schema.ts"),
      `import type { ShopifyCard } from "types/shopify.js";
import type { ${toPascalCase(fileName)}Card } from "types/cards.js";

export const ${toCamelCase(fileName)}: ShopifyCard<${toPascalCase(fileName)}Card> = {
  name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
  settings: [],
};
`
    );
  }
};

export const generateAllMissingSchemaFiles = async () => {
  const directories = [
    ...getAllDirectories(config.folders.sections),
    ...getAllDirectories(config.folders.blocks),
    ...getAllDirectories(config.folders.classic_blocks),
    ...getAllDirectories(config.folders.cards),
  ];

  directories.forEach((name) => {
    generateSchemaFiles(name);
  });
  await getSources();
};
