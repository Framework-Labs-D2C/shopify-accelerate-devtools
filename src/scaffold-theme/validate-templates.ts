import { config } from "../../shopify-accelerate";
import { buildTheme } from "../../src/scaffold-theme/build-theme";
import { generateConfigFiles } from "../../src/scaffold-theme/generate-config-files";
import { getTargets } from "../../src/scaffold-theme/parse-files";
import { shopifyCliCreate, shopifyCliPull, shopifyCliPush } from "../../src/shopify-cli/pull";
import { readFile, writeCompareFile } from "../../src/utils/fs";
import userInput from "prompts";

export const getTargetsAndValidateTemplates = async (novalidate = false) => {
  getTargets();

  const count = 0;
  const templates = [
    ...new Set([
      ...config.targets.sectionGroups,
      ...config.targets.configs,
      ...config.targets.templates,
      ...config.targets.customerTemplates,
    ]),
  ];

  /* templates.forEach((template) => {
    const originalContent = readFile(template);
    const content = originalContent.replace(
      /(custom_css": ")([^"]*?)(&[^{@"]*?{)([^&{}@"]*?)(@media[^{"]*?{[^&{}"]*?})([^}&"]*?})/gi,
      (match, p1, p2, p3, p4, p5, p6, p7) => {
        // console.log({ p1, p2, p3, p4, p5, p6, p7 });
        count++;
        const result = `${p1}${p2}${p3}${p4}${p6}\\n${p5.replace(/{([^&{}]*?})/gi, (match, m1, m2) => {
          console.log({ match, m1, m2 });
          return `{\\n  ${p3}${m1}\\n}`;
        })}`?.replace(/\n/gi, "\\n");
        // console.log({ match, result });
        return result;
      }
    );
    if (content !== originalContent) {
      writeCompareFile(template, content);
    }
  });
*/
  /*let count = 0;
  templates.forEach((template) => {
    const originalContent = readFile(template);
    const content = originalContent.replace(
      /(custom_css": ")([^"@]*?)(&[^{"@]*?{)([^&{}"@]*?)(@media[^{"@]*?{[^&{}"@]*?})([^}&"@]*?})/gi,
      (match, p1, p2, p3, p4, p5, p6) => {
        // console.log({ p1, p2, p3, p4, p5, p6 });
        count++;
        const result = `${p1}${p2}${p3}${p4}${p6}\\n${p5.replace(/{([^&{}]*?})/gi, (match, m1) => {
          // console.log({ match, m1 });
          return `{\\n  ${p3}${m1}\\n}`;
        })}`?.replace(/\n/gi, "\\n");
        console.log({ match, result });
        return result;
      }
    );
    if (content !== originalContent) {
      writeCompareFile(template, content);
    }
  });*/

  if (templates.some((template) => /"(type|id)":\s+(["'`])([^'"`]*-[^'"`]*)\2/gi.test(readFile(template)))) {
    const results = novalidate
      ? { reinitialize: true, shopify_cli_method: "" }
      : await userInput([
          {
            type: "confirm",
            name: "reinitialize",
            message: `Settings mismatch discovered. Re-initialization required. Do you want to proceed?`,
            initial: true,
          },
          {
            type: (prev) => (prev === true ? "select" : null),
            name: "shopify_cli_method",
            message: "Choose your method to proceed with:",
            choices: [
              { title: "Override Existing Shopify Theme", value: "override" },
              { title: "Create a new Shopify Theme", value: "new" },
            ],
            initial: 0,
          },
        ]);

    if (!results.reinitialize) {
      return;
    }

    await shopifyCliPull("Transform Savepoint");

    await buildTheme();
    generateConfigFiles();

    getTargets();
    const templates = [
      ...new Set([
        ...config.targets.sectionGroups,
        ...config.targets.configs,
        ...config.targets.templates,
        ...config.targets.customerTemplates,
      ]),
    ];
    templates.forEach((template) => {
      const originalContent = readFile(template);
      const content = originalContent.replace(/"(type|id)":\s+(["'`])([^'"`]*-[^'"`]*)\2/gi, (match, p1, p2, p3) => {
        return `"${p1}": ${p2}${p3.replace(/-/gi, "_")}${p2}`;
      });

      if (content !== originalContent) {
        writeCompareFile(template, content);
      }
    });

    if (results.shopify_cli_method === "override") {
      await shopifyCliPush();
    }
    if (results.shopify_cli_method === "new") {
      await shopifyCliCreate();
    }
  }
};
