import "client-only";

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
});

export function dateToIsoString(value: Date): string {
  const parts = dateTimeFormat.formatToParts(value);
  const year = parts
    .find((part) => part.type === "year")!
    .value.padStart(4, "0");
  const month = parts.find((part) => part.type === "month")!.value;
  const day = parts.find((part) => part.type === "day")!.value;
  const hour = parts.find((part) => part.type === "hour")!.value;
  const minute = parts.find((part) => part.type === "minute")!.value;
  const second = parts.find((part) => part.type === "second")!.value;
  const fractionalSecond = parts.find(
    (part) => part.type === "fractionalSecond",
  )!.value;

  const date = `${year}-${month}-${day}T${hour}:${minute}:${second}.${fractionalSecond}`;
  return date;
}
