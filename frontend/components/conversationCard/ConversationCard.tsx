"use client";

import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ChevronRight } from "lucide-react";

// Define conversation card props interface
interface ConversationCardProps {
  conversation: {
    id: number;
    partner: {
      id: number;
      first_name: string;
      last_name: string;
      avatar_url: string;
    };
    lastMessage: {
      text: string;
      timestamp: string;
    };
    skill: {
      id: number;
      name: string;
    };
  };
}

export default function ConversationCard({ conversation }: ConversationCardProps) {
  // Truncate long message text for preview
  const truncateMessage = (text: string, maxLength: number = 40) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Link href={`/dashboard/messages/${conversation.id}`}>
      <Card className="flex flex-row items-center justify-between p-4 shadow-md hover:shadow-lg transition-shadow relative">
        <div className="flex items-center gap-4 flex-1">
          <Avatar>
            <AvatarImage src={conversation.partner.avatar_url} alt={`${conversation.partner.first_name} ${conversation.partner.last_name}`} />
          </Avatar>

          <div className="flex flex-col">
            <p className="font-semibold md:text-lg">
              {conversation.partner.first_name} {conversation.partner.last_name.charAt(0)}.
            </p>
            <p className="text-sm text-gray-600 line-clamp-1">
              {truncateMessage(conversation.lastMessage.text)}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge className="absolute top-3 right-10">{conversation.skill.name}</Badge>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </Card>
    </Link>
  );
}
