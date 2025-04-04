"use client";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";

interface MemberCardProps {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export default function MemberCard({ user }: MemberCardProps) {
  return (
    <Card className="flex items-center flex-row p-4 shadow-md">
      <Avatar>
        <AvatarImage src={user.avatar_url} />
      </Avatar>

      <div className="flex flex-col">
        <p className="font-semibold md:text-lg">
          {user.first_name} {user.last_name.charAt(0)}.
        </p>
        <p className="lg:text-base text-sm">Design</p>
      </div>
    </Card>
  );
}
