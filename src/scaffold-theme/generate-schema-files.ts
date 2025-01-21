import fs from "fs";
import path from "path";
import { config } from "../../shopify-accelerate";
import { getAllDirectories, writeCompareFile, writeOnlyNew } from "../utils/fs";
import { toCamelCase } from "../utils/to-camel-case";
import { capitalize, toPascalCase } from "../utils/to-pascal-case";

export const generateSchemaFiles = (dirName: string) => {
  const fileName = dirName.split(/[/\\]/gi).at(-1);
  const exists = fs.existsSync(path.join(dirName, "schema.ts"));
  const schemaContent = exists ? fs.readFileSync(path.join(dirName, "schema.ts"), { encoding: "utf-8" }) : "";
  const isEmpty =
    !schemaContent?.includes(`export const ${toCamelCase(fileName)}:`) &&
    !schemaContent?.includes(`export const ${toCamelCase(fileName?.replace(/_/gi, ""))}:`);

  if (exists && !isEmpty) {
    return;
  }

  const writeFile = isEmpty ? writeCompareFile : writeOnlyNew;

  if (dirName.includes(config.folders.sections) && dirName !== config.folders.sections) {
    console.log(schemaContent, { dirName });

    writeFile(
      path.join(dirName, "schema.ts"),
      `import { ShopifySection } from "types/shopify";
import { ${toPascalCase(fileName)}Section } from "types/sections";

export const ${toCamelCase(fileName)}: ShopifySection<${toPascalCase(fileName)}Section> = {
  name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
  generate_block_files: undefined,
  settings: [],
  presets: [
    {
      name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
    },
  ],
  disabled_on: {
    groups: ["custom.globals", "custom.header", "custom.modal", "custom.card"],
  },
};
`
    );
  }

  if (dirName.includes(config.folders.blocks) && dirName !== config.folders.blocks) {
    writeFile(
      path.join(dirName, "schema.ts"),
      `import { ShopifyThemeBlock } from "types/shopify";
import { ${toPascalCase(fileName)}Block } from "types/blocks";

export const ${toCamelCase(fileName)}: ShopifyThemeBlock<${toPascalCase(fileName)}Block> = {
  name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
  settings: [],
  tag: null,
  presets: [
    {
      name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
    },
  ],
};
`
    );
  }

  if (dirName.includes(config.folders.classic_blocks) && dirName !== config.folders.classic_blocks) {
    writeFile(
      path.join(dirName, "schema.ts"),
      `import { ShopifyBlock } from "types/shopify";
import { ${toPascalCase(fileName)}Block } from "types/classic-blocks";

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
      path.join(dirName, "schema.ts"),
      `import { ShopifyCard } from "types/shopify";
import { ${toPascalCase(fileName)}Card } from "types/cards";

export const ${toCamelCase(fileName)}: ShopifyCard<${toPascalCase(fileName)}Card> = {
  name: "${capitalize(fileName).replace(/[-_]/gi, " ")}",
  settings: [],
};
`
    );
  }
};

export const generateAllMissingSchemaFiles = () => {
  const directories = [
    ...getAllDirectories(config.folders.sections),
    ...getAllDirectories(config.folders.blocks),
    ...getAllDirectories(config.folders.classic_blocks),
    ...getAllDirectories(config.folders.cards),
  ];

  directories.forEach((name) => {
    generateSchemaFiles(name);
  });
};
