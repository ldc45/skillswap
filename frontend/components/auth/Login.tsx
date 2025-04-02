"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuthStore } from "@/lib/stores/authStore";
import { apiService } from "@/lib/services/apiService";

interface LoginProps {
  onSwitchToRegister?: () => void;
  handleLogin?: () => void;
}

const Login = ({ onSwitchToRegister, handleLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Utilisation du store d'authentification
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Appel API avec credentials: include pour envoyer/recevoir les cookies
      const responseData = await apiService.post("/auth/login", {
        email,
        password,
      });

      // Mise à jour du store local - Les cookies sont gérés automatiquement par le navigateur
      login({});

      if (handleLogin) {
        handleLogin();
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">Se connecter</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
