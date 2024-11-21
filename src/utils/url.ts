import { dateFromString, dateToString } from "@/utils/date";
import "client-only"; // For date value
import { types } from "util";

// TODO: Maybe move in form

interface Values {
  [key: string]: string | string[] | Date | Values | undefined | boolean;
}

export function valuesToSearchParams(values: Values, prefix?: string) {
  let sb = "";

  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; ++i) {
    const key = (prefix === undefined ? "" : prefix) + keys[i];
    const value = values[keys[i]];

    if (value === undefined) sb += `${key}=___undefined`;
    else if (typeof value === "string")
      sb += `${key}=${encodeURIComponent(value)}`;
    else if (typeof value === "boolean") sb += `${key}=___boolean${value}`;
    else if (Array.isArray(value)) {
      let sb2 = `${key}=${value.length}&${key}=`;

      if (value.length > 0) sb2 += "&";

      for (let j = 0; j < value.length; ++j) {
        sb2 += `${key}=${encodeURIComponent(value[j])}`;
        if (j + 1 < value.length) sb2 += "&";
      }

      sb += sb2;
    } else if (types.isDate(value))
      sb += `${key}=___date${encodeURIComponent(dateToString(value))}`;
    else sb += valuesToSearchParams(value, `___object${key}___`);

    if (i + 1 < keys.length) sb += "&";
  }

  return sb;
}

/**
 * At the moment, you can only have one nested object
 */
export function valuesFromSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  let obj: Values = {};

  for (const key in searchParams) {
    const value = searchParams[key] as string | string[];

    function getValue(value: string | string[]) {
      if (Array.isArray(value)) {
        const len = Number(value[0]);
        if (len <= 0) return [];
        else return value.slice(2);
      } else if (value.startsWith("___date"))
        return dateFromString(value.slice(7));
      else if (value.startsWith("___boolean"))
        return value.slice(10) === "true" ? true : false;
      else if (value.startsWith("___undefined")) return undefined;
      else return value; // TODO: Qui, le stringhe dei valori sono decodate? Mi sa che i searchParams non hanno nessun valore decodato. Vedere se non decoda nulla.
    }

    if (key.startsWith("___object")) {
      const parentKeyEnd = key.indexOf("___", 9);
      const parentKey = key.slice(9, parentKeyEnd);
      const k = key.slice(parentKeyEnd + 3);

      if (obj[parentKey] === undefined) obj[parentKey] = {};
      (obj[parentKey] as Values)[k] = getValue(value);
    } else obj[key] = getValue(value);
  }

  return obj;
}

/**
 * Make sure content is decoded, because when you get it from a dynamic route it is entirely treated as a name for an endpoint and therefore it gets encoded. Use `decodeURIComponent()`
 */
export function valuesFromSearchParamsString(searchParamsStr: string) {
  const searchParams: {
    [key: string]: string | string[] | undefined;
  } = {};
  for (const [key, value] of new URLSearchParams(searchParamsStr).entries()) {
    if (searchParams[key] === undefined) searchParams[key] = value;
    else if (typeof searchParams[key] === "string")
      searchParams[key] = [searchParams[key], value];
    else searchParams[key].push(value);
  }
  return valuesFromSearchParams(searchParams);
}
