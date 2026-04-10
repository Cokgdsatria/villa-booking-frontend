"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardActionButton() {
    const pathname = usePathname();

    const isCreate = pathname === "/dashboard/owner/properties/create";

    const isEdit = 
        pathname.startsWith ("/dashboard/owner/properties/") && 
        pathname.endsWith("/edit");

    const isFormPage = isCreate || isEdit;

    return (
        <>
            {isFormPage ? (
                <Link href="/dashboard/owner/properties">
                    <button className="bg-gray-200 px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition whitespace-nowrap">
                      <span className="sm:hidden">←</span>
                      <span className="hidden sm:inline">← Kembali</span>
                    </button>
                </Link>
            ) : (
                <Link href="/dashboard/owner/properties/create">
                    <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition whitespace-nowrap">
                        <span className="sm:hidden">+ Tambah</span>
                        <span className="hidden sm:inline">+ Tambah Properti</span>
                    </button>
                </Link>
            )}
        </>
    );
}
