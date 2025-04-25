"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/services/apiService";
import { useAuthStore, UserWithRelations } from "@/lib/stores/authStore";

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
          const userResponse = await apiService.get<UserWithRelations>("/users/me");
          
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
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 z-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}