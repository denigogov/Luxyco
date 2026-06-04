type Locale = "mk-MK" | "de-DE";

export const priceFormatted = (
  value: number,
  locale: Locale = "mk-MK",
): string => {
  const currencyText = {
    "mk-MK": "ден.",
    "de-DE": "€",
  };

  return `${value} ${currencyText[locale]}`;
};
