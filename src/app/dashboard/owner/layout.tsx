"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface OwnerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function OwnerDashboardLayout({
  children,
}: OwnerDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { label: "Dashboard", href: "/dashboard/owner" },
    { label: "Properties", href: "/dashboard/owner/properties" },
    { label: "Inquiries", href: "/dashboard/owner/inquiries" },
    { label: "Bookings", href: "/dashboard/owner/bookings" },
    { label: "Reviews", href: "/dashboard/owner/reviews" },
    { label: "Analytics", href: "/dashboard/owner/analytics" },
    { label: "Settings", href: "/dashboard/owner/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* == SIDEBAR ==*/}
      <aside className="relative w-64 bg-white border-r flex flex-col">
        {/* Logo */}
        <div className="p-6 text-xl font-bold text-blue-600">
          VillaBook
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 space-y-1">
          {menu.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
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

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
              AH
            </div>
            <div>
              <p className="text-sm font-semibold">Ahmad Hidayat</p>
              <p className="text-xs text-gray-500">Property Owner</p>
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <Link
            href="/dashboard/owner/properties/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            + Tambah Properti
          </Link>
        </header>

        {/* Page Content */}
        <section className="flex-1 p-6">
          {children}
        </section>
      </main>
    </div>
  );
}
