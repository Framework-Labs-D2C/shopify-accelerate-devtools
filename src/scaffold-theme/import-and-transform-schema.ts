import escodegen from "escodegen";
import * as tsParser from "@typescript-eslint/typescript-estree";
import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import importFresh from "import-fresh";
import { delay } from "../utils/delay";

// Recursive function to transform `blocks` and remove `block_order`
function transformBlocks(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  for (const key of Object.keys(obj)) {
    if (key === "blocks" && obj[key] && typeof obj[key] === "object") {
      // Convert `blocks` to an array of values
      obj[key] = Object.entries(obj[key]).map(([_, value]) => transformBlocks(value));
    } else if (key === "block_order") {
      // Remove `block_order`
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      // Recursively handle nested objects
      transformBlocks(obj[key]);
    }
  }

  return obj;
}

// Helper to create an AST ObjectExpression from a JS object
function createObjectExpression(obj: any): any {
  if (Array.isArray(obj)) {
    return {
      type: "ArrayExpression",
      elements: obj.map(createObjectExpression),
    };
  }

  if (typeof obj === "object" && obj !== null) {
    return {
      type: "ObjectExpression",
      properties: Object.entries(obj).map(([key, value]) => ({
        type: "Property",
        key: { type: "Identifier", name: key },
        value: createObjectExpression(value),
        kind: "init",
      })),
    };
  }

  // Primitive values
  return {
    type: "Literal",
    value: obj,
  };
}
export const importAndTransformSchema = async (file: any) => {
  let importedData = importFresh(file);

  const presets = Object.values(importedData)?.[0]?.presets;
  if (Array.isArray(presets) && presets.some((preset) => typeof preset?.blocks === "object" && !Array.isArray(preset?.blocks))) {
    const data = fs.readFileSync(file, { encoding: "utf-8" });

    const ast = tsParser.parse(data, {
      loc: true,
      range: true,
      comment: true,
      tokens: true,
      ecmaFeatures: {
        jsx: false,
        globalReturn: false,
      },
    });

    let presetsNode = null;
    let exportTypeAnnotation = null;

    // Traverse the AST to find the `presets` array and export type annotations
    tsParser.simpleTraverse(ast, {
      enter(node, parent) {
        if (
          node.type === "Property" &&
          node.key.type === "Identifier" &&
          node.key.name === "presets" &&
          node.value.type === "ArrayExpression"
        ) {
          presetsNode = node.value;
        }

        // Capture the type annotation of the export
        if (
          parent?.type === "VariableDeclarator" &&
          parent.id.type === "Identifier" &&
          parent.id.typeAnnotation?.type === "TSTypeAnnotation"
        ) {
          exportTypeAnnotation = parent.id.typeAnnotation;
        }
      },
    });

    if (!presetsNode) {
      console.error("No presets array found in the file.");
      return;
    }

    // Transform each preset object in the array
    presetsNode.elements.forEach((element, index) => {
      if (element.type === "ObjectExpression") {
        // Convert the AST ObjectExpression into a JavaScript object
        const obj = eval(`(${escodegen.generate(element)})`);

        // Apply the transformation
        const transformed = transformBlocks(obj);

        // Replace the existing element with the transformed object
        presetsNode.elements[index] = createObjectExpression(transformed);
      }
    });

    // Generate the transformed code
    let transformedData = escodegen.generate(ast, {
      comment: true,
      format: {
        quotes: "double", // Use double quotes
        semicolons: false, // Omit semicolons
        compact: false, // Keep formatting readable
        retainLines: true, // Retain existing line structure where possible
        indent: {
          style: "  ", // Use double spaces for indentation
        },
        newline: "\n", // Use Unix-style line endings
        trailingComma: true, // Add trailing commas where applicable
      },
    });

    // Reinsert the type annotation manually
    if (exportTypeAnnotation) {
      const typeAnnotationCode = data.slice(exportTypeAnnotation.range[0], exportTypeAnnotation.range[1]);
      transformedData = transformedData.replace(/export const (\w+)\s*=/, `export const $1 ${typeAnnotationCode} =`);
    }

    fs.writeFileSync(`${file}`, transformedData.split("export const ").join("\nexport const "), { encoding: "utf-8" });

    await new Promise((resolve, reject) => {
      exec(`eslint ${file} --fix`, (error, stdout, stderr) => {
        console.log(
          `[${chalk.gray(new Date().toLocaleTimeString())}]: ${chalk.greenBright(
            `/${file.split(/[\\/]/).at(-2)}/schema.ts Prettified`
          )}`
        );
        resolve(true);
        if (error) {
          console.log(`error: ${error.message}`);
          reject();
        }
      });
    });
    await delay(500);
    importedData = importFresh(file);

    console.log(importedData, transformedData);
  }

  return importedData;
};
