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
                    <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition">
                      ← Kembali  
                    </button>
                </Link>
            ) : (
                <Link href="/dashboard/owner/properties/create">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                        + Tambah Properti
                    </button>
                </Link>
            )}
        </>
    );
}