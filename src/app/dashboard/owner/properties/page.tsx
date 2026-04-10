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
            <div className="p-6">
                <p>Loading...</p>
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
        <div className="p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daftar Properti</h1>
            </div>

            {/* CONTENT */}
            {properties.length === 0 ? (
                <div className="border rounded-xl p-6 text-center bg-white">
                    <p className="text-gray-500 mb-3">Belum ada properti yang ditambahkan.</p>
                    <Link
                        href="/dashboard/owner/properties/create"
                        className="text-blue-600 font-semibold"
                    >
                        Tambah Properti Sekarang
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div
                            key={property.id}
                            className="border rounded-xl p-4 shadow-sm bg-white"
                        >
                            <img
                                src={
                                    resolveAssetUrl(property.thumbnailUrl) ||
                                    "/images/villa-1.jpg"
                                }
                                alt={property.name}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/villa-1.jpg";
                                }}
                            />
                            <h2 className="font-semibold text-lg">{property.name}</h2>
                            <p className="text-gray-500">{property.city}, {property.province}</p>
                            <p className="text-blue-600 font-semibold mt-2">Rp {property.priceMonthly} / bulan</p>

                            <div className="flex gap-3 mt-4">
                                <Link
                                    href={`/dashboard/owner/properties/${property.id}`}
                                    className="px-3 py-1 text-sm bg-gray-200 rounded-lg"
                                >
                                    Detail
                                </Link>

                                <Link
                                    href={`/dashboard/owner/properties/${property.id}/edit`}
                                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(property.id)}
                                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                    >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
