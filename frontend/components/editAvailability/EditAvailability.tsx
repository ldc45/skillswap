"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { getFormattedDate } from "@/utils/format";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import { Day } from "@/constants";

type Availability = {
  id: string;
  day: number;
  startTime: Date;
  endTime: Date;
};

interface EditAvailabilityProps {
  selectedDay: Day;
  availabilities: Availability[];
  setAvailabilities: React.Dispatch<React.SetStateAction<Availability[]>>;
}

export default function EditAvailability({
  selectedDay,
  availabilities,
  setAvailabilities,
}: EditAvailabilityProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // This function add a new availability to the user's availabilities
  const handleAddAvailability = () => {
    if (!startDate || !endDate) return;

    const newAvailability: Availability = {
      id: uuidv4(),
      day: selectedDay.id,
      startTime: startDate,
      endTime: endDate,
    };
    setAvailabilities((prev) => [...prev, newAvailability]);

    setStartDate(undefined);
    setEndDate(undefined);
  };

  // This function removes an availability from the user's availabilities
  const handleDeleteAvailability = (id: string) => {
    setAvailabilities((prev) =>
      prev.filter((availability) => availability.id !== id)
    );
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogCancel asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-4 right-4"
          >
            <X />
          </Button>
        </AlertDialogCancel>
      </AlertDialogHeader>
      <AlertDialogTitle>
        Vos disponibilités du {selectedDay.label.toLowerCase()}
      </AlertDialogTitle>

      {availabilities.length > 0 ? (
        <ul className="flex py-2 divide-y divide-accent-foreground flex-col gap-y-2">
          {availabilities.map((availability) => (
            <li
              key={availability.id}
              className="flex pb-2 justify-between items-center"
            >
              <span>
                {getFormattedDate(availability.startTime)}
                {" - "}
                {getFormattedDate(availability.endTime)}
              </span>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDeleteAvailability(availability.id)}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">
          Vous n&apos;avez pas encore de disponibilités pour ce jour.
        </div>
      )}

      <AlertDialogFooter className="pt-8 flex !flex-col border-t border-accent-foreground">
        <h5 className="text-sm md:text-base lg:text-lg font-medium py-4">
          Ajouter une disponibilité
        </h5>
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <TimePicker date={startDate} setDate={setStartDate} />
            <span className="text-sm md:text-base lg:text-lg font-medium">
              à
            </span>
            <TimePicker date={endDate} setDate={setEndDate} />
          </div>

          <Button
            type="button"
            variant="outline"
            className="ml-auto"
            onClick={handleAddAvailability}
            disabled={!startDate || !endDate}
          >
            Ajouter
          </Button>
        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
