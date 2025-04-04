"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { UpdateUserDto } from "@/@types/api";

interface UserProfileProps {
  isEditing: boolean;
  userDefaultValues: UpdateUserDto;
  userForm: UseFormReturn<{
    firstName: string;
    lastName: string;
    biography: string;
  }>;
}

export default function UserProfile({
  userForm,
  userDefaultValues,
  isEditing,
}: UserProfileProps) {
  const { user } = useAuthStore();

  const fakeSkills = [
    {
      id: 1,
      label: "Développement web",
      diminutive: "Dev. web",
    },
    {
      id: 2,
      label: "Design",
      diminutive: "Design",
    },
    {
      id: 3,
      label: "Langues",
      diminutive: "Langues",
    },
    {
      id: 4,
      label: "Marketing",
      diminutive: "Marketing",
    },
  ];

  if (!user) return null;

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
        {fakeSkills.map((skill) => (
          <Badge
            variant="badge"
            key={skill.id}
            className="md:text-sm lg:text-base"
          >
            {skill.label.length > 8 ? skill.diminutive : skill.label}
          </Badge>
        ))}
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
