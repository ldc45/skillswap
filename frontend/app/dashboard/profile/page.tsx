"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Availability, Skill, User } from "@/@types/api";
import { apiService } from "@/lib/services/apiService";
import { useAuthStore } from "@/lib/stores/authStore";
import { Form } from "@/components/ui/form";
import UserAvailabilities from "@/components/userAvailabilities/UserAvailabilities";
import UserProfile from "@/components/userProfile/UserProfile";

// TODO: Replace with the generated type from the API
type UserSkillResponseDto = {
    userId: string;
    skillId: string;
};

export default function ProfilePage() {
    const { user, login } = useAuthStore();

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const defaultValues = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        // We extract the ids to set the default values for the skills and match the expected type by the schema
        skills: user?.skills?.map((skill) => skill.id) || [],
        biography: user?.biography || "",
        // We extract the ids to set the default values for the availabilities and match the expected type by the schema
        availabilities:
            user?.availabilities?.map((availability) => {
                return {
                    day: availability.day,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                };
            }) || [],
    };

    // The schema ensures that the form data respects the expected types and constraints
    const formSchema = z.object({
        firstName: z
            .string()
            .min(2, { message: "Merci de renseigner un prénom valide" })
            .max(64),
        lastName: z
            .string()
            .min(2, { message: "Merci de renseigner un nom valide" })
            .max(64),
        skills: z.array(z.string().uuid()),
        biography: z.string().min(10, {
            message: "Merci de renseigner une biographie plus complète",
        }),
        availabilities: z.array(
            z.object({
                day: z.number().min(0).max(6),
                startTime: z.date(),
                endTime: z.date(),
            })
        ),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        // The zodResolver is inteatgrated to the form
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    // Data is typed using the schema
    // This ensures that the data passed to the onSubmit function matches the schema
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!user) return;

        const { skills, availabilities, ...userData } = data;

        try {
            const userResponse: User = await apiService.patch(
                `/users/${user.id}`,
                userData
            );

            if (!userResponse) {
                throw new Error("Erreur lors de la mise à jour des données");
            }

            const skillsResponse: Skill[] = [];
            const currentSkillIds = user.skills?.map((s) => s.id) || [];
            const skillsToAdd = skills.filter(
                (id) => !currentSkillIds.includes(id)
            );
            const skillsToRemove = currentSkillIds.filter(
                (id) => !skills.includes(id)
            );

            if (!skills.length) {
                toast.warning(
                    "Nous vous conseillons de renseigner au moins une compétence",
                    {
                        position: "bottom-right",
                    }
                );
            } else {
                try {
                    let skillsChanged = false;
                    // Remove skills that are no longer selected
                    if (skillsToRemove.length > 0) {
                        for (const id of skillsToRemove) {
                            await apiService.delete(
                                `/users/${user.id}/skills/${id}`
                            );
                        }
                        skillsChanged = true;
                    }
                    // Add new skills
                    if (skillsToAdd.length > 0) {
                        const userSkillsResponse: UserSkillResponseDto[] =
                            await apiService.post(`/users/${user.id}/skills`, {
                                skillIds: skillsToAdd,
                            });
                        if (!userSkillsResponse) {
                            throw new Error(
                                "Erreur lors de la mise à jour des compétences"
                            );
                        }
                        skillsChanged = true;
                    }
                    // Fetch all selected skills for the updated user
                    for (const id of skills) {
                        const response: Skill = await apiService.get(
                            `/skills/${id}`
                        );
                        if (!response) {
                            throw new Error(
                                "Erreur lors de la récupération de la compétence"
                            );
                        }
                        skillsResponse.push(response);
                    }
                    if (skillsChanged) {
                        toast.success("Compétences mises à jour", {
                            position: "bottom-right",
                        });
                    }
                } catch (err) {
                    console.error(err);
                    toast.error(
                        "Erreur lors de la mise à jour des compétences",
                        {
                            position: "bottom-right",
                        }
                    );
                }
            }

            // Compare two arrays of availabilities (ignoring order)
            function areAvailabilitiesEqual(
                a: Availability[] | undefined,
                b: { day: number; startTime: Date; endTime: Date }[]
            ): boolean {
                if (!a) return false;
                if (a.length !== b.length) return false;
                const normalizeA = (arr: Availability[]) =>
                    arr
                        .map((item) => ({
                            day: item.day,
                            startTime: new Date(item.startTime).toISOString(),
                            endTime: new Date(item.endTime).toISOString(),
                        }))
                        .sort(
                            (x, y) =>
                                x.day - y.day ||
                                x.startTime.localeCompare(y.startTime)
                        );
                const normalizeB = (
                    arr: { day: number; startTime: Date; endTime: Date }[]
                ) =>
                    arr
                        .map((item) => ({
                            day: item.day,
                            startTime: item.startTime.toISOString(),
                            endTime: item.endTime.toISOString(),
                        }))
                        .sort(
                            (x, y) =>
                                x.day - y.day ||
                                x.startTime.localeCompare(y.startTime)
                        );
                const arrA = normalizeA(a);
                const arrB = normalizeB(b);
                return arrA.every(
                    (item, idx) =>
                        item.day === arrB[idx].day &&
                        item.startTime === arrB[idx].startTime &&
                        item.endTime === arrB[idx].endTime
                );
            }

            let availabilitiesResponse: Availability[] | undefined = undefined;

            if (!availabilities.length) {
                availabilitiesResponse = user.availabilities ?? undefined;
                toast.warning(
                    "Nous vous conseillons de renseigner vos disponibilités",
                    {
                        position: "bottom-right",
                    }
                );
            } else if (
                areAvailabilitiesEqual(
                    user.availabilities ?? undefined,
                    availabilities
                )
            ) {
                // Only show toast if availabilities field was touched
                if (form.formState.dirtyFields.availabilities) {
                    availabilitiesResponse = user.availabilities ?? undefined;
                    toast.info("Aucune modification des disponibilités", {
                        position: "bottom-right",
                    });
                } else {
                    availabilitiesResponse = user.availabilities ?? undefined;
                }
            } else {
                try {
                    // Delete all previous availabilities before adding new ones
                    if (user.availabilities && user.availabilities.length > 0) {
                        for (const old of user.availabilities) {
                            await apiService.delete(
                                `/availabilities/${old.id}`
                            );
                        }
                    }
                    // Map availabilities to ensure startTime and endTime are ISO strings and send as array
                    const data = availabilities.map((availability) => ({
                        ...availability,
                        startTime: availability.startTime.toISOString(),
                        endTime: availability.endTime.toISOString(),
                        userId: user.id,
                    }));
                    availabilitiesResponse = await apiService.post(
                        "/availabilities",
                        data
                    );
                    toast.success("Disponibilités mises à jour", {
                        position: "bottom-right",
                    });
                } catch (err) {
                    console.error(err);
                    toast.error(
                        "Erreur lors de la mise à jour des disponibilités",
                        {
                            position: "bottom-right",
                        }
                    );
                }
            }

            // This updates the user data in the store
            login({
                user: {
                    ...userResponse,
                    skills: skillsResponse,
                    availabilities: availabilitiesResponse,
                },
            });
        } catch (error) {
            console.error("Erreur lors de la modification des données", error);
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col lg:flex-row gap-8 p-4 lg:p-8">
                    <div className="flex flex-col flex-1 gap-4">
                        <UserProfile isEditing={isEditing} userForm={form} />
                    </div>
                    <div className="flex flex-col flex-1 gap-4">
                        <UserAvailabilities
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            userForm={form}
                        />
                    </div>
                </div>
            </form>
        </Form>
    );
}
