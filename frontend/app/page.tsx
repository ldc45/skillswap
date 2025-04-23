"use client";

import { useEffect, useState } from "react";

import { User } from "@/@types/api";
import { apiService } from "@/lib/services/apiService";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MemberCard from "@/components/memberCard/MemberCard";

export default function Home() {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch 4 random users from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response: User[] = await apiService.get("/users?random=4");

        if (!response) {
          throw new Error("Error fetching members from API");
        }

        setMembers(response);
      } catch (error) {
        console.error(error);
        setError(
          "Une erreur est survenue lors de la récupération des membres."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const mainSkills = [
    {
      id: 1,
      diminutive: "Dev. web",
    },
    {
      id: 2,
      diminutive: "Design",
    },
    {
      id: 3,
      diminutive: "Langues",
    },
    {
      id: 4,
      diminutive: "Marketing",
    },
  ];

  return (
    <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
      <div className="flex-col gap-y-4 flex lg:min-h-[20vh] lg:flex-row-reverse lg:justify-between">
        <div className="flex flex-col gap-y-2 lg:gap-y-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl">
            Echangez vos compétences
          </h2>
          <h3 className="text-sm md:text-lg lg:text-xl">
            Rejoignez notre communauté et partagez vos connaissances
          </h3>
        </div>

        <Input
          className="max-w-120 md:min-h-10"
          placeholder="⌕ Rechercher une compétence..."
        />
      </div>

      <div className="flex flex-col gap-y-2 lg:gap-y-3">
        <h2 className="text-lg md:text-2xl lg:text-3xl">
          Compétences populaires
        </h2>
        <div className="flex-wrap flex gap-y-1 gap-x-2">
          {mainSkills.map((skill) => (
            <Badge
              key={skill.id}
              variant="badge"
              className="md:text-base px-4 lg:text-lg"
            >
              {skill.diminutive}
            </Badge>
          ))}
        </div>
      </div>

      {!error ? (
        <div className="flex flex-col gap-y-2 lg:gap-y-3">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Nos membres</h2>
          <div className="grid gap-2 md:gap-3 xl:gap-4 md:grid-cols-2">
            {members.map((user) => (
              <MemberCard key={user.id} user={user} isLoading={isLoading} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 lg:gap-y-3 justify-center items-center">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Erreur !</h2>
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </main>
  );
}
