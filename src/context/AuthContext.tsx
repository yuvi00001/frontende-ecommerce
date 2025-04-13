'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  UserCredential,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import api from '../utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  register: (name: string, email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  getUserProfile: () => Promise<any>;
  updateUserProfile: (profileData: any) => Promise<any>;
}

interface UserProfileResponse {
  role?: string;
  [key: string]: any;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync user data with backend
  const syncUserWithBackend = async (firebaseUser: User): Promise<UserProfileResponse | null> => {
    try {
      // Call the sync endpoint to ensure user exists in backend database
      const response = await api.post<UserProfileResponse>("/api/auth/sync");
      
      // Check if user is admin
      if (response.data && response.data.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      return response.data;
    } catch (err) {
      console.error("Failed to sync user with backend:", err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Sync with backend
          await syncUserWithBackend(firebaseUser);
          setUser(firebaseUser);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const register = async (name: string, email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Sync with backend
      await syncUserWithBackend(userCredential.user);
      
      return userCredential;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Sync with backend
      await syncUserWithBackend(userCredential.user);
      
      return userCredential;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<UserCredential> => {
    try {
      setError(null);
      console.log("Starting Google sign-in process...");
      
      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log("Google provider configured, attempting sign in...");
      const userCredential = await signInWithPopup(auth, provider);
      
      // Sync with backend
      await syncUserWithBackend(userCredential.user);
      
      return userCredential;
    } catch (err) {
      console.error("Google sign-in error:", err);
      
      // More user-friendly error message
      let errorMessage = 'Google sign-in failed';
      if (err instanceof Error) {
        if ((err as any).code === 'auth/configuration-not-found') {
          errorMessage = 'Google sign-in is not properly configured. Please contact support or try another sign-in method.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await api.get("/api/auth/profile");
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user profile';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUserProfile = async (profileData: any) => {
    try {
      const response = await api.put("/api/auth/profile", profileData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user profile';
      setError(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAdmin,
    register,
    login,
    loginWithGoogle,
    logout,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 