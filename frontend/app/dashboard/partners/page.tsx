"use client";

import { Skill } from "@/@types/api";
import SkillSearchBar from "@/components/partners/SkillSearchBar";
import PopularSkillsList from "@/components/partners/PopularSkillsList";
import MembersListWithPagination from "@/components/partners/MembersListWithPagination";
import { useUserStore } from "@/lib/stores/userStore";
import React, { useEffect, useState } from "react";

export default function PartnersPage() {
    const {
        users,
        isLoading: isUsersLoading,
        error: usersError,
        fetchUsers,
    } = useUserStore();
    const [popularSkills, setPopularSkills] = useState<Skill[]>([]);
    const pageSize = 20; // Set page size for pagination
    const [searchValue, setSearchValue] = useState("");
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // Load all users when component mounts
    useEffect(() => {
        fetchUsers({ force: true });
    }, [fetchUsers]);
    useEffect(() => {
        // Count skill occurrences across all users
        const skillCount: Record<string, { skill: Skill; count: number }> = {};
        users.forEach((user) => {
            user.skills?.forEach((skill) => {
                if (skill && skill.id) {
                    if (!skillCount[skill.id]) {
                        skillCount[skill.id] = { skill, count: 1 };
                    } else {
                        skillCount[skill.id].count++;
                    }
                }
            });
        });
        // Sort skills by popularity
        const sortedSkills = Object.values(skillCount)
            .sort((a, b) => b.count - a.count)
            .map((entry) => entry.skill);
        // Select top 6 skills
        setPopularSkills(sortedSkills.slice(0, 6));
    }, [users]);
    // Shuffle array using Fisher-Yates algorithm
    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const membersToPaginate = users;
    const hasFilters = searchValue.trim().length > 0 || selectedSkill !== null;

    const filteredMembers = hasFilters
        ? membersToPaginate.filter(
              (user) =>
                  user.skills &&
                  ((searchValue.trim().length > 0 &&
                      user.skills.some(
                          (skill) =>
                              skill.name
                                  .toLowerCase()
                                  .includes(searchValue.toLowerCase()) ||
                              (skill.diminutive &&
                                  skill.diminutive
                                      .toLowerCase()
                                      .includes(searchValue.toLowerCase()))
                      )) ||
                      (selectedSkill &&
                          user.skills.some(
                              (skill) => skill.id === selectedSkill.id
                          )))
          ) // Shuffle users when no filters are applied
        : shuffleArray(membersToPaginate);
    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Recherchez un partenaire
            </h1>
            <div className="flex-col gap-y-4 flex lg:flex-row lg:justify-between">
                <SkillSearchBar value={searchValue} onChange={setSearchValue} />
            </div>
            <div className="flex flex-col gap-y-2 lg:gap-y-3">
                <h2 className="text-lg md:text-2xl lg:text-3xl">
                    Compétences populaires
                </h2>
                <PopularSkillsList
                    skills={popularSkills}
                    selectedSkill={selectedSkill}
                    onSelect={setSelectedSkill}
                />
            </div>
            {!usersError ? (
                <div className="flex flex-col gap-y-2 lg:gap-y-3">
                    <h2 className="text-lg md:text-2xl lg:text-3xl">
                        Nos membres
                    </h2>
                    <MembersListWithPagination
                        members={paginatedMembers}
                        isLoading={isUsersLoading}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalCount={filteredMembers.length}
                        onPageChange={setCurrentPage}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-y-2 lg:gap-y-3 justify-center items-center">
                    <h2 className="text-lg md:text-2xl lg:text-3xl">
                        Erreur !
                    </h2>
                    <p className="text-red-500">{usersError}</p>
                </div>
            )}
        </main>
    );
}
