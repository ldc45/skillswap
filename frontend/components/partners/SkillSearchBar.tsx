// Render a search input for filtering skills or members
import React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SkillSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SkillSearchBar({
    value,
    onChange,
    placeholder = "Rechercher une compétence...",
    className = "",
}: SkillSearchBarProps) {
    return (
        <div className="relative w-80 md:w-120 h-8 md:h-10">
            <Search className="absolute left-4.5 -translate-y-1/2 top-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                className={`w-full pl-12 !h-full md:text-base ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
