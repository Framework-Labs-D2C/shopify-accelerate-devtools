import chalk from "chalk";
import fs from "fs";
import path from "path";
import { config } from "../../shopify-accelerate";

export const readFile = (file_path, options?: any) => {
  if (fs.existsSync(file_path)) {
    return fs.readFileSync(file_path, { encoding: "utf-8", ...options }) as unknown as string;
  }
  return "";
};

export const writeCompareFile = (file_path, content, successCallback = (updated: boolean) => {}) => {
  if (!fs.existsSync(file_path)) {
    const dirname = path.dirname(file_path);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(file_path, content);
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(`Created: ${file_path.replace(process.cwd(), "")}`)}`
    );
    successCallback(true);
    return;
  }

  const contentVerification = fs.readFileSync(file_path, {
    encoding: "utf-8",
  });

  if (contentVerification.replace(/[\n|\s]*$/gi, "") !== content.replace(/[\n|\s]*$/gi, "")) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(`Updated: ${file_path.replace(process.cwd(), "")}`)}`
    );
    fs.writeFileSync(file_path, content);
    successCallback(true);
    return;
  }

  successCallback(false);
};
export const renameFile = (file_path, new_file_path, successCallback = () => {}) => {
  if (!fs.existsSync(file_path)) {
    successCallback();
    return;
  }

  if (fs.existsSync(new_file_path) && fs.statSync(new_file_path).isDirectory() && !fs.readdirSync(new_file_path)?.length) {
    fs.rmSync(new_file_path, { recursive: true });
  }

  fs.renameSync(file_path, new_file_path);
  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(
      `Renamed: ${file_path.replace(process.cwd(), "")} -> ${new_file_path.split(/[\\/]/gi).at(-1)}`
    )}`
  );
  successCallback();
};

export const writeOnlyNew = (file_path, content, successCallback = () => {}) => {
  if (!fs.existsSync(file_path)) {
    const dirname = path.dirname(file_path);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(file_path, content);
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.cyanBright(`Created: ${file_path.replace(process.cwd(), "")}`)}`
    );
  }
  successCallback();
};

export const getAllFiles = (dirname) => {
  if (!fs.existsSync(dirname)) {
    if (config.headless) {
      return [];
    }
    if (/[\\/]cards$/gi.test(dirname)) {
      return [];
    }
    if (/[\\/]classic-blocks$/gi.test(dirname)) {
      return [];
    }
    fs.mkdirSync(dirname, { recursive: true });
  }

  return fs.readdirSync(dirname).reduce((acc, file) => {
    const name = path.join(dirname, file);

    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...acc, ...getAllFiles(name)] : [...acc, name];
  }, []);
};

export const getAllDirectories = (dirname) => {
  if (!fs.existsSync(dirname)) {
    if (config.headless) {
      return [];
    }
    if (/[\\/]cards$/gi.test(dirname)) {
      return [];
    }
    if (/[\\/]classic-blocks$/gi.test(dirname)) {
      return [];
    }
    fs.mkdirSync(dirname, { recursive: true });
  }
  return fs.readdirSync(dirname).reduce((acc, file) => {
    const name = path.join(dirname, file);

    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...acc, name] : acc;
  }, []);
};

export const deleteFile = (file_path: string) => {
  if (!fs.existsSync(file_path)) return;

  fs.unlinkSync(file_path);
  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Deleted: ${file_path.replace(process.cwd(), "")}`)}`
  );
};

export const deleteFolder = (file_path: string) => {
  if (!fs.existsSync(file_path)) return;

  fs.rmdirSync(file_path, { recursive: true });
  console.log(
    `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.redBright(`Deleted: ${file_path.replace(process.cwd(), "")}`)}`
  );
};
