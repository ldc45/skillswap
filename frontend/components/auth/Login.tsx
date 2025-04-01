"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuthStore } from "@/lib/stores/authStore";

interface LoginProps {
  onSwitchToRegister?: () => void;
  handleLogin?: () => void;
}

const Login = ({ onSwitchToRegister, handleLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Utilisation du store d'authentification
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulation temporaire de la connexion avec Zustand
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
      <h2 className="text-2xl font-semibold mb-6 text-center">Se connecter</h2>

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

        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>

      {onSwitchToRegister && (
        <>
          <Separator className="my-6" />
          <div className="text-center">
            <p className="mb-3">Pas encore de compte ?</p>
            <Button
              variant="secondary"
              onClick={onSwitchToRegister}
              className="px-6"
            >
              S&apos;inscrire
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
