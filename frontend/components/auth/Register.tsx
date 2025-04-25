"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuthStore, UserWithRelations } from "@/lib/stores/authStore";
import { apiService } from "@/lib/services/apiService";

interface RegisterProps {
  onSwitchToLogin?: () => void;
  handleLogin?: () => void;
}

const Register = ({ onSwitchToLogin, handleLogin }: RegisterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const registerResponse = await apiService.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });

      // Ensure registration was successful before making the next request
      if (registerResponse) {
        try {
          // Fetch connected user information
          const userResponse = await apiService.get<UserWithRelations>("/users/me");

          // Update store with user data
          login({ user: userResponse });

          if (handleLogin) {
            handleLogin();
          }
        } catch (userError) {
          console.error("Error retrieving user information:", userError);

          if (handleLogin) {
            handleLogin();
          }
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration error");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        S&apos;inscrire
      </h2>

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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Prénom"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Nom"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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