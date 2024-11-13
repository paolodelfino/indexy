import "client-only";

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  fractionalSecondDigits: 3,
  hour12: false,
});

// TODO: Remove
// export function dateToIsoString(value: Date): string {
//   const parts = dateTimeFormat.formatToParts(value);
//   const year = parts
//     .find((part) => part.type === "year")!
//     .value.padStart(4, "0");
//   const month = parts.find((part) => part.type === "month")!.value;
//   const day = parts.find((part) => part.type === "day")!.value;
//   const hour = parts.find((part) => part.type === "hour")!.value;
//   const minute = parts.find((part) => part.type === "minute")!.value;
//   const second = parts.find((part) => part.type === "second")!.value;
//   const fractionalSecond = parts.find(
//     (part) => part.type === "fractionalSecond",
//   )!.value;

//   const date = `${year}-${month}-${day}T${hour}:${minute}:${second}.${fractionalSecond}`;
//   return date;
// }

export function datetime(date: Date, time: Time) {
  date.setHours(time.hours);
  date.setMinutes(time.minutes);
  date.setSeconds(time.seconds);
  date.setMilliseconds(time.milliseconds);

  return date;
}

export function dateToString(value: Date) {
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

  const date = `${day} ${month} ${year} ${hour}:${minute}:${second}.${fractionalSecond}`;
  return date;
}
