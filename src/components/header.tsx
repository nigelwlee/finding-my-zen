import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between px-[24px] py-[16px]">
      <Link
        href="/"
        className="text-[14px] font-medium tracking-tight text-text-secondary transition-colors duration-200 hover:text-text"
      >
        Finding My Zen
      </Link>
      {user ? (
        <div className="flex items-center gap-[16px]">
          <Link
            href="/journal"
            className="text-[14px] text-text-tertiary transition-colors duration-200 hover:text-text"
          >
            Journal
          </Link>
          <SignOutButton />
        </div>
      ) : (
        <Link
          href="/auth/login"
          className="text-[14px] text-text-tertiary transition-colors duration-200 hover:text-text"
        >
          Sign in
        </Link>
      )}
    </header>
  );
}

function SignOutButton() {
  return (
    <form action="/auth/signout" method="POST">
      <button
        type="submit"
        className="text-[14px] text-text-tertiary transition-colors duration-200 hover:text-text"
      >
        Sign out
      </button>
    </form>
  );
}
