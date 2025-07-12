import APP_CONFIG from "$/constants/app.config.constants";

type formatDateParam = {
  date: Date | number | string;
  format?: string;
};

/**
 * Formats a date object into a string based on the provided format.
 *
 * @param {object} params - An object containing the date and format.
 * @param {Date|number|string} params.date - The date to format. Can be a Date object,
 * a timestamp (number), or a date string that can be parsed by Date.parse().
 * @param {string} params.format - The desired date format string.
 * @returns {string|null} - The formatted date string, or null if the date is invalid.
 */
function formatDate({
  date,
  format = APP_CONFIG.dateFormats[0].value,
}: formatDateParam): string | null {
  if (!date || !format) {
    return null; // Handle null or undefined input
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return null; // Invalid date
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  const milliseconds = String(dateObj.getMilliseconds()).padStart(3, "0");
  const monthNameShort = dateObj.toLocaleString("en-US", { month: "short" });

  return format
    .replace("YYYY", String(year))
    .replace("YY", String(year).slice(2))
    .replace("MMM", monthNameShort)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds)
    .replace("SSS", milliseconds);
}

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${date.getDate()}`;

const getMonthTitle = (date: Date) =>
  `${APP_CONFIG.monthNames[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;

export { formatDate, getDateKey, getMonthKey, getMonthTitle };
