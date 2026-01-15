"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";

type NavbarProps = {
  isLoggedIn: boolean;
  role: "user" | "admin" | null;
};

export default function Navbar({ isLoggedIn, role }: NavbarProps) {
  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Supabase SSR Auth</h1>

      <nav className="flex gap-4 items-center">
        {/* GUEST */}
        {!isLoggedIn && (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Signup
            </Link>
          </>
        )}

        {/* USER */}
        {isLoggedIn && role === "user" && (
          <>
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
            <LogoutButton />
          </>
        )}

        {/* ADMIN */}
        {isLoggedIn && role === "admin" && (
          <>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
            <Link href="/admin/users" className="hover:underline">
              Manage Users
            </Link>
            <LogoutButton />
          </>
        )}
      </nav>
    </header>
  );
}
