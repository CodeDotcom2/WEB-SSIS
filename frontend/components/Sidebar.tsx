"use client";

import { User, University, BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

      const res = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        alert("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="glass p-4 pt-14 flex flex-col shadow-lg">
      <h1 className="text-xl font-bold mb-6 text-center text-white">
        Student Information
      </h1>

      <div className="flex flex-col gap-6 flex-1">
        <Button
          className="p-8"
          asChild
          variant={pathname === "/dashboard/students" ? "blue" : "ghost"}
        >
          <Link href="/dashboard/students">
            <User className="mr-0 h-4 w-4" />
            Students
          </Link>
        </Button>

        <Button
          className="p-8"
          asChild
          variant={pathname === "/dashboard/colleges" ? "blue" : "ghost"}
        >
          <Link href="/dashboard/colleges">
            <University className="mr-0 h-4 w-4" />
            Colleges
          </Link>
        </Button>

        <Button
          className="p-8"
          asChild
          variant={pathname === "/dashboard/programs" ? "blue" : "ghost"}
        >
          <Link href="/dashboard/programs">
            <BookOpen className="mr-0 h-4 w-4" />
            Programs
          </Link>
        </Button>
      </div>

      <Button
        className="p-8 mt-auto"
        variant="destructive"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        <LogOut className="mr-0 h-4 w-4" />
        {loggingOut ? "Logging out..." : "Logout"}
      </Button>
    </aside>
  );
}
