type AnyObject = Record<string, any>;

export function deepMerge(obj1: AnyObject, obj2: AnyObject): AnyObject {
  const output: AnyObject = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (
        typeof obj2[key] === "object" &&
        !Array.isArray(obj2[key]) &&
        obj2[key] !== null
      ) {
        if (
          typeof obj1[key] === "object" &&
          !Array.isArray(obj1[key]) &&
          obj1[key] !== null
        ) {
          output[key] = deepMerge(obj1[key], obj2[key]);
        } else {
          output[key] = obj2[key];
        }
      } else {
        output[key] = obj2[key];
      }
    }
  }

  return output;
}
