// Render a search input for filtering skills or members
import React from "react"
import { Input } from "@/components/ui/input"

interface SkillSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SkillSearchBar({ value, onChange, placeholder = "⌕ Rechercher une compétence...", className = "" }: SkillSearchBarProps) {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}
