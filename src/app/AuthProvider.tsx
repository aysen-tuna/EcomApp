"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, getUserDoc, createUser } from "@/lib/firebase/firebase";
import { useTheme } from "next-themes";

type ThemePreference = "light" | "dark" | "system";

type AuthContextType = {
  user: FirebaseUser | null;
  setUser: (user: FirebaseUser | null) => void;
  register: (email: string, password: string) => Promise<"ok" | string>;
  login: (email: string, password: string) => Promise<"ok" | string>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const { theme, setTheme } = useTheme();

  const currentTheme: ThemePreference =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);

      if (!fbUser?.uid) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        let data = await getUserDoc(fbUser.uid);

        if (!data && fbUser.email) {
          await createUser(fbUser.email, fbUser.uid, currentTheme);
          data = await getUserDoc(fbUser.uid);
        }

        const savedTheme = data?.theme;
        if (
          savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "system"
        ) {
          setTheme(savedTheme);
        }

        setIsAdmin(Boolean(data?.admin === true));
      } catch {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentTheme, setTheme]);

  const register: AuthContextType["register"] = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUser(email, cred.user.uid, currentTheme);
      setUser(cred.user);

      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) return "session-failed";
      return "ok";
    } catch (e: any) {
      return e?.code ?? "auth/unknown";
    }
  };

  const login: AuthContextType["login"] = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) return "session-failed";
      return "ok";
    } catch (e: any) {
      return e?.code ?? "auth/unknown";
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, register, login, logout, loading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
