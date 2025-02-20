import { fixNamingConventions } from "./fix-naming-conventions";
import { generateCardsTypes } from "./generate-card-types";
import { generateClassicBlocksTypes } from "./generate-classic-blocks-types";
import { generateAssetFiles } from "./generate-asset-files";
import { generateBaseTypes } from "./generate-base-types";
import { generateLiquidFiles } from "./generate-liquid-files";
import { generateAllMissingSchemaFiles } from "./generate-schema-files";
import { generateSchemaLocales } from "./generate-schema-locales";
import { generateSchemaVariables } from "./generate-schema-variables";
import { generateSectionsTypes } from "./generate-section-types";
import { generateSettingTypes } from "./generate-setting-types";
import { generateThemeBlocksTypes } from "./generate-theme-blocks-types";
import { getSources, getTargets } from "./parse-files";
import { parseLocales } from "./parse-locales";

export const buildTheme = async () => {
  generateBaseTypes();
  await getSources();
  getTargets();

  await fixNamingConventions();

  parseLocales();
  generateAllMissingSchemaFiles();
  generateSchemaVariables();
  generateSchemaLocales();
  generateSectionsTypes();
  generateThemeBlocksTypes();
  generateClassicBlocksTypes();
  // generateCardsTypes();
  generateSettingTypes();
  generateLiquidFiles();
  generateAssetFiles();
};
