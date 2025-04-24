"use client";

import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/services/apiService";
import type { User } from "@/@types/api/models/User";

// Define conversation card props interface
interface ConversationCardProps {
    id: string;
    partnerId: string;
    lastMessage: {
        id: string;
        content: string;
        createdAt: string;
    };
}

export default function ConversationCard({
  id,
  partnerId,
  lastMessage,
}: ConversationCardProps) {
    const [partner, setPartner] = useState<User | null>();
  
    useEffect(() => {
      // Fetch conversations for authenticated user using apiService
        apiService.get(`/users/${partnerId}`)
          .then((newPartner) => {
            // Set partner from API with type check
            setPartner(newPartner as User);
          })
          .catch((err) => {
            // Log fetch error
            console.error("Error fetching partner:", err);
          });
    }, [partnerId]);
  // Truncate long message text for preview
  const truncateMessage = (text: string, maxLength: number = 40) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <Link href={`/dashboard/messages/${id}`}>
      <Card className="flex flex-row items-center justify-between p-4 shadow-md hover:shadow-lg transition-shadow relative">
        {partner &&
        <>
        <div className="flex items-center gap-4 flex-1">
          <Avatar>
            <AvatarImage
              src={partner.avatarUrl}
              alt={`${partner.firstName} ${partner.lastName}`}
            />
          </Avatar>

          <div className="flex flex-col">
            <p className="font-semibold md:text-lg">
              {partner.firstName}{" "}
              {partner.lastName.charAt(0)}.
            </p>
            {lastMessage && <>
            <p className="text-sm text-gray-600 line-clamp-1">
              {truncateMessage(lastMessage.content)}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(
                lastMessage.createdAt
              ).toLocaleDateString()}
            </p>
            </>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">

<div className="flex gap-2 absolute top-3 right-10">

          {partner.skills && partner.skills.length > 0 && partner.skills.map((skill) => {
            return (
              <Badge key={skill.skill.id}>
                {skill.skill.diminutive || skill.skill.name || ""}
              </Badge>
            );
          })}
</div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        </>
        }
      </Card>
    </Link>
  );
}
