"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOwnerProperties } from "@/services/property.service";
import { deleteProperty } from "@/services/property.service";
import { resolveAssetUrl } from "@/utils/url";

export default function OwnerPropertiesPage() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const data = await getOwnerProperties();
            setProperties(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-7 w-48 rounded-xl bg-white/60 backdrop-blur border border-white/60" />
                        <div className="mt-2 h-4 w-72 rounded-lg bg-white/50 backdrop-blur border border-white/50" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white/60 backdrop-blur border border-white/60 rounded-3xl overflow-hidden"
                        >
                            <div className="h-44 bg-slate-100" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 w-2/3 rounded-lg bg-slate-100" />
                                <div className="h-4 w-1/2 rounded-lg bg-slate-100" />
                                <div className="h-5 w-1/3 rounded-lg bg-slate-100" />
                                <div className="h-9 w-full rounded-xl bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Apakah kamu yakin ingin menghapus property ini?"
        );

        if (!confirmDelete) return;

        try {
            const result = await deleteProperty(id);

            // Refresh list setelah delete
            setProperties((prev) => prev.filter((p) => p.id !== id));

            if (result?.action === "INACTIVATED") {
                alert(result?.message || "Property dinonaktifkan.");
            }
        } catch (error) {
            console.error(error);
            const message =
                (error as any)?.response?.data?.message ||
                (error as any)?.message ||
                "Gagal menghapus property";
            alert(message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                        Daftar Properti
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Kelola villa kamu dengan nuansa resort: edit detail, lihat, atau nonaktifkan.
                    </p>
                </div>
                <Link
                    href="/dashboard/owner/properties/create"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-cyan-700 text-white hover:bg-cyan-800 shadow-sm transition text-sm font-semibold"
                >
                    + Tambah Properti
                </Link>
            </div>

            {/* CONTENT */}
            {properties.length === 0 ? (
                <div className="border border-white/60 bg-white/70 backdrop-blur rounded-3xl p-8 text-center shadow-[0_20px_60px_-40px_rgba(2,132,199,0.18)]">
                    <p className="text-slate-600 mb-4">
                        Belum ada properti yang ditambahkan.
                    </p>
                    <Link
                        href="/dashboard/owner/properties/create"
                        className="text-cyan-800 hover:text-cyan-900 hover:underline font-semibold"
                    >
                        Tambah Properti Sekarang
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div
                            key={property.id}
                            className="group border border-white/60 bg-white/70 backdrop-blur rounded-3xl overflow-hidden shadow-[0_20px_60px_-40px_rgba(2,132,199,0.18)]"
                        >
                            <div className="relative h-44 bg-slate-100 overflow-hidden">
                                <img
                                    src={
                                        resolveAssetUrl(property.thumbnailUrl) ||
                                        "/images/villa-1.jpg"
                                    }
                                    alt={property.name}
                                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src = "/images/villa-1.jpg";
                                    }}
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
                            </div>

                            <div className="p-5">
                                <h2 className="font-semibold text-lg text-slate-900 line-clamp-2">
                                    {property.name}
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    {property.city}, {property.province}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-900 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">
                                    Rp {Number(property.priceMonthly || 0).toLocaleString("id-ID")} / bulan
                                </div>

                            <div className="flex flex-wrap gap-2 mt-5">
                                <Link
                                    href={`/dashboard/owner/properties/${property.id}`}
                                    className="px-3 py-2 text-sm bg-white/70 border border-white/60 rounded-xl hover:bg-white transition text-slate-800"
                                >
                                    Detail
                                </Link>

                                <Link
                                    href={`/dashboard/owner/properties/${property.id}/edit`}
                                    className="px-3 py-2 text-sm bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl shadow-sm transition"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(property.id)}
                                    className="px-3 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition"
                                    >
                                    Delete
                                </button>
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
