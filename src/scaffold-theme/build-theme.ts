import { generateAllMissingBlockPresetsFiles } from "./generate-blocks-presets-files";
import { fixNamingConventions } from "./fix-naming-conventions";
import { generateAssetFiles } from "./generate-asset-files";
import { generateCardsTypes } from "./generate-card-types";
import { generateClassicBlocksTypes } from "./generate-classic-blocks-types";
import { generateLiquidFiles } from "./generate-liquid-files";
import { generateAllMissingPresetsFiles } from "./generate-presets-files";
import { generateAllMissingSchemaFiles } from "./generate-schema-files";
import { generateSchemaLocales } from "./generate-schema-locales";
import { generateSchemaVariables } from "./generate-schema-variables";
import { generateSectionsTypes } from "./generate-section-types";
import { generateSettingTypes } from "./generate-setting-types";
import { generateThemeBlocksTypes } from "./generate-theme-blocks-types";
import { parseLocales } from "./parse-locales";

export const buildTheme = async () => {
  await fixNamingConventions();

  parseLocales();
  generateAllMissingPresetsFiles();
  generateAllMissingBlockPresetsFiles();
  await generateAllMissingSchemaFiles();
  generateSchemaVariables();
  generateSchemaLocales();
  generateSectionsTypes();
  generateThemeBlocksTypes();
  generateClassicBlocksTypes();
  generateCardsTypes();
  generateSettingTypes();
  generateLiquidFiles();
  generateAssetFiles();
};
