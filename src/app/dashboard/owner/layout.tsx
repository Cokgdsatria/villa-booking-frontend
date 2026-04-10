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
      <aside className="relative h-full w-64 bg-white border-r flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600">VillaBook</div>

        <nav className="flex-1 px-4 space-y-1">
          {menu.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`block px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
              {initials} 
            </div>
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-gray-500">
                {authUser?.role === "ADMIN" ? "Admin" : "Property Owner"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-sm text-red-500 border border-red-300 rounded-lg py-2 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </aside>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50"
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

            <h1 className="text-base sm:text-lg font-semibold truncate">
              {pageTitle}
            </h1>
          </div>

          <DashboardActionButton />
        </header>

        {/* Page Content */}
        <section className="flex-1 p-4 sm:p-6">
          {children}
        </section>
      </main>
    </div>
  );
}
