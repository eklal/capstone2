import React from "react";
import Card from "../ui/Card";
import type { TrainerProfileDetail } from "../../features/trainerProfile/trainerProfileSlice";

type Availability = TrainerProfileDetail["availability"];

type TimeSlot = {
  id: number;
  start: string; // "HH:MM" 24h for <input type="time">
  end: string; // "HH:MM"
};

type DaySlots = {
  [K in keyof Availability]: TimeSlot[];
};

const DAYS: Array<keyof Availability> = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function timeInputToMinutes(value: string): number | null {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function minutesToDisplay(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  const mm = m.toString().padStart(2, "0");
  return `${h12}:${mm} ${suffix}`;
}

function parseAvailabilityString(str: string): TimeSlot[] {
  if (!str || str.toLowerCase().includes("unavailable")) return [];
  const segments = str.split(",").map((p) => p.trim());
  const slots: TimeSlot[] = [];
  let idCounter = Date.now();

  for (const segment of segments) {
    const match = segment.match(
      /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i
    );
    if (!match) continue;
    const [, sh, sm, samp, eh, em, eamp] = match;

    const toMinutesFrom12 = (hStr: string, mStr: string, ampm: string) => {
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      const upper = ampm.toUpperCase();
      if (upper === "AM") {
        if (h === 12) h = 0;
      } else {
        if (h !== 12) h += 12;
      }
      return h * 60 + m;
    };

    const startMin = toMinutesFrom12(sh, sm, samp);
    const endMin = toMinutesFrom12(eh, em, eamp);
    if (Number.isNaN(startMin) || Number.isNaN(endMin) || startMin >= endMin)
      continue;

    const toInput = (mins: number) => {
      const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, "0");
      const m = (mins % 60).toString().padStart(2, "0");
      return `${h}:${m}`;
    };

    slots.push({
      id: idCounter++,
      start: toInput(startMin),
      end: toInput(endMin),
    });
  }

  return slots;
}

function availabilityToSlots(availability: Availability): DaySlots {
  const result = {} as DaySlots;
  for (const day of DAYS) {
    result[day] = parseAvailabilityString(availability[day]);
  }
  return result;
}

function slotsToAvailability(daySlots: DaySlots): Availability {
  const availability = {} as Availability;
  for (const day of DAYS) {
    const slots = [...daySlots[day]];
    if (!slots.length) {
      availability[day] = "Unavailable";
      continue;
    }
    slots.sort((a, b) => {
      const sa = timeInputToMinutes(a.start) ?? 0;
      const sb = timeInputToMinutes(b.start) ?? 0;
      return sa - sb;
    });
    const parts = slots
      .map((slot) => {
        const s = timeInputToMinutes(slot.start);
        const e = timeInputToMinutes(slot.end);
        if (s == null || e == null || s >= e) return null;
        return `${minutesToDisplay(s)} - ${minutesToDisplay(e)}`;
      })
      .filter(Boolean) as string[];
    availability[day] = parts.length ? parts.join(", ") : "Unavailable";
  }
  return availability;
}

function hasOverlap(slots: TimeSlot[]): boolean {
  const ranges = slots
    .map((slot) => {
      const s = timeInputToMinutes(slot.start);
      const e = timeInputToMinutes(slot.end);
      if (s == null || e == null) return null;
      return { s, e };
    })
    .filter(Boolean) as { s: number; e: number }[];

  ranges.sort((a, b) => a.s - b.s);

  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i].s < ranges[i - 1].e) {
      return true;
    }
  }
  return false;
}

