'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
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

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync user data with backend
  const syncUserWithBackend = async (firebaseUser) => {
    try {
      // Call the sync endpoint to ensure user exists in backend database
      const response = await api.post("/api/auth/sync");
      
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
        setError(err.message);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const register = async (name, email, password) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Sync with backend
      await syncUserWithBackend(userCredential.user);
      
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Sync with backend
      await syncUserWithBackend(userCredential.user);
      
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
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
      if (err.code === 'auth/configuration-not-found') {
        setError('Google sign-in is not properly configured. Please contact support or try another sign-in method.');
      } else {
        setError(err.message);
      }
      
      throw err;
    }
  };

  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await api.get("/api/auth/profile");
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put("/api/auth/profile", profileData);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
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