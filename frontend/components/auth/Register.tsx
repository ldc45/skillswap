"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuthStore } from "@/lib/stores/authStore";

interface RegisterProps {
  onSwitchToLogin?: () => void;
  handleLogin?: () => void;
}

const Register = ({ onSwitchToLogin, handleLogin }: RegisterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Utilisation du store d'authentification
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification simple des mots de passe
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    // Simulation temporaire de l'inscription avec Zustand
    login({
      id: 1,
      email,
      first_name: "John",
      last_name: "Doe",
      avatar_url: "https://github.com/shadcn.png",
    });

    if (handleLogin) {
      handleLogin();
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        S&apos;inscrire
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          S&apos;inscrire
        </Button>
      </form>

      {onSwitchToLogin && (
        <>
          <Separator className="my-6" />
          <div className="text-center">
            <p className="mb-3">Déjà un compte ?</p>
            <Button
              variant="secondary"
              onClick={onSwitchToLogin}
              className="px-6"
            >
              Se connecter
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
