import { describe, expect, test } from "@jest/globals";

import { isNewSlotAvailable } from "@/utils/validator";

describe("isNewSlotAvailable", () => {
  test("should return false when the new time slot ends after an existing time slot starts", () => {
    const existingSlots = [
      // 15:00 - 16:00
      {
        start: new Date(
          "Thu Jan 01 1970 15:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
        end: new Date(
          "Thu Jan 01 1970 16:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
      },
      // 18:00 - 20:00
      {
        start: new Date(
          "Mon May 12 2025 18:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
        end: new Date(
          "Mon May 12 2025 20:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
      },
    ];
    // 17:00 - 19:00
    const newSlot = {
      start: new Date(
        "Mon May 12 2025 17:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
      end: new Date(
        "Mon May 12 2025 19:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
    };
    expect(isNewSlotAvailable(existingSlots, newSlot)).toBe(false);
  });

  test("should return false when the new time slot starts before an existing time slot ends", () => {
    const existingSlots = [
      // 15:00 - 16:00
      {
        start: new Date(
          "Thu Jan 01 1970 15:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
        end: new Date(
          "Thu Jan 01 1970 16:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
      },
      // 18:00 - 20:00
      {
        start: new Date(
          "Mon May 12 2025 18:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
        end: new Date(
          "Mon May 12 2025 20:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
      },
    ];
    // 15:30 - 17:30
    const newSlot = {
      start: new Date(
        "Mon May 12 2025 15:30:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
      end: new Date(
        "Mon May 12 2025 17:30:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
    };
    expect(isNewSlotAvailable(existingSlots, newSlot)).toBe(false);
  });

  test("should return false when the new time slot and an existing one are the same", () => {
    const existingSlots = [
      // 15:00 - 16:00
      {
        start: new Date(
          "Thu Jan 01 1970 15:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
        end: new Date(
          "Thu Jan 01 1970 16:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
      },
      // 18:00 - 20:00
      {
        start: new Date(
          "Mon May 12 2025 18:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
        end: new Date(
          "Mon May 12 2025 20:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
      },
    ];
    // 15:00 - 16:00
    const newSlot = {
      start: new Date(
        "Mon May 12 2025 15:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
      end: new Date(
        "Mon May 12 2025 16:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
    };
    expect(isNewSlotAvailable(existingSlots, newSlot)).toBe(false);
  });

  test("should return true when the new time slot starts when an existing one ends and ends when an existing one starts", () => {
    const existingSlots = [
      // 15:00 - 16:00
      {
        start: new Date(
          "Thu Jan 01 1970 15:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
        end: new Date(
          "Thu Jan 01 1970 16:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
      },
      // 18:00 - 20:00
      {
        start: new Date(
          "Mon May 12 2025 18:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
        end: new Date(
          "Mon May 12 2025 20:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
      },
    ];
    // 16:00 - 18:00
    const newSlot = {
      start: new Date(
        "Mon May 12 2025 16:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
      end: new Date(
        "Mon May 12 2025 18:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
    };
    expect(isNewSlotAvailable(existingSlots, newSlot)).toBe(true);
  });

  test("should return true when the new time slot is completely outside of existing slots", () => {
    const existingSlots = [
      // 15:00 - 16:00
      {
        start: new Date(
          "Thu Jan 01 1970 15:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
        end: new Date(
          "Thu Jan 01 1970 16:00:00 GMT+0100 (heure normale d’Europe centrale)"
        ),
      },
      // 18:00 - 20:00
      {
        start: new Date(
          "Mon May 12 2025 18:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
        end: new Date(
          "Mon May 12 2025 20:00:00 GMT+0200 (heure d’été d’Europe centrale)"
        ),
      },
    ];
    // 10:00 - 14:00
    const newSlot = {
      start: new Date(
        "Mon May 12 2025 10:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
      end: new Date(
        "Mon May 12 2025 14:00:00 GMT+0200 (heure d’été d’Europe centrale)"
      ),
    };
    expect(isNewSlotAvailable(existingSlots, newSlot)).toBe(true);
  });
});
