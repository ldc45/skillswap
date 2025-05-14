"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { useAuthStore } from "@/lib/stores/authStore";
import { apiService } from "@/lib/services/apiService";
import logo from "@/public/logo.png";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    // State to manage navigation status
    const [isNavigating, setIsNavigating] = useState(false);
    const router = useRouter();

    // Using Zustand store instead of local state
    const { isAuthenticated } = useAuthStore();

    // Effect to block body scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Handle logout with API service
    const handleLogout = async () => {
        try {
            setIsNavigating(true);
            // Use API service to call logout endpoint
            // and update local store
            await apiService.logout();
            setIsMenuOpen(false);
            toast.success("Déconnexion réussie !", {
                position: "bottom-right",
            });
            // Rediriger vers la page d'accueil après déconnexion
            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsNavigating(false);
        }
    };

    const handleLogin = () => {
        // Simply close the menu after login
        setIsMenuOpen(false);
    };

    // Close the menu during navigation
    const handleNavigation = (path: string) => {
        setIsNavigating(true);
        setIsMenuOpen(false);
        router.push(path);

        // On simule un délai pour masquer le spinner après la navigation
        // Cela permet de s'assurer que le spinner est visible pendant la transition
        setTimeout(() => {
            setIsNavigating(false);
        }, 500);
    };

    // Spinner de chargement
    const loadingSpinner = (
        <div className="fixed inset-0 flex items-center justify-center bg-background/50 z-50">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
        </div>
    );

    const authenticatedMenu = (
        <>
            <nav className="w-full mt-6">
                <ul className="space-y-6 text-center">
                    <li>
                        <Button
                            variant={"ghost"}
                            className="block text-xl mx-auto"
                            onClick={() =>
                                handleNavigation("/dashboard/profile")
                            }
                        >
                            Profil
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="ghost"
                            className="block text-xl mx-auto"
                            onClick={() =>
                                handleNavigation("/dashboard/messages")
                            }
                        >
                            Messages
                        </Button>
                    </li>
                    <li>
                        <Button
                            className="block text-xl mx-auto"
                            variant={"ghost"}
                            onClick={() =>
                                handleNavigation("/dashboard/partners")
                            }
                        >
                            Trouver un skill
                        </Button>
                    </li>
                </ul>
            </nav>

            <div className="mt-auto w-full">
                <Separator className="my-6 w-full" />
                <div className="flex items-center justify-center">
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        datatype="logout"
                    >
                        <LogOut className="mr-2" size={20} />
                        <span>Déconnexion</span>
                    </Button>
                </div>
            </div>
        </>
    );

    const unauthenticatedMenu = (
        <>
            <div className="w-full flex flex-col items-center mt-6">
                <div className="w-full max-w-md">
                    {showLogin ? (
                        <div className="p-6">
                            <Login
                                onSwitchToRegister={() => setShowLogin(false)}
                                handleLogin={handleLogin}
                            />
                        </div>
                    ) : (
                        <div className="p-6">
                            <Register
                                onSwitchToLogin={() => setShowLogin(true)}
                                handleLogin={handleLogin}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            {isNavigating && loadingSpinner}
            <header
                className={`w-full py-4 px-6 flex items-center justify-between`}
            >
                <div className="flex items-center grow">
                  
                        <Button
                            variant="ghost"
                            className="cursor-pointer md:w-24 md:h-24 w-16 h-16"
                            onClick={() => handleNavigation("/")}
                        >
                            <Image
                                src={logo}
                                alt="SkillSwap Logo"
                            />
                        </Button>
                    
                    <Button
                        variant="ghost"
                        className="cursor-pointer grow md:grow-0"
                        onClick={() => handleNavigation("/")}
                    >
                        <h1 className="text-center text-3xl lg:text-[40px]">SkillSwap</h1>
                    </Button>
                </div>

                <div>
                    <Button
                        variant="ghost"
                        onClick={toggleMenu}
                        className="flex items-center cursor-pointer justify-center md:w-16 md:h-16 w-12 h-12"
                        aria-label="Menu"
                        datatype="burger"
                    >
                        {isMenuOpen ? <X className="min-w-full min-h-full" /> : <Menu className="min-w-full min-h-full" />}
                    </Button>
                </div>

                {isMenuOpen && (
                    <div className="fixed inset-0 top-16 bg-background z-50 flex flex-col items-center p-6 overflow-y-auto">
                        <Separator className="my-4 w-full" />
                        {isAuthenticated
                            ? authenticatedMenu
                            : unauthenticatedMenu}
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
