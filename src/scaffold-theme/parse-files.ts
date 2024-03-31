import chalk from "chalk";
import importFresh from "import-fresh";
import path from "path";
import { ShopifyBlock, ShopifySection, ShopifySettings } from "../../@types/shopify";
import { config } from "../../shopify-accelerate";
import { getAllFiles } from "../utils/fs";

export const getSources = () => {
  const { folders, disabled_theme_blocks } = config;

  const sourceFiles = [
    ...getAllFiles(folders.sections),
    ...getAllFiles(folders.snippets),
    ...getAllFiles(folders.config),
    ...getAllFiles(folders.templates),
    ...getAllFiles(folders.assets),
    ...getAllFiles(folders.layout),
    ...getAllFiles(folders.utils),
    ...getAllFiles(folders.types),
    ...getAllFiles(folders.blocks),
  ];

  const typeScriptSchema = [];

  const snippets = [];
  const layouts = [];
  const sectionsLiquid = [];
  const sectionsSchemaFiles = [];
  const settingsFiles = [];
  const blocksLiquid = [];
  const blocksSchemaFiles = [];
  const giftCards = [];
  const sectionGroups = [];
  const configs = [];
  const templates = [];
  const customerTemplates = [];
  const assets = [];

  sourceFiles.forEach((filePath) => {
    if (isTypeScriptSchema(filePath)) {
      typeScriptSchema.push(filePath);
    }
    if (isSnippet(filePath)) {
      snippets.push(filePath);
    }
    if (isLayout(filePath)) {
      layouts.push(filePath);
    }
    if (isSectionLiquid(filePath)) {
      sectionsLiquid.push(filePath);
    }
    if (isSectionSchema(filePath)) {
      sectionsSchemaFiles.push(filePath);
    }
    if (isBlockLiquid(filePath)) {
      blocksLiquid.push(filePath);
      if (disabled_theme_blocks) {
        snippets.push(filePath);
      }
    }
    if (isBlockSchema(filePath)) {
      blocksSchemaFiles.push(filePath);
    }
    if (isGiftCard(filePath)) {
      giftCards.push(filePath);
    }
    if (isSectionGroup(filePath)) {
      sectionGroups.push(filePath);
    }
    if (isConfig(filePath)) {
      configs.push(filePath);
    }
    if (isTemplate(filePath)) {
      templates.push(filePath);
    }
    if (isCustomerTemplate(filePath)) {
      customerTemplates.push(filePath);
    }
    if (isAsset(filePath)) {
      assets.push(filePath);
    }
    if (isSettingsSchema(filePath)) {
      settingsFiles.push(filePath);
    }
  });

  config.sources.snippets = snippets;
  config.sources.layouts = layouts;
  config.sources.sectionsLiquid = sectionsLiquid;
  config.sources.sectionsSchemaFiles = sectionsSchemaFiles;
  config.sources.assets = assets;
  config.sources.giftCards = giftCards;
  config.sources.configs = configs;
  config.sources.sectionGroups = sectionGroups;
  config.sources.templates = templates;
  config.sources.customerTemplates = customerTemplates;
  config.sources.settingsFile = settingsFiles[0];
  config.sources.settingsSchema = (
    importFresh(settingsFiles[0]) as { settingsSchema: ShopifySettings }
  )?.settingsSchema;
  config.sources.sectionSchemas = sectionsSchemaFiles.reduce(
    (acc, file) => {
      try {
        const data = importFresh(file);

        return {
          ...acc,
          ...Object.entries(data).reduce((acc2, [key, val]) => {
            // @ts-ignore
            acc2[key] = { ...val, folder: file.split(/[\\/]/gi).at(-2), path: file };
            return acc2;
          }, {}),
        };
      } catch (err) {
        console.log(chalk.redBright(err.message));
        return acc;
      }
    },
    {} as { [T: string]: ShopifySection }
  );
  config.sources.blocksLiquid = blocksLiquid;
  config.sources.blockSchemas = blocksSchemaFiles.reduce(
    (acc, file) => {
      try {
        const data = importFresh(file);

        return {
          ...acc,
          ...Object.entries(data).reduce((acc2, [key, val]) => {
            // @ts-ignore
            acc2[key] = { ...val, folder: file.split(/[\\/]/gi).at(-2), path: file };
            return acc2;
          }, {}),
        };
      } catch (err) {
        console.log(chalk.redBright(err.message));
        return acc;
      }
    },
    {} as { [T: string]: ShopifyBlock }
  );
};

