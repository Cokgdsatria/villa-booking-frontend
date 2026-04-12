"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOwnerInquiries } from "@/services/inquiry.service";

export default function OwnerInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading ] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const data = await getOwnerInquiries();
            setInquiries(data);
        } catch (error) {
            console.error("Gagal mengambil inquiries");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-7 w-48 rounded-xl bg-white/60 backdrop-blur border border-white/60" />
                <div className="bg-white/60 backdrop-blur border border-white/60 rounded-3xl overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-5 border-b border-white/50 last:border-b-0"
                        >
                            <div className="h-4 w-40 bg-slate-100 rounded-lg" />
                            <div className="mt-2 h-4 w-56 bg-slate-100 rounded-lg" />
                            <div className="mt-3 h-4 w-full bg-slate-100 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                    Semua Inquiry
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                    Kelola pesan calon tamu dan lanjutkan percakapan dengan nyaman.
                </p>
            </div>

            {inquiries.length === 0 ? (
                <div className="border border-white/60 bg-white/70 backdrop-blur rounded-3xl p-8 text-center">
                    <div className="text-slate-900 font-semibold">
                        Belum ada inquiry
                    </div>
                    <div className="text-sm text-slate-600 mt-2">
                        Saat ada calon tamu yang menghubungi, pesan akan muncul di sini.
                    </div>
                </div>
            ) : (
                <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 overflow-hidden shadow-[0_20px_60px_-40px_rgba(2,132,199,0.18)] divide-y divide-white/60">
                    {inquiries.map((inq) => (
                        <Link
                            key={inq.id}
                            href={`/dashboard/owner/inquiries/${inq.id}`}
                            className="block p-5 hover:bg-white/60 transition"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">
                                        {inq.name}
                                    </p>
                                    <p className="text-sm text-slate-600 truncate">
                                        {inq.property.name}
                                    </p>

                                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                        {inq.message}
                                    </p>
                                </div>

                                <span
                                    className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                                        inq.status === "PENDING"
                                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    }`}
                                >
                                    {inq.status === "PENDING" ? "PENDING" : "RESPONDED"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
