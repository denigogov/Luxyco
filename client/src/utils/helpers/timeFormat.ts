type TimeFormatOptions = {
  locale?: string;
  timeZone?: string;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  showTime?: boolean;
};

export function timeFormat(
  createdAt: string | number | Date,
  opts: TimeFormatOptions = {},
  localeCountry: string = "mk-MK"
): string {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  const locale =
    opts.locale ??
    (typeof navigator !== "undefined" ? navigator.language : "de-DE");

  const timeZone =
    opts.timeZone ??
    (typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC");

  const showTime = opts.showTime ?? false;

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    dateStyle: opts.dateStyle ?? "medium",
    ...(showTime ? { timeStyle: opts.timeStyle ?? "short" } : {}),
  };

  return new Intl.DateTimeFormat(localeCountry || locale, formatOptions).format(
    date
  );
}
