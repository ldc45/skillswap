"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Pencil } from "lucide-react";

import { CreateAvailabilityDto } from "@/@types/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { getFormattedDate } from "@/utils/format";
import { DAYS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditAvailability from "@/components/editAvailability/EditAvailability";

interface UserAvailabilitiesProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    userForm: UseFormReturn<{
        firstName: string;
        lastName: string;
        skills: string[];
        biography: string;
        availabilities: Omit<CreateAvailabilityDto, "userId">[];
    }>;
}

type Availability = {
    id: string;
    day: number;
    startTime: Date;
    endTime: Date;
};

export default function UserAvailabilities({
    isEditing,
    setIsEditing,
    userForm,
}: UserAvailabilitiesProps) {
    const { user } = useAuthStore();

    const [availabilities, setAvailabilities] = useState<Availability[]>(
        user?.availabilities || []
    );

    // This boolean is used to disable the submit button depending on the form state
    const isSubmitDisabled =
        !userForm.formState.isValid || userForm.formState.isSubmitting;

    // Every time the availabilities change, we update the form values
    useEffect(() => {
        // We need to map the availabilities to the expected type by the form
        const newAvailabilities = availabilities.map((availability) => ({
            day: availability.day,
            startTime: new Date(availability.startTime),
            endTime: new Date(availability.endTime),
        }));
        userForm.setValue("availabilities", newAvailabilities);
    }, [availabilities, userForm]);

    // This function is called when the user clicks on the cancel button ("Annuler")
    const handleCancel = () => {
        setIsEditing(false);
        setAvailabilities(user?.availabilities || []);
    };

    if (!user) return null;

    return (
        <div className="basis-1/2 p-4 flex flex-col gap-y-2">
            <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
                Disponibilités
            </h4>

            <div className="divide-y">
                {DAYS.map((day) => {
                    const availabilitiesForDay = availabilities?.filter(
                        (availability) => availability.day === day.id
                    );
                    // Sort availabilities by startTime ascending
                    const sortedAvailabilities = availabilitiesForDay
                        ? [...availabilitiesForDay].sort(
                              (a, b) =>
                                  new Date(a.startTime).getTime() -
                                  new Date(b.startTime).getTime()
                          )
                        : [];
                    return (
                        <div key={day.id} className="py-4 flex gap-x-2">
                            <div className="text-sm lg:text-lg md:text-base font-semibold whitespace-nowrap">
                                {day.label} :
                            </div>
                            <div className="md:divide-x-2 flex flex-col md:flex-row divide-gray-300 md:space-x-2">
                                {sortedAvailabilities.length > 0 ? (
                                    sortedAvailabilities.map((availability) => (
                                        <span
                                            className="px-1 text-sm lg:text-lg md:text-base pe-3 last:pe-0"
                                            key={availability.id}
                                        >
                                            {getFormattedDate(
                                                availability.startTime
                                            )}{" "}
                                            -{" "}
                                            {getFormattedDate(
                                                availability.endTime
                                            )}
                                        </span>
                                    ))
                                ) : (
                                    <p className="px-1 text-sm lg:text-lg md:text-base whitespace-nowrap text-gray-400">
                                        Aucune disponibilité
                                    </p>
                                )}
                            </div>
                            {isEditing && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="ml-auto cursor-pointer"
                                        >
                                            <Pencil />
                                        </Button>
                                    </DialogTrigger>
                                    <EditAvailability
                                        selectedDay={day}
                                        availabilities={availabilitiesForDay}
                                        setAvailabilities={setAvailabilities}
                                    />
                                </Dialog>
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
                <div className="flex flex-basis gap-4 grow">
                    <Button
                        type="button"
                        onClick={handleCancel}
                        variant="secondary"
                        className="basis-1/2"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={`${
                            isSubmitDisabled ? "cursor-not-allowed" : ""
                        } basis-1/2`}
                    >
                        Enregistrer
                    </Button>
                </div>
            )}
        </div>
    );
}
