"use client";

import { useEffect, useState } from "react";

import { Skill, User } from "@/@types/api";
import { apiService } from "@/lib/services/apiService";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/authStore";
import SkillSearchBar from "@/components/partners/SkillSearchBar";
import PopularSkillsList from "@/components/partners/PopularSkillsList";
import MembersListWithPagination from "@/components/partners/MembersListWithPagination";
import MemberCard from "@/components/memberCard/MemberCard";

export default function Home() {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [popularSkills, setPopularSkills] = useState<Skill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  // Get authentication state
  const { isAuthenticated } = useAuthStore();

  // Fetch 4 random users from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const endpoint = isAuthenticated ? "/users" : "/users?random=4"
        const response: User[] = await apiService.get(endpoint);

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
  }, [isAuthenticated]);

  // Fetch skills for both connected and non-connected users
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await apiService.get("/skills") as Skill[]
        const popSkills = response.length > 6 ? [...response].sort(() => 0.5 - Math.random()).slice(0, 6) : response
        setPopularSkills(popSkills)
      } catch (error) {
        // Log error but do not block UI
        console.error("Error fetching skills:", error)
      }
    }
    fetchSkills()
  }, [])

  // Connected: filter and paginate members
  const membersToPaginate = members
  const filteredMembers = searchValue.trim().length > 0
    ? membersToPaginate.filter(user =>
        user.skills && user.skills.some(s =>
          s.skill.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (s.skill.diminutive && s.skill.diminutive.toLowerCase().includes(searchValue.toLowerCase()))
        )
      )
    : selectedSkill
      ? membersToPaginate.filter(user =>
          user.skills && user.skills.some(s => s.skill.id === selectedSkill.id)
        )
      : membersToPaginate
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
      <div className="flex-col gap-y-4 flex lg:min-h-[20vh] lg:flex-row-reverse lg:justify-between">
        <div className="flex flex-col gap-y-2 lg:gap-y-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Echangez vos compétences</h2>
          <h3 className="text-sm md:text-lg lg:text-xl">Rejoignez notre communauté et partagez vos connaissances</h3>
        </div>
        {/* Show search bar only if user is authenticated */}
        {isAuthenticated && (
          <SkillSearchBar
            value={searchValue}
            onChange={setSearchValue}
            className="max-w-120 md:min-h-10"
          />
        )}
      </div>
      <div className="flex flex-col gap-y-2 lg:gap-y-3">
        <h2 className="text-lg md:text-2xl lg:text-3xl">Compétences populaires</h2>
        {isAuthenticated ? (
          <PopularSkillsList
            skills={popularSkills}
            selectedSkill={selectedSkill}
            onSelect={setSelectedSkill as (skill: Skill | null) => void}
          />
        ) : (
          <div className="flex-wrap flex gap-y-1 gap-x-2">
            {popularSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant="badge"
                className="md:text-base px-4 lg:text-lg"
              >
                {typeof skill.diminutive === "string" && skill.diminutive ? skill.diminutive : skill.name || ""}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {!error ? (
        <div className="flex flex-col gap-y-2 lg:gap-y-3">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Nos membres</h2>
          {isAuthenticated ? (
            <MembersListWithPagination
              members={paginatedMembers}
              isLoading={isLoading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={filteredMembers.length}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="grid gap-2 md:gap-3 xl:gap-4 md:grid-cols-2">
              {members.map((user) => (
                <MemberCard key={user.id} user={user} isLoading={isLoading} />
              ))}
            </div>
          )}
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
