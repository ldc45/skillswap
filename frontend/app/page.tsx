"use client";

import { useEffect, useState } from "react";

import { Skill } from "@/@types/api";
import { useAuthStore } from "@/lib/stores/authStore";
import SkillSearchBar from "@/components/partners/SkillSearchBar";
import PopularSkillsList from "@/components/partners/PopularSkillsList";
import MembersListWithPagination from "@/components/partners/MembersListWithPagination";
import MemberCard from "@/components/memberCard/MemberCard";
import { useSkillStore } from "@/lib/stores/skillStore"
import { useUserStore } from "@/lib/stores/userStore"

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { users, isLoading: isUsersLoading, error: usersError, fetchUsers } = useUserStore()
  const { fetchSkills } = useSkillStore()
  
  const defaultMembersCount = 9
  
  const [popularSkills, setPopularSkills] = useState<Skill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20


  // Track previous authentication state to determine if user just logged in
  const [wasAuthenticated, setWasAuthenticated] = useState(isAuthenticated)

  // Add showAllUsers state for search and filter
  const [showAllUsers, setShowAllUsers] = useState(false)
  useEffect(() => {
    // If just logged in, force refetch all users
    if (isAuthenticated && !wasAuthenticated) {
      fetchUsers({ force: true })
    } else if (!isAuthenticated) {
      fetchUsers({ random: defaultMembersCount })
    }
    setWasAuthenticated(isAuthenticated)
  }, [isAuthenticated, fetchUsers, wasAuthenticated, defaultMembersCount])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  useEffect(() => {
    // Count occurrences of each skill among all users
    const skillCount: Record<string, { skill: Skill; count: number }> = {}
    users.forEach(user => {
      user.skills?.forEach(skill => {
        if (skill && skill.id) {
          if (!skillCount[skill.id]) {
            skillCount[skill.id] = { skill, count: 1 }
          } else {
            skillCount[skill.id].count++
          }
        }
      })
    })
    // Sort skills by count descending
    const sortedSkills = Object.values(skillCount)
      .sort((a, b) => b.count - a.count)
      .map(entry => entry.skill)
    // Take top 6 or all if less
    setPopularSkills(sortedSkills.slice(0, 6))
  }, [users])

  // Watch for search or badge filter to trigger full user fetch
  useEffect(() => {    const hasSearch = searchValue.trim().length > 0
    const hasBadge = !!selectedSkill
    if ((hasSearch || hasBadge) && !showAllUsers) {
      setShowAllUsers(true)
      fetchUsers({ force: true })
    }
    if (!hasSearch && !hasBadge && showAllUsers) {
      setShowAllUsers(false)
      fetchUsers({ random: defaultMembersCount })
    }
  }, [searchValue, selectedSkill, showAllUsers, fetchUsers, defaultMembersCount])
  // On mount or auth change, always fetch 4 random users by default
  useEffect(() => {
    if (!showAllUsers) {
      fetchUsers({ random: defaultMembersCount })
    }  }, [isAuthenticated, fetchUsers, showAllUsers, defaultMembersCount])

  const usersToDisplay = showAllUsers ? users : users.slice(0, defaultMembersCount)
  const filteredMembers = searchValue.trim().length > 0 || selectedSkill
    ? usersToDisplay.filter(user =>
        user.skills && (
          (searchValue.trim().length > 0 && (
            user.skills.some(skill =>
              skill.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              (skill.diminutive && skill.diminutive.toLowerCase().includes(searchValue.toLowerCase()))
            )
          )) ||
          (selectedSkill && user.skills.some(skill => skill.id === selectedSkill.id))
        )
      )
    : usersToDisplay
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
      <div className="flex-col gap-y-4 flex lg:flex-row-reverse lg:justify-between">
        <div className="flex flex-col gap-y-2 lg:gap-y-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Echangez vos compétences</h2>
          <h3 className="text-sm md:text-lg lg:text-xl">Rejoignez notre communauté et partagez vos connaissances</h3>
        </div>
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
            onSelect={setSelectedSkill as (skill: Skill | null) => void}
          />
      </div>
      {!usersError ? (
        <div className="flex flex-col gap-y-2 lg:gap-y-3">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Nos membres</h2>
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
                <MemberCard key={user.id} user={user} isLoading={isUsersLoading} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 lg:gap-y-3 justify-center items-center">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Erreur !</h2>
          <p className="text-red-500">{usersError}</p>
        </div>
      )}
    </main>
  );
}
