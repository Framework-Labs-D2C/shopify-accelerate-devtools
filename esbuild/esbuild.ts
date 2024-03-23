import path from "path";

const { build } = require("esbuild");

// import watch from "node-watch";
const watch = require("node-watch");
const fs = require("fs");
console.log(process.cwd());

const runEsBuild = () => {
  build({
    entryPoints: [
      path.join(process.cwd(), "assets", "theme.ts"),
      path.join(process.cwd(), "assets", "editor.ts"),
    ],
    metafile: true,
    target: "es2020",
    // sourcemap: "external",
    treeShaking: true,
    bundle: true,
    // outfile: "./assets/theme.js",
    outdir: path.join(process.cwd(), "assets"),
    minify: false,
    ignoreAnnotations: true,
    packages: "external",
    format: "esm",
    legalComments: "none",
    keepNames: true,
    // splitting: true,
  })
    .then((e) => {
      console.log("theme.js - bundled");
    })
    .catch((error) => {
      console.error(error);
      // eslint-disable-next-line no-process-exit
    });
};

export const runEsbuild = () => {
  watch(process.cwd(), { recursive: true }, async (evt, name) => {
    if (!name.match(/\.(ts)x?$/)) return;

    console.log(name);
    try {
      runEsBuild();
    } catch (err) {
      console.log(err);
    }
  });

  runEsBuild();
};
