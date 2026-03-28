"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  async function handleMagicLink() {
    setError("");
    if (!email) {
      setError("Enter your email first");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  if (magicLinkSent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-[16px]">
        <div className="w-full max-w-[320px] text-center">
          <p className="text-[18px] font-light text-text">Check your email</p>
          <p className="mt-[16px] text-[14px] text-text-secondary">
            We sent a magic link to <span className="text-text">{email}</span>
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="mt-[32px] text-[14px] text-text-tertiary transition-colors hover:text-text"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-[16px]">
      <div className="w-full max-w-[320px]">
        <h1 className="text-center text-[24px] font-light text-text">
          Welcome back
        </h1>
        <p className="mt-[8px] text-center text-[14px] text-text-secondary">
          Sign in to view your journal
        </p>

        <form onSubmit={handleLogin} className="mt-[32px] flex flex-col gap-[16px]">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-[24px] flex flex-col items-center gap-[16px]">
          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="text-[14px] text-text-secondary transition-colors hover:text-text"
          >
            Send magic link instead
          </button>

          <Link
            href="/auth/signup"
            className="text-[14px] text-text-tertiary transition-colors hover:text-text"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
