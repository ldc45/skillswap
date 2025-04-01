"use client";

import { Button } from "../ui/button";

export default function UserAvailabilities() {
  const days = [
    {
      id: 0,
      label: "Lundi",
      diminutive: "Lun.",
    },
    {
      id: 1,
      label: "Mardi",
      diminutive: "Mar.",
    },
    {
      id: 2,
      label: "Mercredi",
      diminutive: "Mer.",
    },
    {
      id: 3,
      label: "Jeudi",
      diminutive: "Jeu.",
    },
    {
      id: 4,
      label: "Vendredi",
      diminutive: "Ven.",
    },
    {
      id: 5,
      label: "Samedi",
      diminutive: "Sam.",
    },
    {
      id: 6,
      label: "Dimanche",
      diminutive: "Dim.",
    },
  ];

  const availabilities = [
    { id: 1, day: 2, start_time: "14:00:00", end_time: "19:00:00" },
    { id: 2, day: 0, start_time: "10:00:00", end_time: "12:00:00" },
    { id: 3, day: 0, start_time: "12:00:00", end_time: "16:00:00" },
    { id: 6, day: 4, start_time: "15:00:00", end_time: "19:00:00" },
    { id: 13, day: 6, start_time: "14:00:00", end_time: "19:00:00" },
    { id: 18, day: 4, start_time: "12:00:00", end_time: "16:00:00" },
  ];

  return (
    <div className="basis-1/2 p-4 flex flex-col gap-y-2">
      <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
        Disponibilités
      </h4>
      <div className="divide-y">
        {days.map((day) => (
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
                    {availability.start_time} - {availability.end_time}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Button className="w-fit lg:self-end self-center md:text-lg">
        Contacter
      </Button>
    </div>
  );
}
