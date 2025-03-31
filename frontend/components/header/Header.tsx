"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LogOut, Menu, X } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effet pour bloquer le défilement du body quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`w-full py-4 px-6 flex items-center justify-between`}>
      <div className="flex items-center">
        <div className="mr-3">
          <Image 
            src="/logo.png" 
            alt="SkillSwap Logo" 
            width={40} 
            height={40} 
          />
        </div>
        <h1 className="text-4xl">SkillSwap</h1>
      </div>
      
      <div className="md:hidden">
        <button 
          onClick={toggleMenu}
          className="flex items-center justify-center w-10 h-10"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-50 flex flex-col items-center p-6">
          <Separator className="my-4 w-full" />
          <nav className="w-full mt-6">
            <ul className="space-y-6 text-center">
              <li><a href="#" className="block text-xl hover:text-blue-500">Profil</a></li>
              <li><a href="#" className="block text-xl hover:text-blue-500">Messages</a></li>
              <li><a href="#" className="block text-xl hover:text-blue-500">Trouver un skill</a></li>
            </ul>
          </nav>
          
          <div className="mt-auto w-full">
            <Separator className="my-6 w-full" />
            <div className="flex items-center justify-center">
            <Button variant="destructive">
              <LogOut className="mr-2" size={20} />
              <span>Déconnexion</span>
            </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header