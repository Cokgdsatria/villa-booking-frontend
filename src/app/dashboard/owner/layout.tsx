"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardActionButton from "@/components/navigation/DashboardActionButton";

interface OwnerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function OwnerDashboardLayout({
  children,
}: OwnerDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

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

  const displayName =
    authUser?.owner?.name || authUser?.name || authUser?.email || "User";

  const initials = useMemo(() => {
    const parts = String(displayName)
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || parts[0]?.[1] || "";
    return (first + second).toUpperCase();
  }, [displayName]);

  const menu = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard/owner" },
      { label: "Properties", href: "/dashboard/owner/properties" },
      { label: "Inquiries", href: "/dashboard/owner/inquiries" },
      { label: "Bookings", href: "/dashboard/owner/bookings" },
      { label: "Reviews", href: "/dashboard/owner/reviews" },
      { label: "Analytics", href: "/dashboard/owner/analytics" },
      { label: "Settings", href: "/dashboard/owner/settings" },
    ],
    []
  );

  const pageTitle = useMemo(() => {
    const current =
      menu.find((m) => pathname === m.href || pathname.startsWith(m.href + "/")) ||
      menu[0];
    return current.label;
  }, [menu, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/auth/login");
  };

  const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
    return (
      <aside className="relative h-full w-64 bg-white/70 backdrop-blur border-r border-white/60 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-900 text-white shadow-sm">
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
          <div className="text-lg font-semibold text-slate-900">VillaBook</div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menu.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`block px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-cyan-50 text-cyan-800 font-semibold border border-cyan-100"
                    : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-700 to-sky-700 flex items-center justify-center font-semibold text-white shadow-sm">
              {initials} 
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-600">
                {authUser?.role === "ADMIN" ? "Admin" : "Property Owner"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-sm text-rose-600 border border-rose-200 bg-white/70 rounded-xl py-2 hover:bg-rose-50 transition"
          >
            Logout
          </button>
        </div>
      </aside>
    );
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-xl">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative flex-1 flex flex-col">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl" />
        </div>
        {/* Topbar */}
        <header className="relative bg-white/70 backdrop-blur border-b border-white/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/60 bg-white/60 hover:bg-white transition"
              aria-label="Buka menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-base sm:text-lg font-semibold truncate text-slate-900">
              {pageTitle}
            </h1>
          </div>

          <DashboardActionButton />
        </header>

        {/* Page Content */}
        <section className="relative flex-1 p-4 sm:p-6">
          {children}
        </section>
      </main>
    </div>
  );
}
