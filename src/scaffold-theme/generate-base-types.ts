import path from "path";
import { config } from "../../shopify-accelerate";
import { readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";

export const generateBaseTypes = () => {
  const { folders, package_types } = config;
  writeCompareFile(
    path.join(folders.types, "shopify.ts"),
    readFile(path.join(package_types, "shopify.ts"))
  );
  writeOnlyNew(
    path.join(folders.types, "settings.ts"),
    readFile(path.join(package_types, "settings.ts"))
  );
  writeOnlyNew(
    path.join(folders.types, "sections.ts"),
    readFile(path.join(package_types, "sections.ts"))
  );
  writeOnlyNew(
    path.join(folders.types, "metafields.ts"),
    readFile(path.join(package_types, "metafields.ts"))
  );
};
