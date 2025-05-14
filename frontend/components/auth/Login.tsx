"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import type { User } from "@/@types/api/models/User";
import { apiService } from "@/lib/services/apiService";
import { useAuthStore } from "@/lib/stores/authStore";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";

const defaultValues = {
    email: "",
    password: "",
};

const formSchema = z.object({
    email: z.string().email("L'email est invalide"),
    password: z.string().min(12, {
        message: "Le mot de passe doit contenir au moins 12 caractères",
    }),
});

interface LoginProps {
    onSwitchToRegister?: () => void;
    handleLogin?: () => void;
}

const Login = ({ onSwitchToRegister, handleLogin }: LoginProps) => {
    const [error, setError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        // The zodResolver is inteatgrated to the form
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const login = useAuthStore((state) => state.login);

    // The form is dirty if at least one field has been modified
    const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;

    useEffect(() => {
        // We reset error message when the form is edited again post-submission
        if (isFormDirty) {
            setError("");
        }
    }, [isFormDirty]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const { email, password } = data;

        try {
            // Call API with credentials:include to send/receive cookies
            const loginResponse = await apiService.post("/auth/login", {
                email,
                password,
            });

            // Ensure login was successful before making the next request
            if (loginResponse) {
                try {
                    // Fetch connected user information
                    const userResponse =
                        await apiService.get<User>("/users/me");

                    // Update store with user data - userResponse already contains skills and availabilities
                    login({ user: userResponse as unknown as User });

                    toast.success("Connexion réussie !", {
                        position: "bottom-right",
                    });

                    if (handleLogin) {
                        handleLogin();
                    }
                } catch (userError) {
                    console.error(
                        "Error retrieving user information:",
                        userError
                    );

                    if (handleLogin) {
                        handleLogin();
                    }
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err instanceof Error ? err.message : "Login error");
        } finally {
            // Reset the form but keep the values
            form.reset({}, { keepValues: true, keepDirty: false });
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl md:text-32xl lg:text-4xl font-semibold mb-6 md:mb-10 lg:mb-12 text-center">
                Se connecter
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Form {...form}>
                <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="votre@email.com"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <div className="relative">
                                        <Input
                                            type={
                                                isPasswordVisible
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••••••"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="absolute right-2.5 -translate-y-1/2 top-1/2 h-4 w-4 text-muted-foreground"
                                            aria-label="Visibilité du mot de passe"
                                            title={
                                                isPasswordVisible
                                                    ? "Masquer le mot de passe"
                                                    : "Afficher le mot de passe"
                                            }
                                            onClick={() =>
                                                setIsPasswordVisible(
                                                    (prev) => !prev
                                                )
                                            }
                                        >
                                            {isPasswordVisible ? (
                                                <Eye />
                                            ) : (
                                                <EyeOff />
                                            )}
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            !form.formState.isValid ||
                            form.formState.isSubmitting
                        }
                    >
                        Se connecter
                    </Button>
                </form>
            </Form>

            {onSwitchToRegister && (
                <>
                    <Separator className="my-6" />
                    <div className="text-center">
                        <p className="mb-3">Pas encore de compte ?</p>
                        <Button
                            variant="secondary"
                            onClick={onSwitchToRegister}
                            className="px-6 cursor-pointer"
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
