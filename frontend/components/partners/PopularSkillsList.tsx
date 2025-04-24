// Render a list of clickable skill badges for filtering
import React from "react"
import { Badge } from "@/components/ui/badge"
import { Skill } from "@/@types/api"

interface PopularSkillsListProps {
  skills: Skill[]
  selectedSkill: Skill | null
  onSelect: (skill: Skill | null) => void
  className?: string
}

export default function PopularSkillsList({ skills, selectedSkill, onSelect, className = "" }: PopularSkillsListProps) {
  return (
    <div className={`flex-wrap flex gap-y-1 gap-x-2 ${className}`}>
      {skills.map((skill) => (
        <Badge
          key={skill.id}
          variant="badge"
          className={`md:text-base px-4 lg:text-lg cursor-pointer ${selectedSkill?.id === skill.id ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => onSelect(selectedSkill?.id === skill.id ? null : skill)}
        >
          {typeof skill.diminutive === "string" && skill.diminutive
            ? skill.diminutive
            : skill.name || ""}
        </Badge>
      ))}
    </div>
  )
}
