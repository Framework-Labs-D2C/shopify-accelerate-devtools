export const toCamelCase = (str) =>
  str
    .replace(/^_/g, "")
    .replace(/_/gi, "-")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/[\s-]+/gi, "");
