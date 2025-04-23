"use client";

import { Skill, User } from "@/@types/api";
import SkillSearchBar from "@/components/partners/SkillSearchBar";
import PopularSkillsList from "@/components/partners/PopularSkillsList";
import MembersListWithPagination from "@/components/partners/MembersListWithPagination";
import { apiService } from "@/lib/services/apiService";
import React, { useEffect, useState } from "react";

export default function PartnersPage() {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allMembers, setAllMembers] = useState<User[] | null>(null); // Store all members for pagination
  const [popularSkills, setPopularSkills] = useState<Skill[]>([]); // Store popular skills for display
  const pageSize = 20; // Set page size for pagination
  // State for search bar
  const [searchValue, setSearchValue] = useState("")
  // State for selected skill
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // Fetch random sample for immediate display
    const fetchRandomMembers = async () => {
      try {
        const response: User[] = await apiService.get("/users?random=20");
        console.log("response", response);
        if (!response) throw new Error("Error fetching members from API");
        setMembers(response);
      } catch (error) {
        console.error(error);
        setError("Une erreur est survenue lors de la récupération des membres.");
      } finally {
        setIsLoading(false);
      }
    };
    // Fetch all members for pagination in background
    const fetchAllMembers = async () => {
      try {
        const response: User[] = await apiService.get("/users");
        if (Array.isArray(response)) setAllMembers(response);
      } catch (error) {
        // Log error but do not block UI
        console.error("Error fetching all members:", error);
      }
    };
    const fetchSkills = async () => {
      try {
        const response: Skill[] = await apiService.get("/skills");
        const popularSkills = response.length > 6
          ? [...response].sort(() => 0.5 - Math.random()).slice(0, 6)
          : response;
        setPopularSkills(popularSkills);
      } catch (error) {
        // Log error but do not block UI
        console.error("Error fetching skills:", error);
      }
    };
    fetchRandomMembers();
    fetchAllMembers();
    fetchSkills();
  }, []);

  // Filter logic for members
  const membersToPaginate = allMembers || members
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Recherchez un partenaire</h1>
      <div className="flex-col gap-y-4 flex lg:min-h-[20vh] lg:flex-row-reverse lg:justify-between">
        <SkillSearchBar
          value={searchValue}
          onChange={setSearchValue}
          className="max-w-120 md:min-h-10"
        />
      </div>
      <div className="flex flex-col gap-y-2 lg:gap-y-3">
        <h2 className="text-lg md:text-2xl lg:text-3xl">Compétences populaires</h2>
        <PopularSkillsList
          skills={popularSkills}
          selectedSkill={selectedSkill}
          onSelect={setSelectedSkill}
        />
      </div>
      {!error ? (
        <div className="flex flex-col gap-y-2 lg:gap-y-3">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Nos membres</h2>
          <MembersListWithPagination
            members={paginatedMembers}
            isLoading={isLoading}
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={filteredMembers.length}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 lg:gap-y-3 justify-center items-center">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Erreur !</h2>
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </main>
  )
}