export const getSchemaSources = () => {
  const { folders, disabled_theme_blocks } = config;

  const sourceFiles = [
    ...getAllFiles(folders.layout),
    ...getAllFiles(folders.snippets),
    ...getAllFiles(folders.blocks),
    ...getAllFiles(folders.sections),
    ...getAllFiles(folders.config),
  ];

  const typeScriptSchema = [];

  const snippets = [];
  const layouts = [];
  const sectionsLiquid = [];
  const sectionsSchemaFiles = [];
  const settingsFiles = [];
  const blocksLiquid = [];
  const blocksSchemaFiles = [];
  const giftCards = [];
  const assets = [];

  sourceFiles.forEach((filePath) => {
    if (isTypeScriptSchema(filePath)) {
      typeScriptSchema.push(filePath);
    }
    if (isSnippet(filePath)) {
      snippets.push(filePath);
    }

    if (isLayout(filePath)) {
      layouts.push(filePath);
    }
    if (isSectionLiquid(filePath)) {
      sectionsLiquid.push(filePath);
    }
    if (isSectionSchema(filePath)) {
      sectionsSchemaFiles.push(filePath);
    }
    if (isBlockLiquid(filePath)) {
      blocksLiquid.push(filePath);
      if (disabled_theme_blocks) {
        snippets.push(filePath);
      }
    }
    if (isBlockSchema(filePath)) {
      blocksSchemaFiles.push(filePath);
    }
    if (isAsset(filePath)) {
      assets.push(filePath);
    }
    if (isSettingsSchema(filePath)) {
      settingsFiles.push(filePath);
    }
  });

  Object.keys(require.cache)?.forEach((file) => {
    if (file.includes("@utils\\settings")) {
      importFresh(file);
    }
  });

  config.sources.snippets = snippets;
  config.sources.layouts = layouts;
  config.sources.sectionsLiquid = sectionsLiquid;
  config.sources.sectionsSchemaFiles = sectionsSchemaFiles;
  config.sources.blocksLiquid = blocksLiquid;
  config.sources.giftCards = giftCards;
  config.sources.settingsFile = settingsFiles[0];
  config.sources.settingsSchema = (
    importFresh(settingsFiles[0]) as { settingsSchema: ShopifySettings }
  )?.settingsSchema;
  config.sources.sectionSchemas = sectionsSchemaFiles.reduce(
    (acc, file) => {
      try {
        const data = importFresh(file);

        return {
          ...acc,
          ...Object.entries(data).reduce((acc2, [key, val]) => {
            // @ts-ignore
            acc2[key] = { ...val, folder: file.split(/[\\/]/gi).at(-2), path: file };
            return acc2;
          }, {}),
        };
      } catch (err) {
        console.log(chalk.redBright(err.message));
        return acc;
      }
    },
    {} as { [T: string]: ShopifySection }
  );
  config.sources.blockSchemas = blocksSchemaFiles.reduce(
    (acc, file) => {
      try {
        const data = importFresh(file);

        return {
          ...acc,
          ...Object.entries(data).reduce((acc2, [key, val]) => {
            // @ts-ignore
            acc2[key] = { ...val, folder: file.split(/[\\/]/gi).at(-2), path: file };
            return acc2;
          }, {}),
        };
      } catch (err) {
        console.log(chalk.redBright(err.message));
        return acc;
      }
    },
    {} as { [T: string]: ShopifyBlock }
  );
};

