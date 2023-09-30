export function deepSortObjectByKeys(obj: any) {
  if (typeof obj !== "object") {
    return obj;
  }

  const sortedObj = {};

  Object.keys(obj)
    .sort()
    .forEach((key) => {
      (sortedObj as any)[key] = deepSortObjectByKeys(obj[key]);
    });

  return sortedObj;
}
