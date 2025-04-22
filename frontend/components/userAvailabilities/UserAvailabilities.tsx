"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { getFormattedDate } from "@/utils/format";
import { DAYS } from "@/constants";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import EditAvailability from "@/components/editAvailability/EditAvailability";

interface UserAvailabilitiesProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

type Availability = {
  id: string;
  day: number;
  startTime: Date;
  endTime: Date;
};
// TODO: Get the availabilities from the user
const fakeAvailabilities = [
  {
    id: "1",
    day: 2,
    startTime: new Date("1970-01-01T14:00:00.000Z"),
    endTime: new Date("1970-01-01T19:00:00.000Z"),
  },
  {
    id: "2",
    day: 0,
    startTime: new Date("2025-04-20T10:00:00.000Z"),
    endTime: new Date("2025-04-20T12:00:00.000Z"),
  },
  {
    id: "3",
    day: 0,
    startTime: new Date("2025-04-20T12:00:00.000Z"),
    endTime: new Date("2025-04-20T16:00:00.000Z"),
  },
  {
    id: "4",
    day: 4,
    startTime: new Date("2025-04-24T15:00:00.000Z"),
    endTime: new Date("2025-04-24T19:00:00.000Z"),
  },
  {
    id: "5",
    day: 6,
    startTime: new Date("2025-04-26T14:00:00.000Z"),
    endTime: new Date("2025-04-26T19:00:00.000Z"),
  },
  {
    id: "6",
    day: 4,
    startTime: new Date("2025-04-24T12:00:00.000Z"),
    endTime: new Date("2025-04-24T16:00:00.000Z"),
  },
];

export default function UserAvailabilities({
  isEditing,
  setIsEditing,
}: UserAvailabilitiesProps) {
  const [availabilities, setAvailabilities] =
    useState<Availability[]>(fakeAvailabilities);

  return (
    <div className="basis-1/2 p-4 flex flex-col gap-y-2">
      <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
        Disponibilités
      </h4>

      <div className="divide-y">
        {DAYS.map((day) => {
          const availabilitiesForDay = availabilities.filter(
            (availability) => availability.day === day.id
          );
          return (
            <div key={day.id} className="py-4 flex gap-x-2">
              <div className="text-sm lg:text-lg md:text-base font-semibold whitespace-nowrap">
                {day.label} :
              </div>
              <div className="md:divide-x-2 flex flex-col md:flex-row divide-black">
                {availabilities
                  .filter((availability) => availability.day === day.id)
                  .map((availability) => (
                    <span
                      className="px-1 text-sm lg:text-lg md:text-base"
                      key={availability.id}
                    >
                      {getFormattedDate(availability.startTime)} -{" "}
                      {getFormattedDate(availability.endTime)}
                    </span>
                  ))}
              </div>
              {isEditing && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto cursor-pointer"
                    >
                      <Pencil />
                    </Button>
                  </AlertDialogTrigger>
                  <EditAvailability
                    selectedDay={day}
                    availabilities={availabilitiesForDay}
                    setAvailabilities={setAvailabilities}
                  />
                </AlertDialog>
              )}
            </div>
          );
        })}
      </div>

      {!isEditing ? (
        <Button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-fit lg:self-end self-center md:text-lg"
        >
          Modifier
        </Button>
      ) : (
        <div className="flex flex-basis grow">
          <Button
            type="button"
            onClick={() => setIsEditing(false)}
            variant="secondary"
            className="basis-1/2"
          >
            Annuler
          </Button>
          <Button type="submit" className="basis-1/2">
            Enregistrer
          </Button>
        </div>
      )}
    </div>
  );
}
