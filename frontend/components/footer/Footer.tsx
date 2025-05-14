// Footer component with legal links
import Link from "next/link";
import type { FC } from "react";

const Footer: FC = () => {
    return (
        <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-6 mt-12">
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                {/* Legal links */}
                <div className="flex gap-4">
                    <Link
                        href="/mentions-legales"
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        Mentions légales
                    </Link>
                    <Link
                        href="/rgpd"
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        RGPD
                    </Link>
                </div>
                {/* Copyright */}
                <div className="mt-2 md:mt-0">
                    © {new Date().getFullYear()} SkillSwap. Tous droits
                    réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
