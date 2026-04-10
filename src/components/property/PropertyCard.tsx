"use client";

import { resolveAssetUrl } from "@/utils/url";

type Property = {
  id: string;
  name: string;
  province: string;
  city: string;
  priceMonthly: number;
  thumbnailUrl?: string | null;
};

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const imageUrl = resolveAssetUrl(property.thumbnailUrl) || "/images/villa-1.jpg";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">

      {/* IMAGE */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/images/villa-1.jpg";
          }}
        />

        {/* ACTION BUTTON (TOP RIGHT OVERLAY) */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
            ✏️
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
            🗑️
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{property.name}</h3>

        <p className="text-gray-500 text-sm">
          {property.city}, {property.province}
        </p>

        <p className="text-blue-600 font-bold mt-2">
          Rp {property.priceMonthly.toLocaleString()} / bulan
        </p>

        {/* BUTTONS */}
        <div className="mt-4 flex gap-2">
          <button className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
            Detail
          </button>

          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            Edit
          </button>

          <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
