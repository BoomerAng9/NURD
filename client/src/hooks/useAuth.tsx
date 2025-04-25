// Replit Auth has been removed
// This is just a placeholder to avoid breaking existing imports
import { type User } from "@shared/schema";

export function useAuth() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null
  };
}