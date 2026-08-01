/** Opmaak van bedragen en datums, overal in het Nederlands. */

const priceFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

/** 38900 wordt "€ 389,00". */
export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

/** 38900 wordt "389.00" — voor JSON-LD en de betaalprovider. */
export function toAmountString(cents: number): string {
  return (cents / 100).toFixed(2);
}

const dateFormatter = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const dateFormatterShort = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDate(date: Date | string): string {
  return dateFormatter.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatDateShort(date: Date | string): string {
  return dateFormatterShort.format(typeof date === 'string' ? new Date(date) : date);
}

/** Telt werkdagen op bij een datum; weekenden slaan we over. */
export function addWorkingDays(start: Date, days: number): Date {
  const result = new Date(start);
  let remaining = days;
  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return result;
}
