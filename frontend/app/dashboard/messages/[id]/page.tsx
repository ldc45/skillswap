"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWindowSize } from "@uidotdev/usehooks";

import { ApiConversation, ApiMessage } from "@/@types/api/conversation";
import { apiService } from "@/lib/services/apiService"; // Import apiService for fetching conversation
import { useAuthStore } from "@/lib/stores/authStore"; // Get current user id from auth store
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define message and conversation interfaces
interface Message {
    id: number;
    senderId: string;
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

// Map API conversation to UI conversation shape
function mapApiConversation(apiConv: ApiConversation): Conversation {
    return {
        id: apiConv.id,
        partner: {
            id: apiConv.partner.id,
            first_name: apiConv.partner.firstName,
            last_name: apiConv.partner.lastName,
            avatar_url: apiConv.partner.avatarUrl,
        },
        lastMessage: {
            text:
                apiConv.messages.length > 0
                    ? apiConv.messages[apiConv.messages.length - 1].content
                    : "",
            timestamp:
                apiConv.messages.length > 0
                    ? apiConv.messages[apiConv.messages.length - 1].createdAt
                    : "",
        },
        skill: {
            id: 1, // Use static skill for now
            name: "Dev. web",
        },
        messages: apiConv.messages.map((msg: ApiMessage) => ({
            id: msg.id,
            senderId: String(msg.senderId),
            text: msg.content,
            timestamp: msg.createdAt,
        })),
    };
}

// Add runtime type guard for ApiConversation
function isApiConversation(obj: unknown): obj is ApiConversation {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "id" in obj &&
        "partner" in obj &&
        "messages" in obj
    );
}

export default function ConversationPage() {
    // Get conversation id from params
    const params = useParams();
    const { id } = params as { id: string };
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore(); // Get current user from auth store
    // Parse currentUserId as string for comparison
    const currentUserId = user?.id?.toString() ?? "0";

  // This hook is used to get the window size (width and height) dynamically
  const size = useWindowSize();

    useEffect(() => {
        // Fetch conversation by id from API
        apiService
            .get(`/conversations/${id}`)
            .then((apiConv) => {
                // Check if apiConv is ApiConversation before mapping
                setConversation(
                    isApiConversation(apiConv)
                        ? mapApiConversation(apiConv)
                        : null
                );
            })
            .catch((err) => {
                // Log fetch error
                console.error("Error fetching conversation:", err);
            });
    }, [id]);


    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    // Handle sending a new message
    const handleSend = async () => {
        if (!input.trim() || !conversation) return;
        // Post new message to API
        try {
            await apiService.patch(`/conversations/${id}`, {
                messages: [{ content: input, senderId: currentUserId }],
            });
            // Reload conversation from API after post
            const apiConv = await apiService.get(`/conversations/${id}`);
            setConversation(
                isApiConversation(apiConv) ? mapApiConversation(apiConv) : null
            );
            setInput("");
        } catch (err) {
            // Log post error
            console.error("Error sending message:", err);
        }
    };

    if (!conversation) {
        return <div className="p-4">Conversation introuvable.</div>;
    }

    // Sort messages from oldest to newest before rendering
    const sortedMessages = [...conversation.messages].sort(
        (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return (
        <div className="flex flex-col h-[100dvh] max-w-screen">
            <div className="flex items-center gap-x-2 md:gap-x-4 p-4 border-b bg-white sticky top-0 z-10">
                <Link href="/dashboard/messages">
                    <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-gray-500" />
                </Link>
                <Avatar className="md:size-10 lg:size-12">
                    <AvatarImage
                        src={conversation.partner.avatar_url}
                        alt="Avatar"
                    />
                </Avatar>
                <p className="font-semibold md:text-lg lg:text-xl">
                    {size.width && size.width > 640
                        ? conversation.partner.last_name
                        : conversation.partner.last_name.charAt(0) + "."}
                </p>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 px-2 py-4">
                {sortedMessages.map((msg) => (
                    <div
                        key={msg.id}
                        // Align message right if sent by current user, left otherwise
                        className={`flex ${
                            msg.senderId === currentUserId
                                ? "justify-end"
                                : "justify-start"
                        } mb-2`}
                    >
                        <Card
                            className={`max-w-[70%] px-4 py-2 ${
                                msg.senderId === currentUserId
                                    ? "bg-blue-100"
                                    : "bg-white"
                            }`}
                        >
                            <span className="text-sm">{msg.text}</span>
                            <div className="text-xs text-gray-400 text-right mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </div>
                        </Card>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form
                className="flex gap-2 p-4 border-t bg-white"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
            >
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1"
                />
                <Button type="submit">
                    {size.width && size.width > 640 ? (
                        "Envoyer"
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </form>
        </div>
    );
}
