import { getFormattedTimeSlot } from "./format";

type TimeSlot = {
    start: Date;
    end: Date;
};

/**
 * This function checks if a new time slot is available by comparing it with existing slots.
 * @param {TimeSlot[]} existingSlots - The existing time slots
 * @param {TimeSlot} newSlot - The new time slot to check
 * @returns {boolean} True if the new slot is available, false otherwise
 * @example
 * const existingSlots = [
 *  { start: Thu Jan 01 1970 15:00:00 GMT+0100 (heure normale d’Europe centrale), end: Thu Jan 01 1970 17:00:00 GMT+0100 (heure normale d’Europe centrale) },
 *  { start: Mon May 12 2025 19:00:00 GMT+0200 (heure d’été d’Europe centrale), end: Mon May 12 2025 21:00:00 GMT+0200 (heure d’été d’Europe centrale) }
 * ];
 * const newSlot = {
 *  start: Mon May 12 2025 08:00:00 GMT+0200 (heure d’été d’Europe centrale),
 *  end: Mon May 12 2025 10:00:00 GMT+0200 (heure d’été d’Europe centrale)
 * };
 * console.log(isNewSlotAvailable(existingSlots, newSlot)); // true
 */
export function isNewSlotAvailable(
    existingSlots: TimeSlot[],
    newSlot: TimeSlot
): boolean {
    for (const slot of existingSlots) {
        const existingStart = getFormattedTimeSlot(slot.start);
        const existingEnd = getFormattedTimeSlot(slot.end);
        const newStart = getFormattedTimeSlot(newSlot.start);
        const newEnd = getFormattedTimeSlot(newSlot.end);

        if (newStart < existingEnd && newEnd > existingStart) {
            return false;
        }
    }
    return true;
}
