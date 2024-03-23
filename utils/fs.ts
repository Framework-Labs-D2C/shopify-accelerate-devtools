import fs from "fs";

export const readFileSync = (path, options) => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, { ...options, encoding: "utf-8" }) as unknown as string;
  }
  return "";
};
