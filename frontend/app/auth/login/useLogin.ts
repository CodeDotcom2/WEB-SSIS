"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function useLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      console.log("Response from backend:", data)

      if (res.ok) {
        alert("✅ " + data.message)
        router.push("/dashboard/students") // redirect after login success
      } else {
        alert("❌ " + data.message)
      }
    } catch (err) {
      console.error("Error:", err)
      alert("⚠️ Could not connect to backend")
    } finally {
      setLoading(false)
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleSubmit,
  }
}
