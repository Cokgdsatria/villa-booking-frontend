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
                    <button className="bg-cyan-700 text-white px-3 sm:px-4 py-2 rounded-xl text-sm hover:bg-sky-700 transition whitespace-nowrap shadow-sm">
                      <span className="sm:hidden">←</span>
                      <span className="hidden sm:inline">← Kembali</span>
                    </button>
                </Link>
            ) : null}
        </>
    );
}
