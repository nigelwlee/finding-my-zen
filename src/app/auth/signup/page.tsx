"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-[16px]">
        <div className="w-full max-w-[320px] text-center">
          <p className="text-[18px] font-light text-text">Check your email</p>
          <p className="mt-[16px] text-[14px] text-text-secondary">
            We sent a confirmation link to{" "}
            <span className="text-text">{email}</span>
          </p>
          <Link
            href="/auth/login"
            className="mt-[32px] inline-block text-[14px] text-text-tertiary transition-colors hover:text-text"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-[16px]">
      <div className="w-full max-w-[320px]">
        <h1 className="text-center text-[24px] font-light text-text">
          Create account
        </h1>
        <p className="mt-[8px] text-center text-[14px] text-text-secondary">
          Track your daily reflections
        </p>

        <form onSubmit={handleSignup} className="mt-[32px] flex flex-col gap-[16px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-[8px] border border-border bg-white px-[16px] py-[12px] text-[16px] text-text placeholder:text-text-tertiary outline-none transition-colors focus:border-accent"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-[8px] border border-border bg-white px-[16px] py-[12px] text-[16px] text-text placeholder:text-text-tertiary outline-none transition-colors focus:border-accent"
          />

          {error && (
            <p className="text-center text-[14px] text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[8px] bg-accent py-[12px] text-[16px] text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="mt-[24px] text-center">
          <Link
            href="/auth/login"
            className="text-[14px] text-text-tertiary transition-colors hover:text-text"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
