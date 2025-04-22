"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// Define message and conversation interfaces
interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
}

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
  messages: Message[];
}

export default function ConversationPage() {
  // Get conversation id from params
  const params = useParams();
  const { id } = params as { id: string };
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 0; // Set current user id (mock)

  useEffect(() => {
    // Load conversations from localStorage
    const stored = localStorage.getItem("conversations");
    if (stored) {
      const conversations: Conversation[] = JSON.parse(stored);
      // Add more detailed mock messages if not present
      const found = conversations.find((c) => c.id === Number(id));
      if (found && !found.messages) {
        found.messages = [
          {
            id: 1,
            senderId: found.partner.id,
            text: "Bonjour ! Je voulais savoir si tu es dispo pour une session cette semaine ?",
            timestamp: new Date(2025, 3, 20, 10, 0).toISOString(),
          },
          {
            id: 2,
            senderId: currentUserId,
            text: "Salut ! Oui, je suis dispo jeudi ou vendredi.",
            timestamp: new Date(2025, 3, 20, 10, 5).toISOString(),
          },
          {
            id: 3,
            senderId: found.partner.id,
            text: "Parfait, jeudi 18h ça te va ?",
            timestamp: new Date(2025, 3, 20, 10, 7).toISOString(),
          },
          {
            id: 4,
            senderId: currentUserId,
            text: "Oui, c'est parfait ! Merci.",
            timestamp: new Date(2025, 3, 20, 10, 8).toISOString(),
          },
        ];
        localStorage.setItem("conversations", JSON.stringify(conversations));
      }
      setConversation(found || null);
    }
  }, [id]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Handle sending a new message
  const handleSend = () => {
    if (!input.trim() || !conversation) return;
    const newMessage: Message = {
      id: conversation.messages.length + 1,
      senderId: currentUserId,
      text: input,
      timestamp: new Date().toISOString(),
    };
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastMessage: { text: input, timestamp: newMessage.timestamp },
    };
    setConversation(updatedConversation);
    // Update localStorage
    const stored = localStorage.getItem("conversations");
    if (stored) {
      const conversations: Conversation[] = JSON.parse(stored);
      const idx = conversations.findIndex((c) => c.id === updatedConversation.id);
      if (idx !== -1) {
        conversations[idx] = updatedConversation;
        localStorage.setItem("conversations", JSON.stringify(conversations));
      }
    }
    setInput("");
  };

  if (!conversation) {
    return <div className="p-4">Conversation introuvable.</div>;
  }

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="flex items-center gap-2 p-4 border-b bg-white sticky top-0 z-10">
        <Link href="/dashboard/messages">
          <ChevronLeft className="h-6 w-6 text-gray-500" />
        </Link>
        <Avatar>
          <AvatarImage src={conversation.partner.avatar_url} />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{conversation.partner.first_name} {conversation.partner.last_name.charAt(0)}.</span>
          <Badge className="w-fit mt-1">{conversation.skill.name}</Badge>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 px-2 py-4">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"} mb-2`}
          >
            <Card className={`max-w-[70%] px-4 py-2 ${msg.senderId === currentUserId ? "bg-blue-100" : "bg-white"}`}>
              <span className="text-sm">{msg.text}</span>
              <div className="text-xs text-gray-400 text-right mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex gap-2 p-4 border-t bg-white"
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1"
        />
        <Button type="submit">Envoyer</Button>
      </form>
    </div>
  );
}