import { User } from "@/@types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function PartnerProfile({ partner }: { partner: User }) {

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

      <div className="flex-wrap flex gap-y-1 gap-x-2">
        {partner.skills && partner.skills.length > 0 && partner.skills.map((skill) => (
          <Badge
            variant="badge"
            key={skill.id}
            className="md:text-sm lg:text-base md:px-2 lg:px-4"
          >
            {skill.name && skill.name.length > 8
              ? skill.diminutive || skill.name
              : skill.name || skill.diminutive}
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
