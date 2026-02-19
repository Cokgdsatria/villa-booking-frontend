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

    if (loading) return <p>Loading...</p>

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Semua Inquiry</h1>

            <div className="bg-white rounded-xl border divide-y">
            {inquiries.map((inq) => (
                <Link
                key={inq.id}
                href={`/dashboard/owner/inquiries/${inq.id}`}
                className="block p-4 hover:bg-gray-50"
                >
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                    <p className="font-semibold">{inq.name}</p>
                    <p className="text-sm text-gray-500">
                        {inq.property.name}
                    </p>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {inq.message}
                    </p>
                    </div>

                    <span
                    className={`text-xs px-3 py-1 rounded-full ${
                        inq.status === "PENDING"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                    >
                    {inq.status}
                    </span>
                </div>
                </Link>
            ))}
            </div>
        </div>
    );
}