"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const params = useSearchParams();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* 🔐 VERIFY TOKEN */
  useEffect(() => {
    const verify = async () => {
      const token = params.get("token");
      const email = params.get("email");

      if (!token || !email) {
        setError("Invalid or expired reset link.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token,
        type: "recovery",
        email,
      });

      if (error) {
        setError("Invalid or expired reset link.");
        return;
      }

      setReady(true);
    };

    verify();
  }, []);

  if (!ready && !error) return null;

  /* 🔑 UPDATE PASSWORD */
  const updatePassword = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password updated successfully 🎉");

    setTimeout(async () => {
      await supabase.auth.signOut();
      router.replace("/login");
    }, 1500);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Reset Password
      </h1>

      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      {!error && (
        <>
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            className="w-full border p-2 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={updatePassword}
            disabled={loading || password.length < 6}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {success && (
            <p className="text-green-600 mt-4 text-center">
              {success}
            </p>
          )}
        </>
      )}
    </div>
  );
}
