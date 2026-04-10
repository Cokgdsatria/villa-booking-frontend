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
    <header className="sticky top-0 z-40 bg-gray-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">
          VillaBook
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/#about" className="hover:underline">
            About
          </Link>
          <Link href="/public/properties" className="hover:underline">
            Properties
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {displayName ? (
            <>
              <span className="hidden sm:inline text-sm text-white/90">
                {displayName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
