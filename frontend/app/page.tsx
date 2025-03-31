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
    <main className="p-4 flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-4">
        <h2>Echangez vos compétences</h2>
        <h3>Rejoignez notre communauté et partagez vos connaissances</h3>
      </div>

      <Input placeholder="⌕ Rechercher une compétence..." />

      <div className="flex flex-col gap-y-2">
        <h2>Compétences populaires</h2>
        <div className="flex-wrap flex gap-x-2">
          {mainSkills.map((skill) => (
            <Badge key={skill.id}>{skill.diminutive}</Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h2>Nos membres</h2>
        <div className="grid gap-2">
          {fakeUsers.map((user) => (
            <MemberCard key={user.id} user={user} />
          ))}


         
        </div>
      </div>
    </main>
  );
}
