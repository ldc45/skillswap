import { User } from "@/@types/api";
import { getFormattedDate } from "@/utils/format";
import { DAYS } from "@/constants";

export default function PartnerAvailabilities({ partner }: { partner: User }) {
  return (
    <div className="basis-1/2 p-4 flex flex-col gap-y-2">
      <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
        Disponibilités
      </h4>

      <div className="divide-y">
        {DAYS.map((day) => {
          const dayAvailabilities = partner.availabilities?.filter((availability) => availability.day === day.id) || [];
          return (
            <div key={day.id} className="py-4 flex gap-x-2">
              <div className="text-sm lg:text-lg md:text-base font-semibold whitespace-nowrap">
                {day.label} :
              </div>
              <div className="md:divide-x-2 flex flex-col md:flex-row divide-black">
                {dayAvailabilities.length > 0 ? (
                  dayAvailabilities.map((availability) => (
                    <span
                      className="px-1 text-sm lg:text-lg md:text-base"
                      key={availability.id}
                    >
                      {getFormattedDate(availability.startTime)} - {getFormattedDate(availability.endTime)}
                    </span>
                  ))
                ) : (
                  <span className="px-1 text-sm text-gray-400">Aucune disponibilité</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
