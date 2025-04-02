import { useAuthStore } from "../stores/authStore";

const API_URL = "http://localhost:4000/api";

// Variable pour suivre si une demande de rafraîchissement est en cours
let isRefreshing = false;
// File d'attente des requêtes en attente pendant le rafraîchissement du token
let refreshQueue: Array<() => void> = [];

/**
 * Traite la file d'attente des requêtes avec le nouveau token
 */
const processQueue = () => {
  refreshQueue.forEach((callback) => callback());
  refreshQueue = [];
};

/**
 * Service pour gérer les appels API avec authentification
 */
export const apiService = {
  /**
   * Rafraîchit le token d'accès en utilisant le refresh token stocké dans les cookies
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important pour inclure les cookies
      });
      
      if (!response.ok) {
        throw new Error("Échec du rafraîchissement du token");
      }
      
      // Nous n'avons plus besoin de gérer le token manuellement
      // il est dans les cookies HttpOnly
      return true;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      return false;
    }
  },

  /**
   * Effectue une requête API avec authentification par cookies
   */
  async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Inclure les cookies dans chaque requête
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Important pour inclure les cookies
    };
    
    // Première tentative de requête
    let response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Si le token est expiré (401 Unauthorized)
    if (response.status === 401) {
      // Si un rafraîchissement est déjà en cours, on met cette requête en file d'attente
      if (isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          refreshQueue.push(() => {
            this.fetch<T>(endpoint, options)
              .then(resolve)
              .catch(reject);
          });
        });
      }
      
      // Sinon on lance le processus de rafraîchissement
      isRefreshing = true;
      
      try {
        const refreshSuccess = await this.refreshToken();
        
        if (!refreshSuccess) {
          // Si le rafraîchissement échoue, on déconnecte l'utilisateur
          const { logout } = useAuthStore.getState();
          logout();
          isRefreshing = false;
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        
        // Rafraîchissement réussi, on traite la file d'attente
        isRefreshing = false;
        processQueue();
        
        // On réessaie la requête originale
        response = await fetch(`${API_URL}${endpoint}`, config);
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    }
    
    // Vérifier si la réponse est OK
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Une erreur s'est produite",
      }));
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    // Si la réponse est No Content (204)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  },

  /**
   * Méthodes HTTP
   */
  get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  },
  
  /**
   * Déconnexion - efface les cookies côté serveur
   */
  logout(): Promise<void> {
    return this.post('/auth/logout')
      .then(() => {
        // Mise à jour du store local après déconnexion du serveur
        const { logout } = useAuthStore.getState();
        logout();
      });
  }
};