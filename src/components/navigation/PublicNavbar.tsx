"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  owner?: { name?: string } | null;
};

export default function PublicNavbar() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return;
    try {
      setAuthUser(JSON.parse(raw));
    } catch {
      setAuthUser(null);
    }
  }, []);

  const displayName = useMemo(() => {
    return authUser?.owner?.name || authUser?.name || authUser?.email || null;
  }, [authUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/10">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              <path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            </svg>
          </span>
          <span>VillaBook</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-white/90">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <Link href="/#about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/public/properties" className="hover:text-white transition">
            Properties
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {displayName ? (
            <>
              <span className="hidden md:inline text-sm text-white/80">
                {displayName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
