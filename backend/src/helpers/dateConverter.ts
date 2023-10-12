interface DateFormatOptions {
  weekday: "short" | "long" | "narrow";
  year: "numeric" | "2-digit";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day: "numeric" | "2-digit";
  timeZone: "UTC";
}

export default function dateConverter(date: string) {
  const parts = date.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-based (0 = January, 11 = December)
  const day = parseInt(parts[2], 10);

  const utcDate = new Date(Date.UTC(year, month, day));

  // Request a weekday along with a long date
  const options: DateFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };

  return utcDate.toLocaleString("en-US", options);
}
