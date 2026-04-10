"use client";

import { useEffect, useState } from "react";
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
   
    if (!property) return <div>Loading...</div>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{property.name}</h1>
            <p>{property.city}, {property.province}</p>
            <p className="text-blue-600 font-semibold">Rp {property.priceMonthly} / bulan </p>
            <div className="grid grid-cols-4 gap-4 mt-6">
                {property.photos.map((photo: any) => (
                    <img 
                        key={photo.id}
                        src={resolveAssetUrl(photo.url) || "/images/villa-1.jpg"}
                        alt=""
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    )
}
