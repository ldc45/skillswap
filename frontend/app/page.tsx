export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl mb-4">SkillSwap</h1>
          <h2 className="text-2xl mb-8">Échangez vos compétences</h2>
          <p className="text-lg mb-8">
            Bienvenue sur la plateforme qui vous permet d&apos;échanger vos compétences avec d&apos;autres personnes.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <button className="btn-primary">S&apos;inscrire</button>
            <button className="btn-outline">Se connecter</button>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl mb-6">Catégories populaires</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="badge active">Développement web</span>
            <span className="badge">Design</span>
            <span className="badge">Marketing</span>
            <span className="badge">Langues</span>
            <span className="badge">Musique</span>
            <span className="badge">Photographie</span>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl mb-6">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl mb-3">1. Créez votre profil</h3>
              <p>Indiquez vos compétences et ce que vous souhaitez apprendre.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl mb-3">2. Trouvez des correspondances</h3>
              <p>Découvrez des personnes avec qui échanger vos compétences.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl mb-3">3. Commencez à apprendre</h3>
              <p>Planifiez vos sessions et commencez votre apprentissage.</p>
            </div>
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
              <button className="btn-primary">Bouton Primary</button>
              <button className="btn-outline">Bouton Outline</button>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl mb-4">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <span className="badge">Badge Standard</span>
              <span className="badge active">Badge Actif</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl mb-4">Couleurs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#F5FDFE] border border-gray-200 rounded-md mb-2"></div>
                <span className="text-sm">#F5FDFE</span>
                <span className="text-xs">Background</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#001019] rounded-md mb-2"></div>
                <span className="text-sm">#001019</span>
                <span className="text-xs">Foreground</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#005884] rounded-md mb-2"></div>
                <span className="text-sm">#005884</span>
                <span className="text-xs">Primary</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#00A9FF] rounded-md mb-2"></div>
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
