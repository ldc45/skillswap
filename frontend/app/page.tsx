"use client";

import { useEffect, useState } from "react";

import { Skill } from "@/@types/api";
import { useAuthStore } from "@/lib/stores/authStore";
import SkillSearchBar from "@/components/partners/SkillSearchBar";
import PopularSkillsList from "@/components/partners/PopularSkillsList";
import MembersListWithPagination from "@/components/partners/MembersListWithPagination";
import MemberCard from "@/components/memberCard/MemberCard";
import { useUserStore } from "@/lib/stores/userStore";

export default function Home() {
    const { isAuthenticated, user } = useAuthStore();
    const {
        users,
        isLoading: isUsersLoading,
        error: usersError,
        fetchUsers,
    } = useUserStore();

    const [popularSkills, setPopularSkills] = useState<Skill[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        // Always load all users
        fetchUsers({ force: true });
    }, [isAuthenticated, fetchUsers]);
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
    // Display all users
    const usersToDisplay = users;
    const hasFilters = searchValue.trim().length > 0 || selectedSkill !== null;

    // Filter users based on search criteria
    const filteredMembers = hasFilters
        ? usersToDisplay.filter(
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
          )
        : // Shuffle users when no filters are applied
          shuffleArray(usersToDisplay);
    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-y-6 md:gap-y-10 lg:gap-y-14">
            <div className="flex-col gap-y-4 flex gap-x-8 lg:flex-row-reverse lg:justify-between">
                <div className="flex flex-col gap-y-2 lg:gap-y-6">
                    {isAuthenticated ? (
                        <>
                            <h2 className="text-lg md:text-2xl lg:text-3xl text-primary dark:text-primary-200">
                                Bienvenue sur SkillSwap&nbsp;!
                            </h2>
                            <h3 className="text-sm md:text-lg lg:text-xl text-muted-foreground dark:text-muted-foreground">
                                Heureux de vous revoir
                                {user?.firstName && (
                                    <span className="text-primary dark:text-primary-200">
                                        , {user.firstName}
                                    </span>
                                )}
                                . Découvrez de nouvelles compétences ou partagez
                                les vôtres !
                            </h3>
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg md:text-2xl lg:text-3xl text-primary dark:text-primary-200">
                                Echangez vos compétences
                            </h2>
                            <h3 className="text-sm md:text-lg lg:text-xl text-muted-foreground dark:text-muted-foreground">
                                Rejoignez notre communauté et partagez vos
                                connaissances
                            </h3>
                        </>
                    )}
                </div>
                <SkillSearchBar
                    value={searchValue}
                    onChange={setSearchValue}
                    className="max-w-120 md:min-h-10"
                />
            </div>
            <div className="flex flex-col gap-y-2 lg:gap-y-3">
                <h2 className="text-lg md:text-2xl lg:text-3xl">
                    Compétences populaires
                </h2>
                <PopularSkillsList
                    skills={popularSkills}
                    selectedSkill={selectedSkill}
                    onSelect={setSelectedSkill as (skill: Skill | null) => void}
                />

            </div>
            {!usersError ? (
                <div className="flex flex-col gap-y-2 lg:gap-y-3">
                    <h2 className="text-lg md:text-2xl lg:text-3xl">
                        Nos membres
                    </h2>
                    {isAuthenticated ? (
                        <MembersListWithPagination
                            members={paginatedMembers}
                            isLoading={isUsersLoading}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalCount={filteredMembers.length}
                            onPageChange={setCurrentPage}
                        />
                    ) : (
                        <div className="grid gap-2 md:gap-3 xl:gap-4 md:grid-cols-2">
                            {paginatedMembers.map((user) => (
                                <MemberCard
                                    key={user.id}
                                    user={user}
                                    isLoading={isUsersLoading}
                                />
                            ))}
                        </div>
                    )}
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
