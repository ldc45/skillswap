"use client";

import { Skill } from "@/@types/api";
import SkillSearchBar from "@/components/partners/SkillSearchBar";
import PopularSkillsList from "@/components/partners/PopularSkillsList";
import MembersListWithPagination from "@/components/partners/MembersListWithPagination";
// import { useSkillStore } from "@/lib/stores/skillStore"
import { useUserStore } from "@/lib/stores/userStore"
import React, { useEffect, useState } from "react";
import { useSkillStore } from "@/lib/stores/skillStore";

export default function PartnersPage() {
  const { users, isLoading: isUsersLoading, error: usersError, fetchUsers } = useUserStore()
  const { fetchSkills } = useSkillStore()
  const [popularSkills, setPopularSkills] = useState<Skill[]>([])
  const pageSize = 20; // Set page size for pagination
  const [searchValue, setSearchValue] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  // Fetch 20 random users for immediate display and all users for pagination
  useEffect(() => {
    fetchUsers({ random: 20 })
    fetchUsers({force: true })
  }, [fetchUsers])

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

  const membersToPaginate = users
  const filteredMembers = searchValue.trim().length > 0
    ? membersToPaginate.filter(user =>
        user.skills && user.skills.some(skill =>
          skill.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (skill.diminutive && skill.diminutive.toLowerCase().includes(searchValue.toLowerCase()))
        )
      )
    : selectedSkill
      ? membersToPaginate.filter(user =>
          user.skills && user.skills.some(skill => skill.id === selectedSkill.id)
        )
      : membersToPaginate
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Recherchez un partenaire</h1>
      <div className="flex-col gap-y-4 flex lg:flex-row lg:justify-between">
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
      {!usersError ? (
        <div className="flex flex-col gap-y-2 lg:gap-y-3">
          <h2 className="text-lg md:text-2xl lg:text-3xl">Nos membres</h2>
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
          <h2 className="text-lg md:text-2xl lg:text-3xl">Erreur !</h2>
          <p className="text-red-500">{usersError}</p>
        </div>
      )}
    </main>
  )
}