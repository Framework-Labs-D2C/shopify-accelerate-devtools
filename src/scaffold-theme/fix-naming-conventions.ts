import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { config } from "../../shopify-accelerate";
import { generateBaseTypes } from "./generate-base-types";
import { getSources, getTargets } from "./parse-files";
import { readFile, renameFile, writeCompareFile } from "../utils/fs";

export const fixNamingConventions = async (force = false) => {
  if (force) {
    generateBaseTypes();
    await getSources();
    getTargets();
  }

  const sourceLiquidFiles = [
    ...new Set([
      ...config.sources.snippets,
      ...config.sources.sectionsLiquid,
      ...config.sources.blocksLiquid,
      ...config.sources.cardsLiquid,
      ...config.sources.classic_blocksLiquid,
      ...config.sources.layouts,
    ]),
  ];

  const sourceJsFiles = [
    ...new Set([
      ...config.sources.cardsJs,
      ...config.sources.blocksJs,
      ...config.sources.classic_blocksJs,
      ...config.sources.sectionsJs,
    ]),
  ];

  const schemaFiles = [
    ...new Set([
      config.sources.settingsFile,
      ...config.sources.blocksSchemaFiles,
      ...config.sources.cardsSchemaFiles,
      ...config.sources.classic_blocksSchemaFiles,
      ...config.sources.sectionsSchemaFiles,
    ]),
  ];

  const getDirectoriesSync = (source) => {
    try {
      return fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => ({ ...dirent }));
    } catch (err) {
      console.error("Error reading directory:", err);
      return [];
    }
  };

  const directories = [
    config.folders.blocks,
    config.folders.sections,
    config.folders.classic_blocks,
    config.folders.cards,
  ].flatMap(getDirectoriesSync);

  if (
    [...sourceLiquidFiles, ...sourceJsFiles].some((filename) => /[\\/](?!\.)[^\\/]*-[^\\/]*$/gi.test(filename)) ||
    directories.some((dir) => dir.name.includes("-")) ||
    force
  ) {
    /* Rename JS Files */
    sourceJsFiles.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      if (fileName.includes("-")) {
        renameFile(file, file.replace(fileName, fileName.replace(/-/gi, "_")));
      }
    });

    /* Transform Render / Include / Section calls */
    sourceLiquidFiles.forEach((file) => {
      const originalContent = readFile(file, { encoding: "utf-8" });
      let content = originalContent;
      const regexSnippets = /(render|include)\s+(['"])([^'"]*-[^'"]*)\2/i;
      const regexSections = /(section)\s+(['"])([^'"]*-[^'"]*)\2/i;

      const regexSectionGroups = /(sections)\s+(['"])([^'"]*-[^'"]*)\2/i;

      if (regexSnippets.test(content)) {
        const filename = `${content.match(regexSnippets)?.[3]}.liquid`;

        if (
          [...config.sources.snippets].some(
            (file) => file.split(/[\\/]/gi).at(-1) === filename || file.split(/[\\/]/gi).at(-1) === filename.replace(/-/gi, "_")
          )
        ) {
          content = content.replace(
            /(render|include)\s+(['"])([^'"]*-[^'"]*)\2/gi,
            (match, p1, p2, p3, offset, fullString) => `${p1} "${p3.replace(/-/gi, "_")}"`
          );
        }
      }

      if (regexSections.test(content)) {
        const filename = `${content.match(regexSections)?.[3]}.liquid`;
        if (
          [...config.sources.sectionsLiquid].some(
            (file) => file.split(/[\\/]/gi).at(-1) === filename || file.split(/[\\/]/gi).at(-1) === filename.replace(/-/gi, "_")
          )
        ) {
          content = content.replace(
            /(section)\s+(['"])([^'"]*-[^'"]*)\2/gi,
            (match, p1, p2, p3, offset, fullString) => `${p1} "${p3.replace(/-/gi, "_")}"`
          );
        }
      }

      if (content !== originalContent) {
        writeCompareFile(file, content);
      }
    });

    /* Rename Liquid Files*/
    sourceLiquidFiles.forEach((file) => {
      const fileName = file.split(/[\\/]/gi).at(-1);
      if (fileName.includes("-")) {
        renameFile(file, file.replace(fileName, fileName.replace(/-/gi, "_")));
      }
    });

    schemaFiles.forEach((file) => {
      const originalContent = readFile(file, { encoding: "utf-8" });
      const content = originalContent.replace(/ (type|id):\s+(["'`])([^'"`]*-[^'"`]*)\2/gi, (match, p1, p2, p3) => {
        return ` ${p1}: ${p2}${p3.replace(/-/gi, "_")}${p2}`;
      });

      if (content !== originalContent) {
        writeCompareFile(file, content);
      }
    });

    directories.forEach((dir) => {
      if (dir.name.includes("-")) {
        renameFile(path.join(dir.path, dir.name), path.join(dir.path, dir.name.replace(/-/gi, "_")));
      }
    });

    await new Promise((resolve, reject) => {
      exec(`git add ."`, async (error, stdout, stderr) => {
        resolve(true);
      });
    });

    // console.log(config.sources.snippets);
    await getSources();
    getTargets();
  }
};
