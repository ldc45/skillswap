import { User } from "@/@types/api";
import UserSkills from "@/components/userSkills/UserSkills";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function PartnerProfile({ partner }: { partner: User }) {
    return (
        <div className="basis-1/2 p-4 flex flex-col gap-y-4 items-center">
            <div className="flex flex-col gap-y-2 items-center">
                <Avatar className="w-20 h-20">
                    <AvatarImage
                        src={
                            partner.avatarUrl || "https://github.com/shadcn.png"
                        }
                        alt={`Avatar ${partner.firstName} ${partner.lastName}`}
                    />
                </Avatar>
                <h3 className="text-xl font-medium md:text-2xl lg:text-3xl">
                    {partner.firstName} {partner.lastName?.charAt(0)}.
                </h3>
            </div>

            <UserSkills skills={partner.skills || []} />

            <div className="flex w-full flex-col gap-y-1 pt-4">
                <h4 className="text-lg md:text-xl lg:text-2xl font-medium">
                    Biographie
                </h4>
                <p className="text-sm md:text-base">{partner.biography}</p>
            </div>
        </div>
    );
}
