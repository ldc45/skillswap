"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Availability, Skill } from "@/@types/api";
import { apiService } from "@/lib/services/apiService";
import { useAuthStore, UserWithRelations } from "@/lib/stores/authStore";
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
      const userResponse: UserWithRelations = await apiService.patch(
        `/users/${user.id}`,
        userData
      );

      if (!userResponse) {
        throw new Error("Erreur lors de la mise à jour des données");
      }

      const skillsResponse: Skill[] = [];
      const currentSkillIds = user.skills?.map((s) => s.id) || [];
      const skillsToAdd = skills.filter((id) => !currentSkillIds.includes(id));
      const skillsToRemove = currentSkillIds.filter((id) => !skills.includes(id));

      if (!skills.length) {
        toast.warning(
          "Nous vous conseillons de renseigner au moins une compétence",
          {
            position: "top-center",
          }
        );
      } else {
        try {
          // Remove skills that are no longer selected
          for (const id of skillsToRemove) {
            await apiService.delete(`/users/${user.id}/skills/${id}`);
          }
          // Add new skills
          if (skillsToAdd.length > 0) {
            const userSkillsResponse: UserSkillResponseDto[] =
              await apiService.post(`/users/${user.id}/skills`, {
                skillIds: skillsToAdd,
              });
            if (!userSkillsResponse) {
              throw new Error("Erreur lors de la mise à jour des compétences");
            }
          }
          // Fetch all selected skills for the updated user
          for (const id of skills) {
            const response: Skill = await apiService.get(`/skills/${id}`);
            if (!response) {
              throw new Error(
                "Erreur lors de la récupération de la compétence"
              );
            }
            skillsResponse.push(response);
          }
          toast.success("Compétences mises à jour", {
            position: "top-center",
          });
        } catch (err) {
          console.error(err);
          toast.error("Erreur lors de la mise à jour des compétences", {
            position: "top-center",
          });
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
            .sort((x, y) => x.day - y.day || x.startTime.localeCompare(y.startTime));
        const normalizeB = (arr: { day: number; startTime: Date; endTime: Date }[]) =>
          arr
            .map((item) => ({
              day: item.day,
              startTime: item.startTime.toISOString(),
              endTime: item.endTime.toISOString(),
            }))
            .sort((x, y) => x.day - y.day || x.startTime.localeCompare(y.startTime));
        const arrA = normalizeA(a);
        const arrB = normalizeB(b);
        return arrA.every((item, idx) =>
          item.day === arrB[idx].day &&
          item.startTime === arrB[idx].startTime &&
          item.endTime === arrB[idx].endTime
        );
      }

      let availabilitiesResponse: Availability[] | null = null;

      if (!availabilities.length) {
        availabilitiesResponse = user.availabilities;
        toast.warning(
          "Nous vous conseillons de renseigner vos disponibilités",
          {
            position: "top-center",
          }
        );
      } else if (areAvailabilitiesEqual(user.availabilities ?? undefined, availabilities)) {
        // No change, skip API calls
        availabilitiesResponse = user.availabilities;
        toast.info("Aucune modification des disponibilités", {
          position: "top-center",
        });
      } else {
        try {
          // Delete all previous availabilities before adding new ones
          if (user.availabilities && user.availabilities.length > 0) {
            for (const old of user.availabilities) {
              await apiService.delete(`/availabilities/${old.id}`);
            }
          }
          // Map availabilities to ensure startTime and endTime are ISO strings and send as array
          const data = availabilities.map((availability) => ({
            ...availability,
            startTime: availability.startTime.toISOString(),
            endTime: availability.endTime.toISOString(),
            userId: user.id,
          }));
          availabilitiesResponse = await apiService.post("/availabilities", data);
          toast.success("Disponibilités mises à jour", {
            position: "top-center",
          });
        } catch (err) {
          console.error(err);
          toast.error("Erreur lors de la mise à jour des disponibilités", {
            position: "top-center",
          });
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
