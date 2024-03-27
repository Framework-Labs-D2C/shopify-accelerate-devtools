import fs from "fs";
import path from "path";
import { useGlobals } from "../../shopify-accelerate";
import { writeOnlyNew } from "../utils/fs";

export const generateConfigFiles = () => {
  const { theme_path, sources } = useGlobals.getState();

  sources.sectionGroups.forEach((file) => {
    const fileName = file.split(/[\\/]/gi).at(-1);
    const targetPath = path.join(process.cwd(), theme_path, "sections", fileName);
    const rawContent = fs.readFileSync(file, { encoding: "utf-8" });
    writeOnlyNew(targetPath, rawContent);
  });

  sources.configs.forEach((file) => {
    const fileName = file.split(/[\\/]/gi).at(-1);
    const targetPath = path.join(process.cwd(), theme_path, "config", fileName);
    const rawContent = fs.readFileSync(file, { encoding: "utf-8" });
    writeOnlyNew(targetPath, rawContent);
  });
  sources.templates.forEach((file) => {
    const fileName = file.split(/[\\/]/gi).at(-1);
    const targetPath = path.join(process.cwd(), theme_path, "templates", fileName);
    const rawContent = fs.readFileSync(file, { encoding: "utf-8" });
    writeOnlyNew(targetPath, rawContent);
  });
  sources.customerTemplates.forEach((file) => {
    const fileName = file.split(/[\\/]/gi).at(-1);
    const targetPath = path.join(process.cwd(), theme_path, "templates/customers", fileName);
    const rawContent = fs.readFileSync(file, { encoding: "utf-8" });
    writeOnlyNew(targetPath, rawContent);
  });
};
