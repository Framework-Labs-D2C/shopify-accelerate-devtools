// eslint-disable-next-line node/no-unpublished-require
const plugin = require("tailwindcss/plugin");
require("dotenv").config();
console.log(process.env.THEME_PATH);

module.exports = {
  content: [
    `${process.env.THEME_PATH}/**/*{html,liquid,js,json}`,
    `!${process.env.THEME_PATH}/**/*.css.liquid`,
    `!${process.env.THEME_PATH}/**/*.css`,
  ],
  darkMode: "class", // or 'media' or 'class'
  // mode: process.env.NODE_ENV ? "jit" : undefined,
  // important: true,
  mode: "jit",
  theme: {
    extend: {
      screens: {
        xs: "427px" /*smaller than iphone pro max*/,
      },
      padding: {
        sm: "var(--layout-padding-sm)",
        md: "var(--layout-padding-md)",
        lg: "var(--layout-padding-lg)",
        xl: "var(--layout-padding-xl)",
        gutter: "var(--layout-container-gutter)",
      },
      maxWidth: {
        container: {
          xs: `var(--layout-page-width-xs)`,
          sm: `var(--layout-page-width-sm)`,
          md: `var(--layout-page-width-md)`,
          lg: `var(--layout-page-width-lg)`,
        },
        "8xl": "90rem",
      },
      borderRadius: {
        "theme-sm": `var(--rounded-theme-sm)`,
        theme: `var(--rounded-theme)`,
        "theme-md": `var(--rounded-theme-md)`,
        "theme-lg": `var(--rounded-theme-lg)`,
        "theme-xl": `var(--rounded-theme-xl)`,
        "theme-2xl": `var(--rounded-theme-2xl)`,
        "theme-3xl": `var(--rounded-theme-3xl)`,
      },
      colors: {
        theme: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          "bg-hex": "var(--color-bg-hex)",
          text: "rgb(var(--color-text) / <alpha-value>)",
          "text-hex": "var(--color-text-hex)",
          "overlay-text": "rgb(var(--color-overlay-text) / <alpha-value>)",
          "overlay-text-hex": "var(--color-overlay-text-hex)",
        },
        primary: {
          text: "rgb(var(--color-primary-text) / <alpha-value>)",
          bg: "rgb(var(--color-primary-bg) / <alpha-value>)",
          outline: "rgb(var(--color-primary-outline) / <alpha-value>)",
        },
        secondary: {
          text: "rgb(var(--color-secondary-text) / <alpha-value>)",
          bg: "rgb(var(--color-secondary-bg) / <alpha-value>)",
          outline: "rgb(var(--color-secondary-outline) / <alpha-value>)",
        },
        error: "rgb(var(--color-error) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        gray: {
          50: "rgb(var(--color-gray-50) / <alpha-value>)",
          100: "rgb(var(--color-gray-100) / <alpha-value>)",
          200: "rgb(var(--color-gray-200) / <alpha-value>)",
          300: "rgb(var(--color-gray-300) / <alpha-value>)",
          400: "rgb(var(--color-gray-400) / <alpha-value>)",
          500: "rgb(var(--color-gray-500) / <alpha-value>)",
          600: "rgb(var(--color-gray-600) / <alpha-value>)",
          700: "rgb(var(--color-gray-700) / <alpha-value>)",
          800: "rgb(var(--color-gray-800) / <alpha-value>)",
          900: "rgb(var(--color-gray-900) / <alpha-value>)",
        },
      },
      ringColor: {
        DEFAULT: `rgb(var(--color-primary-bg))`,
      },
      boxShadow: {
        "invert-sm": "0 -1px 2px 0 rgb(0 0 0 / 0.05)",
        "invert-md": "0 -4px 6px 1px rgb(0 0 0 / 0.07), 0 -2px 4px 2px rgb(0 0 0 / 0.07)",
        "invert-lg": "0 -10px 15px 3px rgb(0 0 0 / 0.1), 0 -4px 6px 4px rgb(0 0 0 / 0.1)",
        "invert-xl": "0 -20px 25px 5px rgb(0 0 0 / 0.1), 0 -8px 10px 6px rgb(0 0 0 / 0.1)",
        "invert-2xl": "0 -25px 50px 12px rgb(0 0 0 / 0.25)",
      },

      keyframes: {
        slide: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        circle: {
          "0%": { strokeDashoffset: "90" },
          "100%": { strokeDashoffset: "0" },
        },
        dot: {
          "0%,95%": { fill: "transparent", stroke: "currentColor", strokeOpacity: "0.1" },
          "100%": { fill: "currentColor", stroke: "transparent", strokeOpacity: "0" },
        },
        typewriter: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        slide: "slide 30s linear infinite",
        circle: "circle 8.1s linear",
        dot: "dot 8.1s linear",
        typewriter: "typewriter 0.5s linear infinite",
      },
    },
    variants: {
      extend: {},
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-container-queries-with-max-width"),
    // require("@tailwindcss/forms"),
    plugin(({ addVariant, addUtilities, matchUtilities, theme }) => {
      addVariant("svg", ["& svg"]);
      addVariant("hfa", ["&:hover", "&:focus", "&:active"]);
      addVariant("hfwa", ["&:hover", "&:focus", "&:focus-within", "&:active"]);
      addVariant("hfwaa", ["&:hover", "&:focus", "&:focus-within", "&:active", "&.active"]);
      addVariant("hfva", ["&:hover", "&:focus", "&:focus-visible", "&:active"]);
      addVariant("ha", ["&:hover", "&:active"]);
      addVariant("hf", ["&:hover", "&:focus-visible"]);
      addVariant("fa", ["&:focus", "&:active"]);
      addVariant("f", ["&:focus"]);
      addVariant("fw", ["&:focus-within"]);
      addVariant("h", ["&:hover"]);
      addVariant("d", [".dark &"]);
      addVariant("ac", ["&.active"]);
      addVariant("b", ["&::before"]);
      addVariant("a", ["&::after"]);
      addVariant("not-prose", [":not(.prose &)&"]);
      addVariant("hfaa", ["&:hover", "&:focus", "&:active, &.active"]);
      addVariant("hfvaa", ["&:hover", "&:focus", "&:focus-visible", "&:active", "&.active"]);
      addVariant("group-hfa", [".group:hover &", ".group:focus &", ".group:active &"]);
      addVariant("group-hf", [".group:hover &", ".group:focus &"]);
      addVariant("group-ac", [".group.active &"]);

      addVariant("group-hfva", [
        ".group:hover &",
        ".group:focus &",
        ".group:focus-visible &",
        ".group:active &",
      ]);
      addVariant("group-hfwa", [
        ".group:hover &",
        ".group:focus &",
        ".group:focus-within &",
        ".group:active &",
      ]);
      addVariant("peer-hfwa", [
        ".peer:hover ~ &",
        ".peer:focus ~ &",
        ".peer:focus-within ~ &",
        ".peer:active ~ &",
      ]);
      matchUtilities(
        {
          "top-spacing": (value) => ({
            top: `calc(${theme("spacing.top-bar-spacing")} + ${value})`,
          }),
        },
        { values: theme("spacing") }
      );
      addUtilities({
        ".shape-geometric-precision": {
          "shape-rendering": "geometricPrecision",
        },
        ".open-quote": {
          content: "open-quote",
        },
        ".close-quote": {
          content: "close-quote",
        },
        ".leading-0": {
          "line-height": "0",
        },
        ".animation-pause": {
          "animation-play-state": "paused",
        },
      });
    }),
  ],
};
