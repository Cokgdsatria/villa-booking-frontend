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
            await onSubmit(
                {
                    ...form,
                    totalRoom: Number(form.totalRoom),
                    bedroom: Number(form.bedroom),
                    bedroom: Number(form.bathroom),
                    priceMonthly: Number(form.priceMonthly),
                    priceYearly: Number(form.priceYearly),
                },
                files
            );
        } catch (error){
            console.error(error);
            alert("Gagal menyimpan property");
        }
    }



    return (
    <div className="flex justify-center py-10">
        <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-lg border">

        <h1 className="text-3xl font-bold mb-10 text-gray-800">
            {isEdit ? "Edit Property" : "Add New Property"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

            {/* BASIC INFORMATION */}
            <div>
            <h2 className="text-lg font-semibold mb-6 text-gray-600 uppercase tracking-wide">
                Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-6">

                {/* Property Name */}
                <div className="border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Property Name
                </label>
                <input
                    name="name"
                    placeholder="Your villa"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                />
                </div>

                {/* Type */}
                <div className="border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Type
                </label>
                <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                />
                </div>

                {/* Province */}
                <div className="border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Province
                </label>
                <input
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                />
                </div>

                {/* City */}
                <div className="border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    City
                </label>
                <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                />
                </div>

                {/* Address */}
                <div className="col-span-2 border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Address
                </label>
                <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                />
                </div>

                {/* Thumbnail URL */}
                <div className="col-span-2 border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    Thumbnail URL
                </label>
                <input
                    name="thumbnailUrl"
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

            <div className="grid grid-cols-3 gap-6">

                {["totalRoom", "bedroom", "bathroom"].map((field) => (
                <div
                    key={field}
                    className="border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition"
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
                    className="w-full outline-none bg-transparent"
                    />
                </div>
                ))}

                {["priceMonthly", "priceYearly"].map((field) => (
                <div
                    key={field}
                    className="border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition"
                >
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                    {field === "priceMonthly"
                        ? "Monthly Price"
                        : "Yearly Price"}
                    </label>
                    <input
                    type="number"
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
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

            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-10 text-center">
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
                className="cursor-pointer text-blue-600 font-semibold"
                >
                Click to upload photo
                </label>
            </div>

            {previewImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
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

            <div className="border border-gray-300 rounded-2xl p-4 focus-within:border-blue-500 transition">
                <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full outline-none bg-transparent resize-none"
                />
            </div>
            </div>


            {/* SUBMIT */}
            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition"
            >
            Create Property
            </button>

        </form>
        </div>
    </div>
    );

}