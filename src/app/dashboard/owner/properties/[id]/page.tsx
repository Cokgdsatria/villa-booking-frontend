"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPropertyDetail } from "@/services/property.service";
import { resolveAssetUrl } from "@/utils/url";

export default function PropertyDetailPage() {
    const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const [property, setProperty] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        fetchDetail(id);
    }, [id]);

    const fetchDetail = async (propertyId: string) => {
        try{
            const data = await getPropertyDetail(propertyId);
            setProperty(data);
        } catch (error) {
            console.error(error);
        }
    };
   
    if (!property) {
        return (
            <div className="space-y-6">
                <div className="h-7 w-56 rounded-xl bg-white/60 backdrop-blur border border-white/60" />
                <div className="h-80 rounded-3xl bg-white/60 backdrop-blur border border-white/60" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                    <Link
                        href="/dashboard/owner/properties"
                        className="inline-flex items-center text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
                    >
                        ← Kembali ke daftar
                    </Link>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900 truncate">
                        {property.name}
                    </h1>
                    <div className="mt-2 text-sm text-slate-600">
                        {property.city}, {property.province}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-900 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">
                        Rp {Number(property.priceMonthly || 0).toLocaleString("id-ID")} / bulan
                    </div>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl overflow-hidden shadow-[0_20px_60px_-40px_rgba(2,132,199,0.18)]">
                <div className="p-5 border-b border-white/60">
                    <div className="font-semibold text-slate-900">Galeri Foto</div>
                    <div className="text-sm text-slate-600 mt-1">
                        Thumbnail dan foto tambahan untuk tampilan customer.
                    </div>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="col-span-2 sm:col-span-3 lg:col-span-4 h-64 bg-slate-100 rounded-2xl overflow-hidden">
                            <img
                                src={resolveAssetUrl(property.thumbnailUrl) || "/images/villa-1.jpg"}
                                alt={property.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/villa-1.jpg";
                                }}
                            />
                        </div>

                        {(property.photos || []).length > 0 ? (
                            property.photos.map((photo: any) => (
                                <div key={photo.id} className="h-40 bg-slate-100 rounded-2xl overflow-hidden">
                                    <img
                                        src={resolveAssetUrl(photo.url) || "/images/villa-1.jpg"}
                                        alt="Photo"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = "/images/villa-1.jpg";
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-sm text-slate-600">
                                Belum ada foto tambahan selain thumbnail.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
