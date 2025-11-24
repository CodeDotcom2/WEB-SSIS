"use client";

// ❌ REMOVED: useState, useRouter - handled by useLogin hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
// 🔑 Import the hook
import { useLogin } from "./useLogin";

export default function LoginPage() {
  // 🔑 GET STATE AND HANDLER FROM HOOK
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <Card className="w-[400px] glass rounded-xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-white text-2xl font-bold">
          User Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/10 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/10 text-white placeholder-gray-400"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-400 text-center w-full">
          Enter your username and password to log in
        </p>
      </CardFooter>
    </Card>
  );
}
