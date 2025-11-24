"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  loginUser: (token: string) => void;
  logoutUser: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    console.log("[AuthProvider] storedToken on mount:", storedToken);
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const loginUser = (newToken: string) => {
    console.log("[AuthProvider] loginUser storing token:", newToken);
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    router.push("/dashboard/students");
  };

  const logoutUser = async () => {
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout error (token may already be expired):", error);
      }
    }

    console.log("[AuthProvider] logoutUser clearing token");
    localStorage.removeItem("access_token");
    setToken(null);
    router.push("/auth/login");
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ token, loginUser, logoutUser, isLoggedIn, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
