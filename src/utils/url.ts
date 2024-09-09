export function normalizeSearchParams(searchParams: URLSearchParams): {
  [key: string]: string | string[] | undefined;
} {
  const result: { [key: string]: string | string[] | undefined } = {};

  searchParams.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
}

export function getParams(path: string, firstIsParam: boolean = false) {
  const parts = path.split("/").filter(Boolean);
  return parts.slice(firstIsParam ? 0 : 1);
}
