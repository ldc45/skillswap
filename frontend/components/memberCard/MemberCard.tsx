"use client";

import { User } from "@/@types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MemberCardProps {
  user: User;
  isLoading: boolean;
}

export default function MemberCard({ user, isLoading }: MemberCardProps) {
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

  return (
    <Card className="flex items-center max-w-[560px] flex-row p-4 shadow-md">
      <Avatar>
        <AvatarImage src={user.avatarUrl} />
      </Avatar>

      <div className="flex flex-col">
        <p className="font-semibold md:text-lg">
          {user.firstName} {user.lastName.charAt(0)}.
        </p>
        <p className="lg:text-base text-sm">Design</p>
      </div>
    </Card>
  );
}
