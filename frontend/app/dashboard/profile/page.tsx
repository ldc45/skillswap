"use client";

import { Form } from "@/components/ui/form";
import UserAvailabilities from "@/components/userAvailabilities/UserAvailabilities";
import UserProfile from "@/components/userProfile/UserProfile";
import { apiService } from "@/lib/services/apiService";
import { useAuthStore, User } from "@/lib/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ProfilePage() {
  const { user, login } = useAuthStore();

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    // The zodResolver is inteatgrated to the form
    resolver: zodResolver(formSchema),
    // TODO: Default values should be fetched from the store
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  // Data is typed using the schema
  // This ensures that the data passed to the onSubmit function matches the schema
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("DATA", data);
    if (!user) return;

    try {
      const response: User = await apiService.patch(`/users/${user.id}`, data);

      if (!response) {
        throw new Error("Erreur lors de la mise à jour des données");
      }

      // This updates the user data in the store
      login({
        user: response,
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
          <UserProfile userForm={form} isEditing={isEditing} />
          <UserAvailabilities
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </form>
    </Form>
  );
}
