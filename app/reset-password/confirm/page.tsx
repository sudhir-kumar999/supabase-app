"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordConfirm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handlePasswordReset = async () => {
    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Something went wrong");
    } else {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  // ✅ SUCCESS UI
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold text-green-600">
            Password Updated!
          </h2>
          <p className="mt-2 text-gray-600">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // ✅ FORM UI
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center">
          Set New Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="w-full mt-4 border px-3 py-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
          className="w-full mt-3 border px-3 py-2 rounded"
        />

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <button
          onClick={handlePasswordReset}
          disabled={loading || !passwordsMatch}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
