import chalk from "chalk";
import fs from "fs";
import path from "path";

export const readFile = (file_path, options?: any) => {
  if (fs.existsSync(file_path)) {
    return fs.readFileSync(file_path, { ...options, encoding: "utf-8" }) as unknown as string;
  }
  return "";
};

export const writeCompareFile = (file_path, content, successCallback = () => {}) => {
  if (!fs.existsSync(file_path)) {
    const dirname = path.dirname(file_path);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(file_path, content);
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
        `Created: ${file_path.replace(process.cwd(), "")}`
      )}`
    );
    successCallback();
    return;
  }

  const contentVerification = fs.readFileSync(file_path, {
    encoding: "utf-8",
  });

  if (contentVerification !== content) {
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
        `Updated: ${file_path.replace(process.cwd(), "")}`
      )}`
    );
    fs.writeFileSync(file_path, content);
    successCallback();
  }
};

export const writeOnlyNew = (file_path, content, successCallback = () => {}) => {
  if (!fs.existsSync(file_path)) {
    const dirname = path.dirname(file_path);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(file_path, content);
    console.log(
      `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.blueBright(
        `Created: ${file_path.replace(process.cwd(), "")}`
      )}`
    );
  }
  successCallback();
};

export const getAllFiles = (dirname) => {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  return fs.readdirSync(dirname).reduce((acc, file) => {
    const name = path.join(dirname, file);

    const isDirectory = fs.statSync(name).isDirectory();
    return isDirectory ? [...acc, ...getAllFiles(name)] : [...acc, name];
  }, []);
};
