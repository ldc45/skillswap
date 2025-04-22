/**
 * This function formats a given date to a string in the format "HH:MM".
 * @param {Date} date - The date to format
 * @returns {String} The formatted date string
 * @example
 * const date = new Date("2023-10-01T14:30:00Z");
 * console.log(getFormattedDate(date)); // "14:30"
 */
export function getFormattedDate(date: Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
