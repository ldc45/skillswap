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

const menuItems = [
    { id: "profile", name: "Profil", path: "/dashboard/profile" },
    { id: "messages", name: "Messages", path: "/dashboard/messages" },
    {
        id: "partners",
        name: "Trouver votre partenaire",
        path: "/dashboard/partners",
    },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    // Use global loading state from authStore
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    // Using Zustand store instead of local state

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
            // Use API service to call logout endpoint
            // and update local store
            await apiService.logout();
            setIsMenuOpen(false);
            toast.success("Déconnexion réussie !", {
                position: "bottom-right",
            });
            // Redirect to home page after logout
            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handleLogin = () => {
        // Simply close the menu after login
        setIsMenuOpen(false);
    };

    // Close the menu during navigation
    const handleNavigation = (path: string) => {
        setIsMenuOpen(false);
        router.push(path);
    };

    const authenticatedMenu = (
        <>
            <nav className="w-full mt-6">
                <ul className="text-center flex flex-col gap-6 md:gap-12 justify-center items-center">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <Button
                                variant="ghost"
                                className="w-full cursor-pointer text-lg md:text-xl lg:text-2xl"
                                onClick={() => handleNavigation(item.path)}
                                datatype={item.name.toLowerCase()}
                            >
                                {item.name}
                            </Button>
                        </li>
                    ))}
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
                <div className="w-full max-w-md h-full">
                    <div className="p-6 flex w-full h-full flex-col items-center">
                        {showLogin ? (
                            <Login
                                onSwitchToRegister={() => setShowLogin(false)}
                                handleLogin={handleLogin}
                            />
                        ) : (
                            <Register
                                onSwitchToLogin={() => setShowLogin(true)}
                                handleLogin={handleLogin}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <header
                className={`w-full py-4 px-6 flex items-center justify-between`}
            >
                <div className="flex items-center grow">
                    <Button
                        variant="ghost"
                        className="cursor-pointer md:w-24 md:h-24 w-16 h-16"
                        onClick={() => handleNavigation("/")}
                    >
                        <Image src={logo} alt="SkillSwap Logo" />
                    </Button>

                    <Button
                        variant="ghost"
                        className="cursor-pointer grow md:grow-0"
                        onClick={() => handleNavigation("/")}
                    >
                        <h1 className="text-center text-3xl lg:text-[40px]">
                            SkillSwap
                        </h1>
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    onClick={toggleMenu}
                    className="flex items-center cursor-pointer justify-center md:w-16 md:h-16 w-12 h-12"
                    aria-label="Menu"
                    datatype="burger"
                >
                    {isMenuOpen ? (
                        <X className="min-w-full min-h-full" />
                    ) : (
                        <Menu className="min-w-full min-h-full" />
                    )}
                </Button>

                {isMenuOpen && (
                    <div className="fixed inset-0 top-16 md:top-24 bg-background z-50 flex flex-col items-center p-6 overflow-y-auto">
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
