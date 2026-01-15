"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const signup = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        role: "user",
      });

      window.location.href = "/login";
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h1>

        <div className="space-y-4">
          <input
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-black"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-black"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signup}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {loading ? "Creating account..." : "Signup"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-black underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}