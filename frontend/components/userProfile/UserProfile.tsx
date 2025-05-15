"use client";

import { UseFormReturn } from "react-hook-form";

import { CreateAvailabilityDto } from "@/@types/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { useSkillStore } from "@/lib/stores/skillStore";
import UserSkills from "@/components/userSkills/UserSkills";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
    userForm: UseFormReturn<{
        firstName: string;
        lastName: string;
        skills: string[];
        biography: string;
        availabilities: Omit<CreateAvailabilityDto, "userId">[];
    }>;
}

export default function UserProfile({ userForm, isEditing }: UserProfileProps) {
    const { user } = useAuthStore();
    const { skills, fetchSkills } = useSkillStore();

    // We need to fetch the skills in case they have not been fetched yet
    if (skills.length === 0) {
        fetchSkills();
    }

    if (!user) return null;

    // The default options are the skills of the user
    // The prop `defaultOptions` expects an array of 'values' (ids) that are selected by default
    const defaultOptions = user.skills?.map((skill) => skill.id) || [];

    const skillOptions: Options[] = skills.map((skill) => ({
        value: skill.id,
        label: skill.name,
    }));

    // This function is called every time the options change
    // It updates the form values with the selected options
    const handleOptionsChange = (values: string[]) => {
        userForm.setValue("skills", values);
    };

    return (
        <div className="basis-1/2 p-4 flex flex-col gap-y-4 items-center">
            <div className="flex flex-col gap-y-2 items-center">
                <Avatar className="w-20 h-20">
                    <AvatarImage
                        src={user.avatarUrl || "https://github.com/shadcn.png"}
                        alt={`Avatar ${user.firstName} ${user.lastName}`}
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
                                            placeholder={userForm.getValues(
                                                "firstName"
                                            )}
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
                                        <Input
                                            placeholder={user.lastName}
                                            {...field}
                                        />
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
                    <UserSkills skills={user.skills || []} />
                ) : (
                    <MultiSelect
                        options={skillOptions}
                        onValueChange={(e) => handleOptionsChange(e)}
                        defaultValue={defaultOptions}
                        placeholder="Sélectionnez vos compétences"
                        variant="inverted"
                    />
                )}
            </div>

            <div className="flex w-full flex-col gap-y-1 pt-4">
                <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
                    Biographie
                </h4>
                {!isEditing ? (
                    <p className="text-sm md:text-base">
                        {user.biography ||
                            "Vous n'avez pas encore de biographie"}
                    </p>
                ) : (
                    <FormField
                        control={userForm.control}
                        name="biography"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder={user.biography}
                                        className="text-sm md:text-base"
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
