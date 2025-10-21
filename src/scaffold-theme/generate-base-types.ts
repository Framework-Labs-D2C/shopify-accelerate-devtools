import path from "path";
import { config } from "../../shopify-accelerate";
import { readFile, writeCompareFile, writeOnlyNew } from "../utils/fs";

export const generateBaseTypes = () => {
  const { folders, package_types } = config;
  writeCompareFile(path.join(folders.types, "shopify.ts"), readFile(path.join(package_types, "shopify.ts")));
  writeOnlyNew(path.join(folders.types, "settings.ts"), readFile(path.join(package_types, "settings.ts")));
  writeOnlyNew(path.join(folders.types, "sections.ts"), readFile(path.join(package_types, "sections.ts")));
  writeOnlyNew(path.join(folders.types, "metafields.ts"), readFile(path.join(package_types, "metafields.ts")));
  writeCompareFile(
    path.join(config.theme_path, "assets", "_shopify.d.ts"),
    readFile(path.join(package_types, "shopify.ts"))
      .replace(/(\s+from\s+")types[\\/]([^"\\/]*")/gi, "$1_$2")
      .replace(/(\s+from\s+"[^"]*?)\.js"/gi, '$1.js"')
  );
  writeCompareFile(
    path.join(config.theme_path, "assets", "_settings.d.ts"),
    readFile(path.join(package_types, "settings.ts"))
      .replace(/(\s+from\s+")types[\\/]([^"\\/]*")/gi, "$1_$2")
      .replace(/(\s+from\s+"[^"]*?)\.js"/gi, '$1.js"')
  );
  writeCompareFile(
    path.join(config.theme_path, "assets", "_sections.d.ts"),
    readFile(path.join(package_types, "sections.ts"))
      .replace(/(\s+from\s+")types[\\/]([^"\\/]*")/gi, "$1_$2")
      .replace(/(\s+from\s+"[^"]*?)\.js"/gi, '$1.js"')
  );
  writeCompareFile(
    path.join(config.theme_path, "assets", "_metafields.d.ts"),
    readFile(path.join(package_types, "metafields.ts"))
      .replace(/(\s+from\s+")types[\\/]([^"\\/]*")/gi, "$1_$2")
      .replace(/(\s+from\s+"[^"]*?)\.js"/gi, '$1.js"')
  );
  writeCompareFile(
    path.join(config.theme_path, "assets", "_types.d.ts"),
    readFile(path.join(config.folders.assets, "types.d.ts"))
      .replace(/(\s+from\s+")sections\/[^."/]*?\/([^."/]*?).js"/gi, `$1./__section--$2.js"`)
      .replace(/(\s+from\s+")blocks\/[^."/]*?\/([^."/]*?).js"/gi, `$1./__block--$2.js"`)
      .replace(/(\s+from\s+")types\/([^."]*?).js"/gi, `$1./_$2.js"`)
      .replace(/(\s+from\s+")assets\/types.js"/gi, `$1./_types.js"`)
      .replace(/(\s+from\s+")assets\/([^."]*?).js"/gi, `$1./_$2.js"`)
  );
};
