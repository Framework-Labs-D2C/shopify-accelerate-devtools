export const toLocaleFriendlySnakeCase = (str: string) => {
  if (typeof str === "number") {
    str = `${str}`;
  }
  str = str && str.length <= 1 ? str.replace(/^ /gi, "empty_char") : str?.replaceAll(" ", " ");
  try {
    return (
      str &&
      str
        .replace("%", "percentage")
        .replace("$", "dollar")
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join("_")
    );
  } catch (err) {
    if (str.length <= 5) {
      return `custom_char_${escape(str)
        .replace("%", "percentage")
        .replace("$", "dollar")
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join("_")}`;
    }
    return str;
  }
};

export const toSnakeCase = (str: string) => {
  if (typeof str === "number") {
    str = `${str}`;
  }
  try {
    return (
      str &&
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join("_")
    );
  } catch (err) {
    console.log({ err, str });
    return str.toLowerCase().replace(/\s+/gi, "_");
  }
};
