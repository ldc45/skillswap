"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
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
      // Use API service to call logout endpoint
      // and update local store
      await apiService.logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogin = () => {
    // Simply close the menu after login
    setIsMenuOpen(false);
  };

  // Close the menu during navigation
  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const authenticatedMenu = (
    <>
      <nav className="w-full mt-6">
        <ul className="space-y-6 text-center">
          <li>
            <Link
              href="/dashboard/profile"
              className="block text-xl hover:text-blue-500"
              onClick={handleNavigation}
            >
              Profil
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/messages"
              className="block text-xl hover:text-blue-500"
              onClick={handleNavigation}
            >
              Messages
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/partners"
              className="block text-xl hover:text-blue-500"
              onClick={handleNavigation}
            >
              Trouver un skill
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto w-full">
        <Separator className="my-6 w-full" />
        <div className="flex items-center justify-center">
          <Button variant="destructive" onClick={handleLogout}>
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
    <header className={`w-full py-4 px-6 flex items-center justify-between`}>
      <div className="flex items-center">
        <div className="mr-3">
          <Link href="/" onClick={handleNavigation}>
            <Image src={logo} alt="SkillSwap Logo" width={40} height={40} />
          </Link>
        </div>
        <Link href="/" onClick={handleNavigation}>
          <h1 className="text-4xl">SkillSwap</h1>
        </Link>
      </div>

      <div>
        <button
          onClick={toggleMenu}
          className="flex items-center justify-center w-10 h-10"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-50 flex flex-col items-center p-6 overflow-y-auto">
          <Separator className="my-4 w-full" />
          {isAuthenticated ? authenticatedMenu : unauthenticatedMenu}
        </div>
      )}
    </header>
  );
};

export default Header;