const AvailabilityCard: React.FC<{
  schedule: Availability;
  onUpdateSchedule?: (schedule: Availability) => void;
}> = ({ schedule, onUpdateSchedule }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [daySlots, setDaySlots] = React.useState<DaySlots>(() =>
    availabilityToSlots(schedule)
  );

  const [errors, setErrors] = React.useState<Partial<Record<keyof Availability, string>>>(
    {}
  );

  React.useEffect(() => {
    setDaySlots(availabilityToSlots(schedule));
    setErrors({});
  }, [schedule]);

  const handleChangeSlot = (
    day: keyof Availability,
    id: number,
    field: "start" | "end",
    value: string
  ) => {
    setDaySlots((prev) => {
      const updated: DaySlots = { ...prev };
      updated[day] = updated[day].map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      );
      return updated;
    });

    setErrors((prev) => {
      const updated = { ...prev };
      const slots = daySlots[day].map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      );

      const invalidRange = slots.some((slot) => {
        const s = timeInputToMinutes(slot.start);
        const e = timeInputToMinutes(slot.end);
        return s != null && e != null && s >= e;
      });

      const overlap = hasOverlap(slots);

      if (invalidRange) {
        updated[day] = "Start time must be before end time.";
      } else if (overlap) {
        updated[day] =
          "Time slots on the same day cannot overlap (e.g. 8–10 and 9–11).";
      } else {
        delete updated[day];
      }

      return updated;
    });
  };

  const handleAddSlot = (day: keyof Availability) => {
    const now = Date.now();
    setDaySlots((prev) => {
      const updated: DaySlots = { ...prev };
      const existing = updated[day] ?? [];
      const newSlot: TimeSlot = {
        id: now,
        start: "",
        end: "",
      };
      updated[day] = [...existing, newSlot];
      return updated;
    });
  };

  const handleRemoveSlot = (day: keyof Availability, id: number) => {
    setDaySlots((prev) => {
      const updated: DaySlots = { ...prev };
      updated[day] = updated[day].filter((slot) => slot.id !== id);
      return updated;
    });

    setErrors((prev) => {
      const updated = { ...prev };
      const slots = (daySlots[day] || []).filter((slot) => slot.id !== id);
      if (!hasOverlap(slots)) {
        delete updated[day];
      }
      return updated;
    });
  };

  const handleSave = () => {
    // prevent save if there are validation errors
    if (Object.keys(errors).length > 0) return;
    const updatedAvailability = slotsToAvailability(daySlots);
    onUpdateSchedule?.(updatedAvailability);
    setIsEditing(false);
  };

  const hasAnyError = Object.keys(errors).length > 0;

  return (
    <>
      <Card>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="text-sm text-gray-700">
          {Object.entries(schedule).map(([day, hours]) => (
            <div key={day} className="flex justify-between mb-2">
              <span className="capitalize">{day}</span>
              <span>{hours}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            className="w-full px-3 py-2 border rounded text-sm hover:bg-gray-50"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Update Schedule
          </button>
        </div>
      </Card>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Set Availability</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsEditing(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{day}</span>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => handleAddSlot(day)}
                    >
                      + Add Slot
                    </button>
                  </div>

                  {(daySlots[day] && daySlots[day].length > 0) ? (
                    <div className="space-y-2">
                      {daySlots[day].map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="time"
                            className="border rounded px-2 py-1 text-sm"
                            value={slot.start}
                            onChange={(e) =>
                              handleChangeSlot(day, slot.id, "start", e.target.value)
                            }
                          />
                          <span>-</span>
                          <input
                            type="time"
                            className="border rounded px-2 py-1 text-sm"
                            value={slot.end}
                            onChange={(e) =>
                              handleChangeSlot(day, slot.id, "end", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500 hover:text-red-600"
                            onClick={() => handleRemoveSlot(day, slot.id)}
                            aria-label="Remove slot"
                            title="Remove slot"
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Unavailable — click &quot;+ Add Slot&quot; to add time.
                    </div>
                  )}

                  {errors[day] && (
                    <div className="mt-2 text-xs text-red-500">{errors[day]}</div>
                  )}
                </div>
              ))}

              {hasAnyError && (
                <div className="text-xs text-red-500">
                  Please fix the invalid or overlapping time slots before saving.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t">
              <button
                type="button"
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                onClick={() => {
                  setDaySlots(availabilityToSlots(schedule));
                  setErrors({});
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm rounded text-white ${
                  hasAnyError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleSave}
                disabled={hasAnyError}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvailabilityCard;
