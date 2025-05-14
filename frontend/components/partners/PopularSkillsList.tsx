// Render a list of clickable skill badges for filtering
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/@types/api";

interface PopularSkillsListProps {
    skills: Skill[];
    selectedSkill: Skill | null;
    onSelect: (skill: Skill | null) => void;
    className?: string;
}

export default function PopularSkillsList({
    skills,
    selectedSkill,
    onSelect,
    className = "",
}: PopularSkillsListProps) {
    return (
        <div className={`flex-wrap flex gap-y-1 gap-x-2 ${className}`}>
            {skills.map((skill) => (
                <Badge
                    key={skill.id}
                    variant={`${selectedSkill?.id === skill.id ? "active" : "badge"}`}
                    className={`md:text-base px-4 cursor-pointer`}
                    onClick={() =>
                        onSelect(selectedSkill?.id === skill.id ? null : skill)
                    }
                >
                    {skill.diminutive ? skill.diminutive : skill.name}
                </Badge>
            ))}
        </div>
    );
}
