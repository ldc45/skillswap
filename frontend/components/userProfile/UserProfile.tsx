"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { useAuthStore } from "@/lib/stores/authStore";
import { apiService } from "@/lib/services/apiService";
import { Skill, UpdateUserDto } from "@/@types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";

type Options = {
  value: string;
  label: string;
};

interface UserProfileProps {
  isEditing: boolean;
  userDefaultValues: UpdateUserDto;
  userForm: UseFormReturn<{
    firstName: string;
    lastName: string;
    skills: string[];
    biography: string;
  }>;
}

export default function UserProfile({
  userForm,
  userDefaultValues,
  isEditing,
}: UserProfileProps) {
  const { user } = useAuthStore();

  const [skillOptions, setSkillOptions] = useState<Options[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // This is the format expected by the MultiSelect component
  // This variable is used as the default value for the MultiSelect component
  const userSkillOptions = user?.skills?.map((skill) => skill.name) || [];

  // Fetch all skills from the API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response: Skill[] = await apiService.get("/skills");

        if (!response) {
          throw new Error("Error fetching skills from API");
        }

        // We need to map the skills to the format expected by the MultiSelect component
        const options = response.slice(0, 10).map((skill) => ({
          value: skill.id,
          label: skill.name,
        }));

        setSkillOptions(options);
      } catch (error) {
        console.error(error);
        setError(
          "Une erreur est survenue lors de la récupération des compétences."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // This function is called everytime the options of the MultiSelect component change
  // It updates the value of the skills field in the form
  const handleOptionsChange = (value: string[]) => {
    userForm.setValue("skills", value);
  };

  if (!user) return null;

  if (isLoading) {
    return <p>Chargement...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="basis-1/2 p-4 flex flex-col gap-y-4 items-center">
      <div className="flex flex-col gap-y-2 items-center">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={user.avatarUrl || "https://github.com/shadcn.png"}
          />
        </Avatar>
        {!isEditing ? (
          <h3 className="text-xl font-medium md:text-2xl lg:text-3xl">
            {user.firstName} {user.lastName?.charAt(0)}.
          </h3>
        ) : (
          <div className="flex flex-col gap-y-2">
            <FormField
              control={userForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={userForm.getValues("firstName")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={userForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder={user.lastName} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="flex flex-row md:gap-x-2 lg:gap-x-3 gap-x-1 wrap">
        {!isEditing ? (
          user.skills.length > 0 ? (
            user.skills.map((skill) => (
              <Badge
                variant="badge"
                key={skill.id}
                className="md:text-sm lg:text-base"
              >
                {skill.name}
              </Badge>
            ))
          ) : (
            <p>Vous n&apos;avez pas encore de compétences.</p>
          )
        ) : (
          <MultiSelect
            options={skillOptions}
            onValueChange={(e) => handleOptionsChange(e)}
            defaultValue={userSkillOptions}
            placeholder="Sélectionnez vos compétences"
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-y-1">
        <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
          Biographie
        </h4>
        {!isEditing ? (
          <p className="text-sm md:text-base">{userDefaultValues.biography}</p>
        ) : (
          <FormField
            control={userForm.control}
            name="biography"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={userDefaultValues.biography}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
