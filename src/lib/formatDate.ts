export function formatToReadableDate(isoString: string): string {
  const date = new Date(isoString);

  const formatted = date.toLocaleString("en-US", {
    month: "short",      // "Jul"
    day: "2-digit",      // "17"
    year: "numeric",     // "2025"
    hour: "2-digit",     // "10"
    minute: "2-digit",   // "56"
    second: "2-digit",   // "12"
    hour12: false,       // 24-hour format
    timeZone: "Asia/Jakarta", // WIB time zone
  });

  return formatted.replace(",", "");
}