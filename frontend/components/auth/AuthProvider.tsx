"use client";

import { useEffect, useState } from "react";
import { User } from "@/@types/api";
import { apiService } from "@/lib/services/apiService";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const { login, isAuthenticated } = useAuthStore();

    useEffect(() => {
        const checkSession = async () => {
            // Check if the user is not already authenticated
            if (!isAuthenticated) {
                try {
                    // Attempt to fetch the user profile to verify if the session is active
                    const userResponse =
                        await apiService.get<User>("/users/me");

                    // If we receive a valid response, the session token is active
                    // We can automatically log in the user
                    if (userResponse && userResponse.id) {
                        login({ user: userResponse });
                    }
                } catch {
                    // If we encounter an error, it likely means the session has expired or the user is not logged in
                    // We do nothing, the user will remain logged out
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [login, isAuthenticated]);

    // Loading indicator during session verification
    if (isLoading) {
        return (
                <div className="flex flex-col justify-center items-center gap-2 flex-1">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">
                        Chargement...
                    </p>
                </div>
        );
    }

    return <>{children}</>;
}
