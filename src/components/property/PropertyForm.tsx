"use client"

import { useState, type ChangeEvent, type FormEvent } from "react";


interface PropertyFormProps {
  initialData?: any;
  onSubmit: (data: any, files: FileList | null) => Promise<void>;
  isEdit?: boolean;
}

export default function PropertyForm({
    initialData,
    onSubmit,
    isEdit = false,
}: PropertyFormProps) {
    const [form, setForm] = useState({
        name: initialData?.name || "",
        type: initialData?.type || "",
        province: initialData?.province || "",
        city: initialData?.city || "",
        address: initialData?.address || "",
        totalRoom: initialData?.totalRoom || "",
        bedroom: initialData?.bedroom || "",
        bathroom: initialData?.bathroom || "",
        description: initialData?.description || "",
         priceMonthly: initialData?.priceMonthly || "",
        priceYearly: initialData?.priceYearly || "",
        priceNight: initialData?.priceNight || "",
        thumbnailUrl: initialData?.thumbnailUrl || "",
    });

    const [files, setFiles] = useState<FileList | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload = {
                ...form,
                name: String(form.name).trim(),
                type: String(form.type).trim(),
                province: String(form.province).trim(),
                city: String(form.city).trim(),
                address: String(form.address).trim(),
                description: String(form.description).trim(),
                totalRoom: Number(form.totalRoom),
                bedroom: Number(form.bedroom),
                bathroom: Number(form.bathroom),
                priceMonthly: Number(form.priceMonthly),
                priceYearly: Number(form.priceYearly),
                priceNight: Number(form.priceNight),
            };

            const missing: string[] = [];
            if (!payload.name) missing.push("Property Name");
            if (!payload.type) missing.push("Type");
            if (!payload.province) missing.push("Province");
            if (!payload.city) missing.push("City");
            if (!payload.description) missing.push("Description");
            if (!Number.isFinite(payload.totalRoom) || payload.totalRoom <= 0)
                missing.push("Total Room");
            if (!Number.isFinite(payload.bedroom) || payload.bedroom <= 0)
                missing.push("Bedroom");
            if (!Number.isFinite(payload.bathroom) || payload.bathroom <= 0)
                missing.push("Bathroom");
            if (!Number.isFinite(payload.priceMonthly) || payload.priceMonthly <= 0)
                missing.push("Monthly Price");
            if (!Number.isFinite(payload.priceYearly) || payload.priceYearly <= 0)
                missing.push("Yearly Price");
            if (!Number.isFinite(payload.priceNight) || payload.priceNight <= 0)
                missing.push("Night Price");

            if (missing.length > 0) {
                alert(`Field wajib belum lengkap: ${missing.join(", ")}`);
                return;
            }

            await onSubmit(payload, files);
        } catch (error){
            console.error(error);
            const message =
                (error as any)?.response?.data?.message ||
                (error as any)?.message ||
                "Gagal menyimpan property";
            alert(message);
        }
    }



    return (
    <div className="flex justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-5xl bg-white/70 backdrop-blur p-5 sm:p-10 rounded-3xl shadow-[0_20px_60px_-40px_rgba(2,132,199,0.25)] border border-white/60">

        <h1 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10 text-slate-900">
            {isEdit ? "Edit Property" : "Add New Property"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

            {/* BASIC INFORMATION */}
            <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-600 uppercase tracking-wide">
                Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* Property Name */}
                <div className="border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Property Name
                </label>
                <input
                    name="name"
                    placeholder="Contoh: Villa Ocean Breeze"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    required
                />
                </div>

                {/* Type */}
                <div className="border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Type
                </label>
                <input
                    name="type"
                    placeholder="Contoh: Villa"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    required
                />
                </div>

                {/* Province */}
                <div className="border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Province
                </label>
                <input
                    name="province"
                    placeholder="Contoh: Bali"
                    value={form.province}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    required
                />
                </div>

                {/* City */}
                <div className="border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    City
                </label>
                <input
                    name="city"
                    placeholder="Contoh: Ubud"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    required
                />
                </div>

                {/* Address */}
                <div className="sm:col-span-2 border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Address
                </label>
                <input
                    name="address"
                    placeholder="Contoh: Jl. Pantai No. 24"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                />
                </div>

                {/* Thumbnail URL */}
                <div className="sm:col-span-2 border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Thumbnail URL
                </label>
                <input
                    name="thumbnailUrl"
                    placeholder="https://..."
                    value={form.thumbnailUrl}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                />
                </div>

            </div>
            </div>


            {/* ROOM & PRICING */}
            <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-600 uppercase tracking-wide">
                Room & Pricing
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">

                {["totalRoom", "bedroom", "bathroom"].map((field) => (
                <div
                    key={field}
                    className="border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition"
                >
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    {field === "totalRoom"
                        ? "Total Room"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                    type="number"
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    placeholder={field === "totalRoom" ? "3" : field === "bedroom" ? "2" : "1"}
                    className="w-full outline-none bg-transparent"
                    required
                    />
                </div>
                ))}

                {["priceMonthly", "priceYearly", "priceNight"].map((field) => (
                <div
                    key={field}
                    className="border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition"
                >
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    {field === "priceMonthly"
                        ? "Monthly Price"
                        : field === "priceYearly"
                          ? "Yearly Price"
                          : "Night Price"}
                    </label>
                    <input
                    type="number"
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    placeholder={
                        field === "priceMonthly"
                            ? "7500000"
                            : field === "priceYearly"
                              ? "90000000"
                              : "350000"
                    }
                    className="w-full outline-none bg-transparent"
                    required
                    />
                </div>
                ))}

            </div>
            </div>


            {/* PHOTO UPLOAD */}
            <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-600 uppercase tracking-wide">
                Property Photos
            </h2>

            <div className="border-2 border-dashed border-cyan-300 bg-white/60 rounded-2xl p-6 sm:p-10 text-center">
                <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                    const selectedFiles = e.target.files;
                    if (!selectedFiles) return;

                    setFiles(selectedFiles);

                    const imageUrls = Array.from(selectedFiles).map((file) =>
                    URL.createObjectURL(file)
                    );

                    setPreviewImages(imageUrls);
                }}
                className="hidden"
                id="photoUpload"
                />

                <label
                htmlFor="photoUpload"
                className="cursor-pointer text-cyan-800 hover:text-cyan-900 font-semibold"
                >
                Click to upload photo
                </label>
            </div>

            {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {previewImages.map((src, index) => (
                    <img
                    key={index}
                    src={src}
                    alt="Preview"
                    className="h-28 w-full object-cover rounded-xl border"
                    />
                ))}
                </div>
            )}
            </div>


            {/* DESCRIPTION */}
            <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-600 uppercase tracking-wide">
                Description
            </h2>

            <div className="border border-slate-200 bg-white/80 rounded-2xl p-4 focus-within:border-cyan-600 focus-within:ring-4 focus-within:ring-cyan-200/40 transition">
                <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ceritakan suasana villa, view, akses, dan fasilitas unggulan..."
                rows={5}
                className="w-full outline-none bg-transparent resize-none"
                required
                />
            </div>
            </div>


            {/* SUBMIT */}
            <button
            type="submit"
            className="w-full bg-cyan-700 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-sky-700 transition shadow-sm"
            >
            Create Property
            </button>

        </form>
        </div>
    </div>
    );

}
