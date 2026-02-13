import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from './types';
import { api } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.login(credentials);
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
          const errorMessage = err.response?.data?.message || err.message || 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.register(userData);
          
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
          const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await api.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      fetchProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.getProfile();
          
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('Failed to fetch profile');
          }
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
          console.error('Fetch profile error:', error);
          set({ 
            isLoading: false,
            error: err.response?.data?.message || 'Failed to fetch profile',
          });
          
          // If unauthorized, clear auth state
          if (err.response?.status === 401) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.updateProfile(userData);
          
          if (response.success && response.data) {
            set({
              user: response.data,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || 'Failed to update profile');
          }
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } }; message?: string };
          const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
          set({ 
            error: errorMessage, 
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook untuk mudah akses auth state
export const useAuth = () => useAuthStore();
