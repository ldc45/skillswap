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

      let skillsResponse: Skill[] | null = null;
      if (!skills.length) {
        toast.warning(
          "Nous vous conseillons de renseigner au moins une compétence",
          {
            position: "top-center",
          }
        );
      } else {
        try {
          skillsResponse = await apiService.post(`/users/${user.id}/skills`, {
            skillIds: skills,
          });
        } catch (err) {
          console.error(err);
          toast.error("Erreur lors de la mise à jour des compétences", {
            position: "top-center",
          });
        }
      }

      let availabilitiesResponse: Availability[] | null = null;
      if (!availabilities.length) {
        toast.warning(
          "Nous vous conseillons de renseigner vos disponibilités",
          {
            position: "top-center",
          }
        );
      } else {
        try {
          availabilitiesResponse = await apiService.post("/availabilities", {
            availabilities: availabilities.map((availability) => ({
              ...availability,
              userId: user.id,
            })),
          });
        } catch (err) {
          console.error(err);
          toast.error("Erreur lors de la mise à jour des disponibilités", {
            position: "top-center",
          });
        }
      }

      // TODO: Fetch the skills again to update the store
      console.log("Skills response", skillsResponse);
      // TOODO: Fetch the availabilities again to update the store
      console.log("Availabilities response", availabilitiesResponse);

      // This updates the user data in the store
      login({
        user: userResponse,
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
        <div className="flex flex-col md:p-4 lg:p-8 lg:flex-row">
          <UserProfile isEditing={isEditing} userForm={form} />
          <UserAvailabilities
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            userForm={form}
          />
        </div>
      </form>
    </Form>
  );
}
