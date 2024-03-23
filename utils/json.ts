export const JSONParse = <T = unknown>(object: any, origin = ""): T => {
  try {
    return JSON.parse(object);
  } catch (err) {
    // console.log({ object }, err);
    return null;
  }
};
