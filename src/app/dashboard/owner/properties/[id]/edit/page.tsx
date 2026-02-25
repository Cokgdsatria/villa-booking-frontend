"use client";

import { useEffect, useState } from "react";
import {useRouter, useParams } from "next/navigation";
import {
    getPropertyDetail,
    updateProperty,
} from "@/services/property.service";

export default function EditPropertyPage() {
    const router = useRouter();
    const { id } = useParams();

    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        fetchProperty();
    }, []);

    const fetchProperty = async () => {
        try {
            const data = await getPropertyDetail(id as string);
            setForm(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await updateProperty(id as string, form);
            router.push("/dashboard/owner/properties");
        } catch (error) {
            console.error(error);
            alert("Gagal update property");
        }
    };

    if (!form) return <div>Loading...</div>;

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Edit Property</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                <input 
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-3 w-full rounded-xl"
                />

                <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="border p-3 w-full rounded-xl"
                />

                <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="border p-3 w-full rounded-xl"
                />

                <input
                    name="priceMonthly"
                    value={form.priceMonthly}
                    onChange={handleChange}
                    className="border p-3 w-full rounded-xl"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl"
                >
                    Update Property
                </button>
            </form>
        </div>
    );
}

