"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { User } from "@/@types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Add isLink prop to control if MemberCard is clickable
interface MemberCardProps {
    user: User;
    isLoading: boolean;
    isLink?: boolean; // Optional prop to enable/disable link
}

export default function MemberCard({
    user,
    isLoading,
    isLink = false,
}: MemberCardProps) {
    if (isLoading) {
        return (
            <Card className="flex max-w-[560px] items-center flex-row p-4 shadow-md">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </Card>
        );
    }

    // Render clickable card with chevron if isLink is true
    if (isLink) {
        return (
            <Link href={`/dashboard/partners/${user.id}`}>
                <Card className="flex items-center max-w-[560px] flex-row p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage
                                src={user.avatarUrl}
                                alt={`Avatar ${user.firstName} ${user.lastName}`}
                            />
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-semibold md:text-lg">
                                {user.firstName} {user.lastName.charAt(0)}.
                            </p>
                            {user && user.skills && user.skills.length > 0 && (
                                <p
                                    className="lg:text-base text-sm text-gray-600 dark:text-gray-300 truncate overflow-hidden whitespace-nowrap max-w-[200px] lg:max-w-[300px]"
                                    title={user.skills
                                        .map((skill) => skill.name)
                                        .join(", ")}
                                >
                                    {user.skills
                                        .map((skill) => skill.name)
                                        .join(", ")}
                                </p>
                            )}
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Card>
            </Link>
        );
    }

    // Render non-clickable card without chevron if isLink is false
    return (
        <Card className="flex items-center max-w-[560px] flex-row p-4 shadow-md">
            <Avatar>
                <AvatarImage
                    src={user.avatarUrl}
                    alt={`Avatar ${user.firstName} ${user.lastName}`}
                />
            </Avatar>
            <div className="flex flex-col">
                <p className="font-semibold md:text-lg">
                    {user.firstName} {user.lastName.charAt(0)}.

                </p>
                {user && user.skills && user.skills.length > 0 && (
                    <p
                        className="lg:text-base text-sm text-gray-600 dark:text-gray-300 truncate overflow-hidden whitespace-nowrap max-w-[200px] lg:max-w-[300px]"
                        title={user.skills
                            .map((skill) => skill.name)
                            .join(", ")}
                    >
                        {user.skills.map((skill) => skill.name).join(", ")}
                    </p>
                )}
            </div>
        </Card>
    );
}
