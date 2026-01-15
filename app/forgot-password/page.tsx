"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const sendResetLink = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/forgot-password", { email });
      setEmailSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendResetLink();
    }
  };

  // ✅ SUCCESS UI
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="mt-2 text-gray-600">
            If <b>{email}</b> is registered, a reset link has been sent.
          </p>
          <button
            className="mt-4 text-blue-600"
            onClick={() => {
              setEmail("");
              setEmailSent(false);
            }}
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  // ✅ FORM UI
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyPress}
          className="w-full mt-4 border px-3 py-2 rounded"
        />

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <button
          onClick={sendResetLink}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}