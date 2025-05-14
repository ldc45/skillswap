"use client";

import React, { useEffect, useState } from "react";
import ConversationCard from "@/components/conversationCard/ConversationCard";
import { useAuthStore } from "@/lib/stores/authStore";
import { apiService } from "@/lib/services/apiService";
import { useWindowSize } from "@uidotdev/usehooks";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

// Define conversation interface
interface Conversation {
    id: string;
    partnerId: string;
    creatorId: string;
    lastMessage?: {
        id: string;
        content: string;
        createdAt: string;
    };
}

export default function MessagesPage() {
    // Initialize conversations state
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const { user, isAuthenticated } = useAuthStore();

    // This hook is used to get the window size (width and height) dynamically
    const size = useWindowSize();

    useEffect(() => {
        // Fetch conversations for authenticated user using apiService
        if (isAuthenticated && user) {
            apiService
                .get("/conversations/user/me")
                .then((convos) => {
                    // Set conversations from API with type check
                    setConversations(Array.isArray(convos) ? convos : []);
                })
                .catch((err) => {
                    // Log fetch error
                    console.error("Error fetching conversations:", err);
                });
        }
    }, [isAuthenticated, user]);

    // Add pagination for conversations display
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    const totalPages = Math.ceil(conversations.length / pageSize);
    const paginatedConversations = conversations.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Mes conversations
            </h1>
            {/* Render paginated conversations with static card info except id */}
            {conversations.length === 0 ? (
                <p className="text-gray-600">
                    Vous n&apos;avez pas encore de conversations.
                </p>
            ) : (
                <>
                    <div className="flex flex-col gap-3">
                        {paginatedConversations
                            .sort((a, b) => {
                                // Handle cases where conversations don't have lastMessage
                                if (!a.lastMessage && !b.lastMessage) return 0;
                                if (!a.lastMessage) return 1; // b comes first if a has no lastMessage
                                if (!b.lastMessage) return -1; // a comes first if b has no lastMessage

                                // Sort by lastMessage createdAt date
                                return (
                                    new Date(
                                        b.lastMessage.createdAt
                                    ).getTime() -
                                    new Date(a.lastMessage.createdAt).getTime()
                                );
                            })
                            .map((conversation) => (
                                <ConversationCard
                                    key={conversation.id}
                                    id={conversation.id}
                                    partnerId={
                                        conversation.partnerId === user?.id
                                            ? conversation.creatorId
                                            : conversation.partnerId
                                    }
                                    lastMessage={
                                        conversation.lastMessage || undefined
                                    }
                                />
                            ))}
                    </div>
                    {/* Render pagination controls */}
                    <div className="flex justify-center items-center gap-x-2 md:gap-x-6 mt-6 md:text-lg">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                        >
                            {size.width && size.width > 640 ? (
                                "Précédent"
                            ) : (
                                <ArrowBigLeft />
                            )}
                        </button>
                        <p>
                            Page {currentPage} / {totalPages}
                        </p>
                        <button
                            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            {size.width && size.width > 640 ? (
                                "Suivant"
                            ) : (
                                <ArrowBigRight />
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
