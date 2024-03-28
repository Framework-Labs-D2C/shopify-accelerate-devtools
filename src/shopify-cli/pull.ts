import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { config } from "../../shopify-accelerate";

export const shopifyCliPull = async () => {
  const { store, theme_id, environment, theme_path } = config;
  const cleanThemePath = theme_path?.replace(/^\.\//gi, "")?.replace(/\\/gi, "/");
  await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.yellowBright(
          `Downloading Theme Files from https://admin.shopify.com/store/${store}/themes/${theme_id}`
        )}`
      );
    }, 1000);
    exec(
      `shopify theme pull --environment ${environment} && cd ${cleanThemePath} && git init && git add . && git commit -m init`,
      (error, stdout, stderr) => {
        const vcsPath = path.join(process.cwd(), ".idea/vcs.xml");
        const workspace = path.join(process.cwd(), ".idea/workspace.xml");
        if (fs.existsSync(workspace)) {
          if (fs.existsSync(vcsPath)) {
            const vcsContent = fs.readFileSync(vcsPath, { encoding: "utf-8" });
            if (
              !vcsContent.includes(
                `<mapping directory="$PROJECT_DIR$/${cleanThemePath}" vcs="Git" />`
              )
            ) {
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
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
            `Theme Files & Git Initialized`
          )}`
        );

        clearInterval(interval);
        resolve(true);
      }
    );
  });
};
