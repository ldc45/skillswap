// Legal notice (Mentions légales) information page
import type { FC } from "react";

const MentionsLegalesPage: FC = () => {
    return (
        <main className="max-w-3xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100">
            {/* Page title */}
            <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>
            {/* Subtitle */}
            <h2 className="text-xl font-semibold mb-2">Informations éditeur</h2>
            {/* Main content */}
            <p className="mb-4">
                Ce site est édité par :
                <br />
                <span className="font-medium">
                    Nom de l’entreprise ou du responsable
                </span>
                <br />
                Adresse : [à compléter]
                <br />
                Email : [à compléter]
            </p>
            <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
            <p className="mb-4">
                Hébergeur : [Nom de l’hébergeur]
                <br />
                Adresse : [à compléter]
                <br />
                Téléphone : [à compléter]
            </p>
            <h2 className="text-xl font-semibold mb-2">
                Propriété intellectuelle
            </h2>
            <p className="mb-4">
                Le contenu de ce site est protégé par le droit d’auteur. Toute
                reproduction est interdite sans autorisation préalable.
            </p>
            {/* Cookies section */}
            <h2 className="text-xl font-semibold mb-2">Cookies</h2>
            <p className="mb-4">
                Ce site utilise uniquement des cookies strictement nécessaires
                au fonctionnement et à la sécurité (ex : cookies de session ou
                d’authentification). Aucun cookie publicitaire ou de suivi n’est
                utilisé.
                <br />
                Ces cookies sont essentiels et ne stockent aucune information
                personnelle à des fins commerciales.
            </p>
        </main>
    );
};

export default MentionsLegalesPage;
