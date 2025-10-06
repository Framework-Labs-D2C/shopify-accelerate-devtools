import path from "path";
import type { Sections } from "types/sections";
import { config } from "../../shopify-accelerate";
import { deleteFolder, readFile, writeCompareFile } from "../utils/fs";

export const backupNamesInSettings = () => {
  writeCompareFile(path.join(config.theme_path, ".gitignore"), `.template_history\n.shopify`);

  deleteFolder(path.join(config.theme_path, "template_history"));

  if (!config.auto_backups) return;

  const templates = [
    ...new Set([...config.targets.sectionGroups, ...config.targets.templates, ...config.targets.customerTemplates]),
  ];

  const prefix = `/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */`;
  const templateData: { sections: Sections; order: string[] }[] = [];
  const templateData2: { path: string; template: { sections: Sections; order: string[] } }[] = [];

  templates.forEach((template, index) => {
    if (/[\\/]config[\\/]/gi.test(template)) return;
    const content = readFile(template);
    eval(`"use strict"; templateData.push(${content})`);
    templateData2[index] = {
      path: template,
      template: templateData[index],
    };
  });

  const parseBlocks = (item) => {
    if (item?.settings && item?.name) {
      item.settings.hidden_name_backup = item?.name;
    }
    if (item.blocks) {
      for (const key in item.blocks) {
        const child = item.blocks[key];
        parseBlocks(child);
      }
    }
  };

  templateData2.forEach((entry) => {
    for (const key in entry.template.sections) {
      const item = entry.template.sections[key];
      parseBlocks(item);
    }

    writeCompareFile(entry.path, `${prefix}\n${JSON.stringify(entry.template, null, 2)}`);
  });
};

export const restoreNamesInSettingsFromBackup = () => {
  writeCompareFile(path.join(config.theme_path, ".gitignore"), `.template_history\n.shopify`);

  deleteFolder(path.join(config.theme_path, "template_history"));

  if (!config.auto_backups) return;

  const templates = [
    ...new Set([...config.targets.sectionGroups, ...config.targets.templates, ...config.targets.customerTemplates]),
  ];

  const prefix = `/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */`;
  const templateData: { sections: Sections; order: string[] }[] = [];
  const templateData2: { path: string; template: { sections: Sections; order: string[] } }[] = [];

  templates.forEach((template, index) => {
    if (/[\\/]config[\\/]/gi.test(template)) return;
    const content = readFile(template);
    eval(`"use strict"; templateData.push(${content})`);
    templateData2[index] = {
      path: template,
      template: templateData[index],
    };
  });

  const parseBlocks = (item) => {
    if (item?.settings && item.settings.hidden_name_backup && !item.name) {
      item.name = item.settings.hidden_name_backup;
    }
    if (item.blocks) {
      for (const key in item.blocks) {
        const child = item.blocks[key];
        parseBlocks(child);
      }
    }
  };

  templateData2.forEach((entry) => {
    for (const key in entry.template.sections) {
      const item = entry.template.sections[key];
      parseBlocks(item);
    }

    writeCompareFile(entry.path, `${prefix}\n${JSON.stringify(entry.template, null, 2)}`);
  });
};
