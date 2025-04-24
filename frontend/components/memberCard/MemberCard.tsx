"use client";

import { User } from "@/@types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Add isLink prop to control if MemberCard is clickable
interface MemberCardProps {
  user: User;
  isLoading: boolean;
  isLink?: boolean; // Optional prop to enable/disable link
}

export default function MemberCard({ user, isLoading, isLink = false }: MemberCardProps) {
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
              <AvatarImage src={user.avatarUrl} />
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold md:text-lg">
                {user.firstName} {user.lastName.charAt(0)}.
              </p>
              <p className="lg:text-base text-sm">Design</p>
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
