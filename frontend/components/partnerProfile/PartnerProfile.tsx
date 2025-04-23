import { User } from "@/@types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function PartnerProfile({ partner }: { partner: User }) {
  const fakeSkills = [
    {
      id: 1,
      label: "Développement web",
      diminutive: "Dev. web",
    },
    {
      id: 2,
      label: "Design",
      diminutive: "Design",
    },
    {
      id: 3,
      label: "Langues",
      diminutive: "Langues",
    },
    {
      id: 4,
      label: "Marketing",
      diminutive: "Marketing",
    },
  ];

  return (
    <div className="basis-1/2 p-4 flex flex-col gap-y-4 items-center">
      <div className="flex flex-col gap-y-2 items-center">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={partner.avatarUrl || "https://github.com/shadcn.png"}
          />
        </Avatar>
        <h3 className="text-xl font-medium md:text-2xl lg:text-3xl">
          {partner.firstName} {partner.lastName?.charAt(0)}.
        </h3>
      </div>

      <div className="flex flex-row md:gap-x-2 lg:gap-x-3 gap-x-1 wrap">
        {fakeSkills.map((skill) => (
          <Badge
            variant="badge"
            key={skill.id}
            className="md:text-sm lg:text-base md:px-2 lg:px-4"
          >
            {skill.label.length > 8 ? skill.diminutive : skill.label}
          </Badge>
        ))}
      </div>

      <div className="flex w-full flex-col gap-y-1">
        <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
          Biographie
        </h4>
        <p className="text-sm md:text-base">{partner.biography}</p>
      </div>
    </div>
  );
}
