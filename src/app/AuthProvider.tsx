"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  auth,
  getUserDoc,
  getUIErrorFromFirebaseError,
  createUser,
} from "@/lib/firebase";
import { useTheme } from "next-themes";

interface UserSettings extends FirebaseUser {
  currentEmail?: string;
  updatedEmail?: string;
}

//type AuthError = { code: string; message: string } | null;

type AuthContextType = {
  user: UserSettings | null;
   setUser: (user: UserSettings | null) => void;
  //error: AuthError;
  register: (
    email: string,
    password: string
  ) => Promise<"ok" | "email-in-use" | "error">;
  login: (email: string, password: string) => Promise<"ok" | "error">;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserSettings | null>(null);
  //const [error, setError] = useState<AuthError>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
   const { setTheme } = useTheme();
   

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);

      if (fbUser?.uid) {
        try {
          let data = await getUserDoc(fbUser.uid);
          if (!data && fbUser.email) {
            await createUser(fbUser.email, fbUser.uid);
            data = await getUserDoc(fbUser.uid);
          }
          const saved = data?.theme;
          if (saved === "light" || saved === "dark" || saved === "system") {
            setTheme(saved);
          }
          setIsAdmin(Boolean(data?.admin === true));
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, [setTheme]);

  const register = async (email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUser(email, cred.user.uid);
      setUser(cred.user);
      return "ok";
    } catch (e: any) {
      return e?.code ?? "auth/unknown";
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return "ok";
    } catch (e: any) {
      return e?.code ?? "auth/unknown";
    }
  };

  const logout = async () => { await signOut(auth); };

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};