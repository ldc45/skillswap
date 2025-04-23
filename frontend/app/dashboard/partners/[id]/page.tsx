"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { User } from "@/@types/api";
import { apiService } from "@/lib/services/apiService";
import PartnerProfile from "@/components/partnerProfile/PartnerProfile";
import PartnerAvailabilities from "@/components/partnerAvailabilities/PartnerAvailabilities";

export default function PartnerDetailPage() {
  const params = useParams();
  const { id } = params;

  const [partner, setPartner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex flex-col md:p-4 lg:p-8 lg:flex-row">
      <PartnerProfile partner={partner} />
      <PartnerAvailabilities />
    </div>
  );
}
