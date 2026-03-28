import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-[24px] py-[16px]">
      <Link
        href="/"
        className="text-[14px] font-medium tracking-tight text-text-secondary transition-colors duration-200 hover:text-text"
      >
        Finding My Zen
      </Link>
      <Link
        href="/auth/login"
        className="text-[14px] text-text-tertiary transition-colors duration-200 hover:text-text"
      >
        Sign in
      </Link>
    </header>
  );
}
