"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const login = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      window.location.replace("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link
        href="/forgot-password"
        className="block text-center text-sm text-blue-600 hover:underline mt-4"
      >
        Forgot Password?
      </Link>

      {error && (
        <p className="text-red-600 mt-4 text-center">{error}</p>
      )}
    </div>
  );
}