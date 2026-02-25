"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPropertyDetail } from "@/services/property.service";

export default function PropertyDetailPage() {
    const { id } = useParams();
    const [property, setProperty] = useState<any>(null);

    useEffect(() => {
        fetchDetail();
    }, []);

    const fetchDetail = async () => {
        try{
            const data = await getPropertyDetail(id);
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
            <div className="grid grod-cols-4 gap-4 mt-6">
                {property.photos.map((photo: any) => (
                    <img 
                        key={photo.id}
                        src={`http://localhost:5000${photo.url}`}
                    />
                ))}
            </div>
        </div>
    )
}