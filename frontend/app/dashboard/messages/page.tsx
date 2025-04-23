"use client";

import React, { useEffect, useState } from "react";
import ConversationCard from "@/components/conversationCard/ConversationCard";
import { useAuthStore } from "@/lib/stores/authStore";
import { apiService } from "@/lib/services/apiService";

// Define conversation interface
interface Conversation {
  id: string;
  partnerId: string;
  creatorId: string;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
  };
}

export default function MessagesPage() {
  // Initialize conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Fetch conversations for authenticated user using apiService
    if (isAuthenticated && user) {
      apiService.get("/conversations/user/me")
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
  const paginatedConversations = conversations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mes conversations</h1>
      {/* Render paginated conversations with static card info except id */}
      {conversations.length === 0 ? (
        <p className="text-gray-600">Vous n&apos;avez pas encore de conversations.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginatedConversations
              .sort((b, a) => new Date(a.lastMessage.createdAt).getTime() - new Date(b.lastMessage.createdAt).getTime())
              .map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  id={conversation.id}
                  partnerId={conversation.partnerId === user?.id ? conversation.partnerId : conversation.partnerId}
                  lastMessage={conversation.lastMessage}
                />
              ))}
          </div>
          {/* Render pagination controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span className="mx-2">Page {currentPage} / {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}