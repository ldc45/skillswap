// RGPD (General Data Protection Regulation) information page
import type { FC } from "react";

const RgpdPage: FC = () => {
    return (
        <main className="max-w-3xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100">
            {/* Page title */}
            <h1 className="text-3xl font-bold mb-4">
                Politique de confidentialité (RGPD)
            </h1>
            {/* Subtitle */}
            <h2 className="text-xl font-semibold mb-2">
                Protection des données personnelles
            </h2>
            {/* Main content */}
            <p className="mb-4">
                Nous nous engageons à protéger vos données personnelles
                conformément au Règlement Général sur la Protection des Données
                (RGPD). Les informations collectées sont utilisées uniquement
                dans le cadre du fonctionnement de la plateforme et ne sont
                jamais revendues à des tiers.
            </p>
            <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Accès, rectification et suppression de vos données</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d’opposition et de limitation du traitement</li>
            </ul>
            <p className="mb-4">
                Pour exercer vos droits ou pour toute question concernant vos
                données, contactez-nous à l’adresse indiquée dans les mentions
                légales.
            </p>
        </main>
    );
};

export default RgpdPage;
