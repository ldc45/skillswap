"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { User } from "@/@types/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { apiService } from "@/lib/services/apiService";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";

const defaultValues = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
};

const formSchema = z.object({
    email: z.string().email("L'email est invalide"),
    firstName: z.string().min(2).max(64),
    lastName: z.string().min(2).max(64),
    password: z.string().min(12, {
        message: "Le mot de passe doit contenir au moins 12 caractères",
    }),
    confirmPassword: z.string().min(12, {
        message: "Le mot de passe doit contenir au moins 12 caractères",
    }),
});

const lowercaseRegex = /[a-z]/;
const uppercaseRegex = /[A-Z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*]/;

interface RegisterProps {
    onSwitchToLogin?: () => void;
    handleLogin?: () => void;
}

const Register = ({ onSwitchToLogin, handleLogin }: RegisterProps) => {
    const [error, setError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);

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
        const { email, firstName, lastName, password, confirmPassword } = data;

        try {
            // Check if passwords match
            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas");
                return;
            }

            // We check that the password meets the security criteria
            // The check is made here and not in the schema,
            // so that the form can be submitted and an error message displayed
            if (
                !lowercaseRegex.test(password) ||
                !uppercaseRegex.test(password) ||
                !numberRegex.test(password) ||
                !specialCharRegex.test(password)
            ) {
                setError(
                    "Le mot de passe doit contenir au moins : une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial"
                );
                return;
            }

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
                    const userResponse =
                        await apiService.get<User>("/users/me");

                    // Update store with user data
                    login({ user: userResponse });

                    toast.success("Inscription réussie !", {
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
            console.error("Registration error:", err);
            setError(err instanceof Error ? err.message : "Registration error");
        } finally {
            // Reset the form but keep the values
            form.reset({}, { keepValues: true, keepDirty: false });
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 md:mb-10 lg:mb-12 text-center">
                S&apos;inscrire
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Jean"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Dupont"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>

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

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                <div className="relative">
                                    <Input
                                        type={
                                            isConfirmPasswordVisible
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
                                        aria-label="Visibilité du mot de passe répété"
                                        title={
                                            isConfirmPasswordVisible
                                                ? "Masquer le mot de passe répété"
                                                : "Afficher le mot de passe répété"
                                        }
                                        onClick={() =>
                                            setIsConfirmPasswordVisible(
                                                (prev) => !prev
                                            )
                                        }
                                    >
                                        {isConfirmPasswordVisible ? (
                                            <Eye />
                                        ) : (
                                            <EyeOff />
                                        )}
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            !form.formState.isValid ||
                            form.formState.isSubmitting
                        }
                    >
                        S&apos;inscrire
                    </Button>
                </form>
            </Form>

            {onSwitchToLogin && (
                <>
                    <Separator className="my-6" />
                    <div className="text-center">
                        <p className="mb-3">Déjà un compte ?</p>
                        <Button
                            variant="secondary"
                            onClick={onSwitchToLogin}
                            className="px-6 cursor-pointer"
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
