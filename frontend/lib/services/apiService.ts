import { useAuthStore } from "../stores/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Track if a refresh request is in progress
let isRefreshing = false;
// Queue of pending requests during token refresh
let refreshQueue: Array<() => void> = [];

// Process the queue of requests with the new token
const processQueue = () => {
    refreshQueue.forEach((callback) => callback());
    refreshQueue = [];
};

// Service to handle API calls with authentication
export const apiService = {
    // Refresh the access token using the refresh token stored in cookies
    async refreshToken(): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Important for including cookies
            });

            if (!response.ok) {
                throw new Error("Token refresh failed");
            }

            return true;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }
    },

    // Perform an API request with cookie authentication
    async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Include cookies in each request
        const config: RequestInit = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            credentials: "include" as RequestCredentials, // Important for including cookies
        };

        // First request attempt
        let response = await fetch(`${API_URL}${endpoint}`, config);

        // If token is expired (401 Unauthorized)
        if (response.status === 401) {
            // If refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise<T>((resolve, reject) => {
                    refreshQueue.push(() => {
                        this.fetch<T>(endpoint, options)
                            .then(resolve)
                            .catch(reject);
                    });
                });
            }

            // Start the refresh process
            isRefreshing = true;

            try {
                const refreshSuccess = await this.refreshToken();

                if (!refreshSuccess) {
                    // If refresh fails, log out the user
                    const { logout } = useAuthStore.getState();
                    logout();
                    isRefreshing = false;
                    throw new Error("Session expired, please log in again");
                }

                // Refresh successful, process the queue
                isRefreshing = false;
                processQueue();

                // Retry the original request
                response = await fetch(`${API_URL}${endpoint}`, config);
            } catch (error) {
                isRefreshing = false;
                throw error;
            }
        }

        // Check if the response is OK
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: "An error occurred",
            }));
            throw new Error(error.message || `Error ${response.status}`);
        }

        // If the response is No Content (204)
        if (response.status === 204) {
            return {} as T;
        }

        return await response.json();
    },

    // HTTP methods
    get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.fetch<T>(endpoint, { ...options, method: "GET" });
    },

    post<T, U = unknown>(
        endpoint: string,
        data?: U,
        options: RequestInit = {}
    ): Promise<T> {
        return this.fetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    put<T, U = unknown>(
        endpoint: string,
        data?: U,
        options: RequestInit = {}
    ): Promise<T> {
        return this.fetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    patch<T, U = unknown>(
        endpoint: string,
        data?: U,
        options: RequestInit = {}
    ): Promise<T> {
        return this.fetch<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
    },

    // Logout - clear cookies on server side
    logout(): Promise<void> {
        return this.post("/auth/logout").then(() => {
            // Update local store after server logout
            const { logout } = useAuthStore.getState();
            logout();
        });
    },
};
