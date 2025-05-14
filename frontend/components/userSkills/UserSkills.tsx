import { Skill } from "@/@types/api";
import { Badge } from "@/components/ui/badge";

export default function UserSkills({ skills }: { skills: Skill[] }) {
    return (
        <div className="flex justify-center flex-wrap gap-2 w-full">
            {skills && skills.length > 0 ? (
                skills.map((skill) => (
                    <Badge
                        variant="badge"
                        key={skill.id}
                        className="md:text-sm lg:text-base md:px-2 lg:px-4"
                    >
                        {skill.diminutive || skill.name}
                    </Badge>
                ))
            ) : (
                <p className="text-sm md:text-base">
                    Vous n&apos;avez pas encore de compétences
                </p>
            )}
        </div>
    );
}