export const getTargets = () => {
  const { theme_path } = config;

  const targetFiles = [
    ...getAllFiles(path.join(theme_path, "sections")),
    ...getAllFiles(path.join(theme_path, "config")),
    ...getAllFiles(path.join(theme_path, "templates")),
  ];

  const sections = [];
  const settings = [];
  const giftCards = [];
  const sectionGroups = [];
  const configs = [];
  const templates = [];
  const customerTemplates = [];

  targetFiles.forEach((file) => {
    if (/[\\/]sections[\\/][^\\/]*\.liquid$/gi.test(file)) {
      sections.push(file);
    }
    if (isGiftCard(file)) {
      giftCards.push(file);
    }
    if (/[\\/]sections[\\/][\\/]*\.json$/gi.test(file)) {
      sectionGroups.push(file);
    }
    if (isConfig(file)) {
      configs.push(file);
    }
    if (isTemplate(file)) {
      templates.push(file);
    }
    if (isCustomerTemplate(file)) {
      customerTemplates.push(file);
    }
    if (isSettingsSchema(file)) {
      settings.push(file);
    }
  });

  config.targets.assets = getAllFiles(path.join(theme_path, "assets"));
  config.targets.blocks = getAllFiles(path.join(theme_path, "blocks"));
  config.targets.layout = getAllFiles(path.join(theme_path, "layout"));
  config.targets.locales = getAllFiles(path.join(theme_path, "locales"));
  config.targets.snippets = getAllFiles(path.join(theme_path, "snippets"));
  config.targets.sections = sections;
  config.targets.settings = settings[0];
  config.targets.giftCards = giftCards;
  config.targets.sectionGroups = sectionGroups;
  config.targets.configs = configs;
  config.targets.templates = templates;
  config.targets.customerTemplates = customerTemplates;
};

export const isTypeScriptSchema = (name: string) =>
  /[\\/]sections[\\/][^\\/]*[\\/]schema.ts$/gi.test(name) ||
  /[\\/]config[\\/]settings_schema\.ts$/gi.test(name) ||
  /[\\/]@utils[\\/]settings[\\/][^\\/]*\.ts$/gi.test(name);

export const isSectionLiquid = (name: string) =>
  /[\\/]sections[\\/][^\\/]*[\\/][^.]*\.liquid$/gi.test(name);

export const isSectionSchema = (name: string) =>
  /[\\/]sections([\\/])[^\\/]*([\\/])schema.ts$/gi.test(name);

export const isSettingsSchema = (name: string) =>
  /[\\/]config[\\/]settings_schema\.ts$/gi.test(name);

export const isAsset = (name: string) =>
  /[\\/]assets[\\/][^\\/]*$/gi.test(name) ||
  /[\\/]snippets[\\/][^\\/]*.js$/gi.test(name) ||
  /[\\/]blocks[\\/][^\\/]*.js$/gi.test(name) ||
  /[\\/]sections[\\/][^\\/]*.js$/gi.test(name);

export const isSnippet = (name: string) => {
  return (
    /[\\/]sections[\\/][^\\/]*[\\/][^.]*\.[^.]*\.liquid$/gi.test(name) ||
    /[\\/]blocks[\\/][^\\/]*[\\/][^.]*\.[^.]*\.liquid$/gi.test(name) ||
    /[\\/]snippets[\\/][^\\/]*\.liquid$/gi.test(name)
  );
};

export const isBlockLiquid = (name: string) =>
  /[\\/]blocks[\\/][^\\/]*[\\/][^.]*\.liquid$/gi.test(name);

export const isBlockSchema = (name: string) =>
  /[\\/]blocks([\\/])[^\\/]*([\\/])schema.ts$/gi.test(name);

export const isLayout = (name: string) => {
  return /[\\/]layout[\\/][^\\/]*\.liquid$/gi.test(name);
};

export const isSectionGroup = (name: string) =>
  /[\\/]templates[\\/]section-groups[\\/][^\\/]*\.json$/gi.test(name);

export const isConfig = (name: string) => /[\\/]config[\\/][^\\/]*\.json$/gi.test(name);

export const isTemplate = (name: string) => /[\\/]templates[\\/][^\\/]*\.json$/gi.test(name);

export const isCustomerTemplate = (name: string) =>
  /[\\/]templates[\\/]customers[\\/][^\\/]*\.json$/gi.test(name);

export const isGiftCard = (name: string) => /[\\/]templates[\\/]gift_card\.liquid$/gi.test(name);

export const isLiquid = (name: string) =>
  isSectionLiquid(name) ||
  isBlockLiquid(name) ||
  isSnippet(name) ||
  isLayout(name) ||
  isGiftCard(name);
