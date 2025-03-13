export const formatObject = (obj, indent = 2, level = 0) => {
  if (obj === null) return "null";
  if (typeof obj === "boolean" || typeof obj === "number") return obj.toString();

  if (typeof obj === "string") {
    // Use backticks for multiline strings, otherwise use double quotes
    if (obj.includes("\n") || obj.includes('"')) {
      return `\`${obj.replace(/`/g, "\\`")}\``; // Escape backticks
    }
    return `"${obj}"`; // Always use double quotes
  }

  const spacing = " ".repeat(level * indent);
  const nextSpacing = " ".repeat((level + 1) * indent);

  if (Array.isArray(obj)) {
    return `[\n${obj.map((item) => `${nextSpacing}${formatObject(item, indent, level + 1)}`).join(",\n")}\n${spacing}]`;
  }

  if (typeof obj === "object") {
    return `{\n${Object.entries(obj)
      .map(([key, value]) => `${nextSpacing}${key}: ${formatObject(value, indent, level + 1)}`)
      .join(",\n")}\n${spacing}}`;
  }

  return obj.toString();
};
