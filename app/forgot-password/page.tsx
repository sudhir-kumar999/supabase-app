"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createSupabaseBrowserClient();
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

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setEmailSent(true);
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === "Enter" && !loading) {
      sendResetLink();
    }
  };

  // Success state - email sent
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Check Your Email
          </h2>

          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium text-sm text-gray-700 mb-2">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Check your email inbox</li>
              <li>Click the reset password link</li>
              <li>Set your new password</li>
            </ol>
          </div>

          <p className="text-sm text-gray-500 mb-4">Didn't receive the email? Check your spam folder or try again.</p>

          <button
            onClick={() => {
              setEmailSent(false);
              setEmail("");
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Try another email
          </button>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          Enter your registered email to receive a password reset link
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={sendResetLink}
          disabled={loading}
          className="w-full mt-5 rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}