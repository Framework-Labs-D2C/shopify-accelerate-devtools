import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { delay } from "../utils/delay";
import { readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";
import { config } from "../../shopify-accelerate";

export const backupTemplates = () => {
  writeOnlyNew(path.join(config.theme_path, ".gitignore"), `template_history`);

  if (!config.auto_backups) return;

  const templates = [
    ...new Set([
      ...config.targets.sectionGroups,
      ...config.targets.configs,
      ...config.targets.templates,
      ...config.targets.customerTemplates,
    ]),
  ];

  templates.forEach((template) => {
    const finalPath = path.join(config.theme_path, "template_history", template.replace(path.join(config.theme_path), ""));
    if (finalPath) {
      const content = readFile(template);
      if (content?.trim()) {
        writeCompareFile(finalPath, content);
      }
    }
  });

  const cleanThemePath = `${config.theme_path?.replace(/^\.\//gi, "")?.replace(/\\/gi, "/")}/template_history`;

  if (!fs.existsSync(path.join(cleanThemePath))) {
    fs.mkdirSync(path.join(cleanThemePath), { recursive: true });
  }

  const shopifyCLIProcess = exec(
    `cd ${cleanThemePath} && git init && git add . && git commit -m "Autosave: ${Date.now()}`,
    async (error, stdout, stderr) => {
      if (stderr) {
        console.log(stderr);
      }
    }
  );
  const vcsPath = path.join(process.cwd(), ".idea/vcs.xml");
  const workspace = path.join(process.cwd(), ".idea/workspace.xml");

  if (fs.existsSync(workspace)) {
    if (fs.existsSync(vcsPath)) {
      const vcsContent = readFile(vcsPath, { encoding: "utf-8" });
      if (!vcsContent.includes(`<mapping directory="$PROJECT_DIR$/${cleanThemePath}" vcs="Git" />`)) {
        const newVcsContent = vcsContent.replace(
          "</component>",
          `    <mapping directory="$PROJECT_DIR$/${cleanThemePath}" vcs="Git" />\n  </component>`
        );
        fs.writeFileSync(vcsPath, newVcsContent);
      }
    } else {
      fs.writeFileSync(
        vcsPath,
        `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="VcsDirectoryMappings">
    <mapping directory="" vcs="Git" />
    <mapping directory="$PROJECT_DIR$/${cleanThemePath}" vcs="Git" />
  </component>
</project>`
      );
    }
  }
  console.log(`[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(`Backup Processed`)}`);
};
