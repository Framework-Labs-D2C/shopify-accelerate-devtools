import chalk from "chalk";
import fs from "fs";
import watch from "node-watch";
import path from "path";
import { config } from "../../shopify-accelerate";
import { generateBlocksTypes } from "../scaffold-theme/generate-blocks-types";
import { generateSectionsTypes } from "../scaffold-theme/generate-section-types";
import { generateSettingTypes } from "../scaffold-theme/generate-setting-types";
import { getSchemaSources, getSources, isTypeScriptSchema } from "../scaffold-theme/parse-files";
import { capitalize } from "../utils/capitalize";
import { writeCompareFile, writeOnlyNew } from "../utils/fs";

export const watchHeadless = () => {
  const { folders, theme_path, ignore_assets, delete_external_assets, targets } = config;

  let running = false;
  watch(
    Object.values(folders)?.filter((folder) => fs.existsSync(folder)),
    { recursive: true },
    (event, name) => {
      if (running) return;
      const startTime = Date.now();
      running = true;
      if (event === "remove") {
        getSources();
      }
      if (isTypeScriptSchema(name)) {
        getSchemaSources();
        generateSectionsTypes();
        generateBlocksTypes();
        generateSettingTypes();

        const imports = [`import type { FC } from "react";`];
        const renderBlocks = [];
        Object.entries(config.sources.sectionSchemas ?? {})?.forEach(([key, entry]) => {
          imports.push(
            `import { ${capitalize(key)} } from "sections/${entry.folder}/${entry.folder}";`
          );
          renderBlocks.push(`    case "${entry.folder}": {
      return <${capitalize(key)} {...section} />;
    }`);

          writeOnlyNew(
            entry.path?.replace("schema.ts", `${entry.folder}.tsx`),
            `import type { ${capitalize(key)}Section } from "types/sections";

export const ${capitalize(key)} = ({ id, type, settings, blocks, disabled }: ${capitalize(
              key
            )}Section) => {
  if (disabled) return null
  
  return <>${capitalize(key)}</>;
};
`
          );
        });
        imports.push('import type { Sections } from "types/sections";');
        imports.push("");
        imports.push("type RenderSectionProps = { section: Sections; };");
        imports.push("");
        imports.push("export const RenderSection: FC<RenderSectionProps> = ({ section }) => {");
        imports.push("  switch (section.type) {");
        imports.push(...renderBlocks);
        imports.push("  }");
        imports.push("};");

        writeCompareFile(
          path.join(process.cwd(), "./app/[...slug]/render-section.tsx"),
          imports.join("\n")
        );

        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: [${chalk.magentaBright(
            `${Date.now() - startTime}ms`
          )}] ${chalk.cyan(`File modified: ${name.replace(process.cwd(), "")}`)}`
        );
      }
      running = false;
    }
  );
};
