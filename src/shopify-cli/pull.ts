import chalk from "chalk";
import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { readFile } from "../utils/fs";
import { config } from "../../shopify-accelerate";
import { buildTheme } from "../scaffold-theme/build-theme";
import { generateConfigFiles } from "../scaffold-theme/generate-config-files";
import { validateCliOptions } from "../validate-cli-options";

export const execCommand = async (command, withFeedback = false) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, {
      stdio: withFeedback ? ["pipe", "pipe", "inherit"] : "inherit",
      shell: true,
    });

    if (withFeedback) {
      childProcess.stdout.on("data", (data) => {
        if (data.includes("Next steps")) {
          childProcess.stdin.write("\n");
        }
        if (data.toString().includes("preview_theme_id")) {
          childProcess.stdin.write("\n");
        }
        console.log(data.toString());
      });
    }

    childProcess.on("error", (error) => {
      console.log({ error });
      reject(error);
    });
    childProcess.on("exit", (code, signal) => {
      console.log(`Child process exited with code ${code} and signal ${signal}`);
      resolve(true);
    });
    childProcess.on("close", (code) => {
      console.log(`Child process closed with code ${code}`);
      resolve(true);
    });
    childProcess.on("end", (code) => {
      console.log(`Child process closed with code ${code}`);
      resolve(true);
    });
    childProcess.on("disconnect", () => {
      console.log("Child process disconnected");
      resolve(true);
    });
    childProcess.on("message", (msg) => {
      console.log(`Received message from child: ${msg}`);
    });
  });
};

export const shopifyCliPull = async (initMessage = "init") => {
  const { store, theme_id, environment, theme_path } = config;
  const cleanThemePath = theme_path?.replace(/^\.\//gi, "")?.replace(/\\/gi, "/");
  let second_attempt = false;

  /*  await execCommand(
    `shopify theme pull --environment ${environment} && cd ${cleanThemePath} && git init && git add . && git commit -m "${initMessage}"`
  );*/

  await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.yellowBright(
          `Downloading Theme Files from https://admin.shopify.com/store/${store}/themes/${theme_id}`
        )}`
      );
    }, 1000);

    const shopifyCLIProcess = exec(
      `shopify theme pull --environment ${environment} && cd ${cleanThemePath} && git init && git add . && git commit -m "${initMessage}"`,
      async (error, stdout, stderr) => {
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
        if (stderr && stderr.includes(`doesn't exist`) && stderr.includes(`Theme`) && !second_attempt) {
          clearInterval(interval);
          second_attempt = true;
          console.log(stderr);
          console.log(`[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Error - Theme not Found`)}`);
          await validateCliOptions({
            store,
            environment,
            reset_theme_id: true,
          });
          await buildTheme();
          generateConfigFiles();
          await shopifyCliPull();

          resolve(true);
          return;
        }
        if (stderr && stderr.includes(`doesn't exist`) && stderr.includes(`Theme`)) {
          console.log(stderr);
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Error - Could not initialize the Theme`)}`
          );

          clearInterval(interval);
          resolve(true);
        }
        console.log(`[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(`Theme Files & Git Initialized`)}`);

        clearInterval(interval);
        resolve(true);
      }
    );
  });
};

export const shopifyCliPush = async () => {
  const { store, theme_id, environment, theme_path } = config;
  const cleanThemePath = theme_path?.replace(/^\.\//gi, "")?.replace(/\\/gi, "/");

  await execCommand(`shopify theme push --environment ${environment} && cd ${cleanThemePath} && git init && git add .`, true);

  /*await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.magentaBright(
          `Uploading Theme Files from https://admin.shopify.com/store/${store}/themes/${theme_id}`
        )}`
      );
    }, 1000);

    const shopifyCLIProcess = exec(
      `shopify theme push --environment ${environment} && cd ${cleanThemePath} && git init && git add .`,
      async (error, stdout, stderr) => {
        if (stderr && stderr.includes(`doesn't exist`) && stderr.includes(`Theme`)) {
          console.log(stderr);
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Error - Could not Upload the Theme`)}`
          );

          clearInterval(interval);
          resolve(true);
        }
        console.log(`[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(`Theme Files Uploaded`)}`);
        console.log(stdout);
        clearInterval(interval);
        resolve(true);
      }
    );

    shopifyCLIProcess.stdout.on("data", (data) => {
      process.stdout.write(`oldSchoolMakeBuild: ${data}`);
    });
  });*/
};

export const shopifyCliCreate = async () => {
  const { store, theme_id, environment, theme_path } = config;
  const cleanThemePath = theme_path?.replace(/^\.\//gi, "")?.replace(/\\/gi, "/");

  await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      console.log(
        `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.magentaBright(
          `Creating Theme Files from https://admin.shopify.com/store/${store}/themes/${theme_id}`
        )}`
      );
    }, 1000);

    const shopifyCLIProcess = exec(
      `shopify theme share --environment ${environment} && cd ${cleanThemePath} && git init && git add .`,
      async (error, stdout, stderr) => {
        if (stderr && stderr.includes(`doesn't exist`) && stderr.includes(`Theme`)) {
          console.log(stderr);
          console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Error - Could not Upload the Theme`)}`
          );

          clearInterval(interval);
          resolve(true);
        }
        console.log(`[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(`Theme Files Uploaded`)}`);

        console.log(stdout);
        clearInterval(interval);
        resolve(true);
      }
    );
  });
};
