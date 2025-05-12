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

/**
 * This function formats a given date to a number representing the hours and minutes.
 * @param {Date} slotDate - The date to format
 * @returns {Number} The formatted date number
 * @example
 * const slotDate = Mon May 12 2025 16:45:00 GMT+0200 (heure d’été d’Europe centrale)
 * console.log(getFormattedTimeSlot(date)); // 16.75
 */
export function getFormattedTimeSlot(slotDate: Date): number {
  return slotDate.getHours() + slotDate.getMinutes() / 60;
}
