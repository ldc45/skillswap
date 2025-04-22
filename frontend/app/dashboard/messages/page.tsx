"use client";

import React, { useEffect, useState } from "react";
import ConversationCard from "@/components/conversationCard/ConversationCard";

// Define conversation interface
interface Conversation {
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
}

export default function MessagesPage() {
  // Initialize conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  useEffect(() => {
    // Load conversations from localStorage or use mock data
    const storedConversations = localStorage.getItem('conversations');
    
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    } else {
      // Mock data for initial display
      const mockConversations: Conversation[] = [
        {
          id: 1,
          partner: {
            id: 1,
            first_name: "Marie",
            last_name: "Dupont",
            avatar_url: "https://github.com/shadcn.png",
          },
          lastMessage: {
            text: "Bonjour, je suis intéressée par vos compétences en développement web.",
            timestamp: new Date(2025, 3, 20).toISOString(),
          },
          skill: {
            id: 1,
            name: "Dev. web",
          },
        },
        {
          id: 2,
          partner: {
            id: 2,
            first_name: "Jean",
            last_name: "Martin",
            avatar_url: "https://github.com/shadcn.png",
          },
          lastMessage: {
            text: "Merci pour votre aide avec le design de mon site, j'aimerais planifier une autre session.",
            timestamp: new Date(2025, 3, 21).toISOString(),
          },
          skill: {
            id: 2,
            name: "Design",
          },
        },
        {
          id: 3,
          partner: {
            id: 3,
            first_name: "Sophie",
            last_name: "Lemoine",
            avatar_url: "https://github.com/shadcn.png",
          },
          lastMessage: {
            text: "Est-ce que vous êtes disponible pour une session d'anglais demain?",
            timestamp: new Date(2025, 3, 18).toISOString(),
          },
          skill: {
            id: 3,
            name: "Langues",
          },
        },
        {
          id: 4,
          partner: {
            id: 4,
            first_name: "Thomas",
            last_name: "Bernard",
            avatar_url: "https://github.com/shadcn.png",
          },
          lastMessage: {
            text: "J'ai revu votre stratégie marketing, je vous envoie mes commentaires.",
            timestamp: new Date(2025, 3, 22).toISOString(),
          },
          skill: {
            id: 4,
            name: "Marketing",
          },
        },
      ];
      
      // Store mock data in localStorage
      localStorage.setItem('conversations', JSON.stringify(mockConversations));
      setConversations(mockConversations);
    }
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mes conversations</h1>
      
      {conversations.length === 0 ? (
        <p className="text-gray-600">Vous n&apos;avez pas encore de conversations.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {conversations
            .sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime())
            .map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
        </div>
      )}
    </div>
  );
}