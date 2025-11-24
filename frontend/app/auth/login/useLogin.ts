"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

interface LoginResponse {
  message: string;
  access_token: string;
}

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();
      console.log("Response from backend:", data);

      if (res.ok) {
        const token = data.access_token;

        if (token) {
          loginUser(token);
          console.log(
            "loginUser called, token set. Redirecting to dashboard..."
          );
          // Ensure navigation happens even if AuthContext state update is async
          router.push("/dashboard/students");
          alert("✅ " + data.message);
        } else {
          alert("❌ Login successful but no token received.");
        }
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleSubmit,
  };
}
