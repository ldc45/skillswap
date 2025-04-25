"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "@/components/ui/button";

import { User } from "@/@types/api";
import { apiService } from "@/lib/services/apiService";
import PartnerProfile from "@/components/partnerProfile/PartnerProfile";
import PartnerAvailabilities from "@/components/partnerAvailabilities/PartnerAvailabilities";

export default function PartnerDetailPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { user } = useAuthStore();

  const [partner, setPartner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContacting, setIsContacting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  // Fetch the partner data using the id from the params
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response: User = await apiService.get(`/users/${id}`);
        if (!response) {
          throw new Error("Failed to fetch partner data");
        }
        setPartner(response);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des données du partenaire");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPartner();
    } else {
      setError("Aucun partenaire trouvé");
      setIsLoading(false);
    }
  }, [id]);

  const handleContact = async () => {
    if (!user || !partner) return;
    setIsContacting(true);
    setContactError(null);
    try {
      const conversation = await apiService.post("/conversations", {
        creatorId: user.id,
        partnerId: partner.id,
      });
      if (conversation && typeof conversation === "object" && "id" in conversation) {
        router.push(`/dashboard/messages/${(conversation as { id: string }).id}`);
        return;
      }
      throw new Error("Conversation creation failed");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: unknown; status?: number } };
      if (
        typeof errorObj?.response?.data === "object" &&
        errorObj?.response?.data !== null &&
        "message" in errorObj.response.data &&
        typeof (errorObj.response.data as { message?: string }).message === "string" &&
        (errorObj.response.data as { message: string }).message.includes("already exists") ||
        errorObj?.response?.status === 409
      ) {
        try {
          const conversations = await apiService.get("/conversations/user/me");
          const existing = Array.isArray(conversations)
            ? conversations.find(
                (c) =>
                  (c.creatorId === user.id && c.partnerId === partner.id) ||
                  (c.creatorId === partner.id && c.partnerId === user.id)
              )
            : null;
          if (existing) {
            router.push(`/dashboard/messages/${existing.id}`);
            return;
          }
        } catch {}
      }
      setContactError("Impossible de contacter ce membre.");
    } finally {
      setIsContacting(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }
  if (error || !partner) {
    return (
      <div className="flex flex-col gap-y-2 lg:gap-y-3 justify-center items-center">
        <h2 className="text-lg md:text-2xl lg:text-3xl">Erreur !</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 lg:p-8">
      <div className="flex flex-col flex-1 gap-4">
        <PartnerProfile partner={partner} />
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <PartnerAvailabilities />
        <Button
          onClick={handleContact}
          disabled={isContacting}
          className="w-fit self-center md:text-lg"
        >
          {isContacting ? "Contact en cours..." : "Contacter"}
        </Button>
        {contactError && (
          <span className="text-red-500 text-sm self-end">{contactError}</span>
        )}
      </div>
    </div>
  );
}
