import { generateBaseTypes } from "./generate-base-types";
import { generateSchemaLocales } from "./generate-schema-locales";
import { generateSchemaVariables } from "./generate-schema-variables";
import { generateSectionsTypes } from "./generate-section-types";
import { generateSettingTypes } from "./generate-setting-types";
import { generateThemeFiles } from "./generate-theme-files";
import { getSources, getTargets } from "./parse-files";
import { parseLocales } from "./parse-locales";

export const buildTheme = async () => {
  generateBaseTypes();

  getSources();
  getTargets();
  parseLocales();
  generateSchemaVariables();
  generateSchemaLocales();
  generateSectionsTypes();
  generateSettingTypes();
  generateThemeFiles();
};
