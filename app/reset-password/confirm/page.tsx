// app/reset-password/confirm/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordConfirm() {
  const supabase = createSupabaseBrowserClient();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handlePasswordReset = async () => {
    if (!token || !password) {
      setMessage("❌ Invalid link or missing password");
      return;
    }

    setLoading(true);
    setMessage("");

    // ✅ SAME LOGIC (no change)
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token!,
      type: "recovery",
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setMessage(`❌ ${updateError.message}`);
    } else {
      setMessage("✅ Password updated successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Set New Password
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          Please enter and confirm your new password
        </p>

        {/* New Password */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirm Password (UI ONLY) */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {confirmPassword.length > 0 && (
            <p
              className={`mt-1 text-sm ${
                passwordsMatch ? "text-green-600" : "text-red-600"
              }`}
            >
              {passwordsMatch
                ? "✔ Passwords match"
                : "✖ Passwords do not match"}
            </p>
          )}
        </div>

        <button
          onClick={handlePasswordReset}
          disabled={loading || !passwordsMatch}
          className="w-full mt-6 rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
