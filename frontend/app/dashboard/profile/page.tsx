"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { apiService } from "@/lib/services/apiService";
import { useAuthStore, UserWithRelations } from "@/lib/stores/authStore";
import { Form } from "@/components/ui/form";
import UserAvailabilities from "@/components/userAvailabilities/UserAvailabilities";
import UserProfile from "@/components/userProfile/UserProfile";

export default function ProfilePage() {
  const { user, login } = useAuthStore();

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const defaultValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    skills: user?.skills.map((skill) => skill.id) || [],
    biography:
      user?.biography || "Aucune biographie renseignée pour le moment.",
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
    // We store the IDs of the skills in the form
    skills: z.array(z.string()),
    biography: z
      .string()
      .min(10, {
        message: "Merci de renseigner une biographie plus complète",
      })
      .max(150, {
        message: "La biographie ne doit pas dépasser 150 caractères",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    // The zodResolver is inteatgrated to the form
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Data is typed using the schema
  // This ensures that the data passed to the onSubmit function matches the schema
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { skills, ...userData } = data;

    if (!user) return;

    try {
      const userResponse: UserWithRelations = await apiService.patch(
        `/users/${user.id}`,
        userData
      );

      if (!userResponse) {
        throw new Error("Erreur lors de la mise à jour des données");
      }

      // TODO: Update the UserSkills relation
      console.log("Skills to update:", skills);

      // This updates the user data in the store
      login({
        user: userResponse,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col md:p-4 lg:p-8 lg:flex-row">
          <UserProfile
            userForm={form}
            userDefaultValues={defaultValues}
            isEditing={isEditing}
          />
          <UserAvailabilities
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </form>
    </Form>
  );
}
