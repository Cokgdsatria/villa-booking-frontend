"use client"

import { useState } from "react";
import { useRouter } from "next/navigation"
import { createProperty } from "@/services/property.service";

export default function CreatePropertyPage() {
    const router = useRouter();

    const [form, setForm] = useState ({
        name: "",
        type: "",
        province: "",
        city: "",
        address: "",
        totalRoom: "",
        bedroom: "",
        bathroom: "",
        description: "",
        priceMonthly:"",
        priceYearly: "",
        thumbnailUrl: "",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

   const handleSubmit = async (e: any) => {
    e.pewventDefault();

    try {
        await createProperty({
            ...form,
            totalRoom: Number(form.totalRoom),
            bedroom: Number(form.bedroom),
            bathroom: Number(form.bathroom),
            priceMonthly: Number(form.priceMonthly),
            priceYearly: Number(form.priceYearly),
        });

        router.push("/dashboard/owner/properties");
    } catch (error) {
        alert("Gagal menambahkan property");
    } 
   };

    return (
        <div className="flex justify-center">
            <div className="max-w-4xl bg-white p-8 rounded-xl border shadow-sm">
                <h1 className="text-2xl font-bold mb-8">Tambah Properti</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {/* LEFT COLUMN */}
                    <div className="space-y-4">
                        <input
                            name="name"
                            placeholder="Nama Properti"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input
                            name="type"
                            placeholder="Tipe Properti (Villa / Apartment)"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input 
                            name="province"
                            placeholder="Provinsi"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input 
                            name="city"
                            placeholder="Kota"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input 
                            name="address"
                            placeholder="Alamat Lengkap"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <textarea 
                            name="description"
                            placeholder="Deskripsi Properti"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            rows={4}
                            required
                        />
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-4">

                        <input 
                            name="totalRoom"
                            type="number"
                            placeholder="Total Room"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input 
                            name="bathroom"
                            type="number"
                            placeholder="Bathroom"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input
                            name="priceMonthly"
                            type="number"
                            placeholder="Harga Bulanan"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input
                            name="priceYearly"
                            type="number"
                            placeholder="Harga Tahunan"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />

                        <input
                            name="thumbnailUrl"
                            placeholder="Thumbnail URL"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* BUTTON */}
                    <div className="col-span-2">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            Tambah Properti
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}