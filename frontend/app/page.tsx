import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl mb-4">SkillSwap</h1>
          <h2 className="text-2xl mb-8">Échangez vos compétences</h2>
          <p className="text-lg mb-8">
            Bienvenue sur la plateforme qui vous permet d&apos;échanger vos
            compétences avec d&apos;autres personnes.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Button>S&apos;inscrire</Button>
            <Button variant="outline">Se connecter</Button>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl mb-6">Catégories populaires</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge>Développement web</Badge>
            <Badge variant="secondary">Design</Badge>
            <Badge variant="secondary">Marketing</Badge>
            <Badge variant="secondary">Langues</Badge>
            <Badge variant="secondary">Musique</Badge>
            <Badge variant="secondary">Photographie</Badge>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-6">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Créez votre profil</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Indiquez vos compétences et ce que vous souhaitez apprendre.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Trouvez des correspondances</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Découvrez des personnes avec qui échanger vos compétences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Commencez à apprendre</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Planifiez vos sessions et commencez votre apprentissage.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-6">Exemples de styles</h2>

          <div className="mb-8">
            <h3 className="text-xl mb-4">Typographie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h1 className="mb-2">Titre H1 (Syne Bold)</h1>
                <h2 className="mb-2">Titre H2 (Syne Semi-Bold)</h2>
                <h3 className="mb-2">Titre H3 (Syne Semi-Bold)</h3>
              </div>
              <div>
                <p className="mb-2">Texte normal (Inter)</p>
                <p className="font-medium mb-2">Texte medium (Inter Medium)</p>
                <p className="font-bold mb-2">Texte gras (Inter Bold)</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl mb-4">Boutons</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Bouton Primary</Button>
              <Button variant="outline">Bouton Outline</Button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl mb-4">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Badge Standard</Badge>
              <Badge variant="outline">Badge Actif</Badge>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl mb-4">Couleurs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-background border border-gray-200 rounded-md mb-2"></div>
                <span className="text-sm">#F5FDFE</span>
                <span className="text-xs">Background</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-foreground rounded-md mb-2"></div>
                <span className="text-sm">#001019</span>
                <span className="text-xs">Foreground</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary rounded-md mb-2"></div>
                <span className="text-sm">#005884</span>
                <span className="text-xs">Primary</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary rounded-md mb-2"></div>
                <span className="text-sm">#00A9FF</span>
                <span className="text-xs">Badge Active</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-sm">
        <p> 2025 SkillSwap - Tous droits réservés</p>
      </footer>
    </div>
  );
}
