const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Display date for small caps. Keeps the ISO `datetime` value untouched. */
export function formatDate(iso: string): string {
  const full = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (full) {
    const month = MONTHS[Number(full[2]) - 1];
    if (month) return `${month} ${Number(full[3])}, ${full[1]}`;
  }
  return iso;
}
