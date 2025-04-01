import MemberCard from "@/components/MemberCard/MemberCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Home() {
  const mainSkills = [
    {
      id: 1,
      diminutive: "Dev. web",
    },
    {
      id: 2,
      diminutive: "Design",
    },
    {
      id: 3,
      diminutive: "Langues",
    },
    {
      id: 4,
      diminutive: "Marketing",
    },
  ];

  const fakeUsers = [
    {
      id: 1,
      first_name: "Marie",
      last_name: "Dupont",
      avatar_url: "https://github.com/shadcn.png",
    },
    {
      id: 2,
      first_name: "Jean",
      last_name: "Martin",
      avatar_url: "https://github.com/shadcn.png",
    },
    {
      id: 3,
      first_name: "Sophie",
      last_name: "Lemoine",
      avatar_url: "https://github.com/shadcn.png",
    },
    {
      id: 4,
      first_name: "Thomas",
      last_name: "Bernard",
      avatar_url: "https://github.com/shadcn.png",
    },
  ];

  return (
    <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
      <div className="flex-col gap-y-4 flex lg:min-h-[20vh] lg:flex-row-reverse lg:justify-between">
        <div className="flex flex-col gap-y-2 lg:gap-y-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl">
            Echangez vos compétences
          </h2>
          <h3 className="text-sm md:text-lg lg:text-xl">
            Rejoignez notre communauté et partagez vos connaissances
          </h3>
        </div>

        <Input
          className="max-w-120 md:min-h-10"
          placeholder="⌕ Rechercher une compétence..."
        />
      </div>

      <div className="flex flex-col gap-y-2 lg:gap-y-3">
        <h2 className="text-lg md:text-2xl lg:text-3xl">
          Compétences populaires
        </h2>
        <div className="flex-wrap flex gap-y-1 gap-x-2">
          {mainSkills.map((skill) => (
            <Badge key={skill.id} className="md:text-base lg:text-lg">
              {skill.diminutive}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-2 lg:gap-y-3">
        <h2 className="text-lg md:text-2xl lg:text-3xl">Nos membres</h2>
        <div className="grid gap-2 md:gap-3 xl:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fakeUsers.map((user) => (
            <MemberCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </main>
  );
}
