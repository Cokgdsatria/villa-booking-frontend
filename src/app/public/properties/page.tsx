"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { resolveAssetUrl } from "@/utils/url";
import { searchPublicProperties, type PublicPropertyListItem } from "@/services/property.service";

function PublicPropertiesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<PublicPropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [totalRoom, setTotalRoom] = useState(searchParams.get("totalRoom") || "");
  const [billingType, setBillingType] = useState<"MONTHLY" | "YEARLY">(
    (searchParams.get("billingType") as any) || "MONTHLY"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const [page, setPage] = useState<number>(Number(searchParams.get("page") || 1));
  const limit = 9;
  const [totalPages, setTotalPages] = useState(1);

  const queryKey = useMemo(() => {
    return [
      location,
      type,
      totalRoom,
      billingType,
      minPrice,
      maxPrice,
      page,
    ].join("|");
  }, [location, type, totalRoom, billingType, minPrice, maxPrice, page]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await searchPublicProperties({
          location: location.trim() || undefined,
          type: type.trim() || undefined,
          totalRoom: totalRoom ? Number(totalRoom) : undefined,
          billingType,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          page,
          limit,
          sort: "name",
          order: "desc",
        });
        setItems(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [queryKey]);

  const applyToUrl = (nextPage: number) => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (type.trim()) params.set("type", type.trim());
    if (totalRoom) params.set("totalRoom", totalRoom);
    if (billingType) params.set("billingType", billingType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("page", String(nextPage));
    router.push(`/public/properties?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    applyToUrl(1);
  };

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages, p));
    setPage(clamped);
    applyToUrl(clamped);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Villa</h1>
        <p className="text-gray-600 mt-1">
          Filter lokasi, tipe properti, dan harga untuk menemukan villa yang sesuai.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white border rounded-2xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-3"
        >
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="md:col-span-4 w-full border rounded-lg px-4 py-2"
          />
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Property Type"
            className="md:col-span-3 w-full border rounded-lg px-4 py-2"
          />
          <input
            value={totalRoom}
            onChange={(e) => setTotalRoom(e.target.value)}
            placeholder="Total Room"
            className="md:col-span-2 w-full border rounded-lg px-4 py-2"
            inputMode="numeric"
          />
          <select
            value={billingType}
            onChange={(e) =>
              setBillingType(e.target.value as "MONTHLY" | "YEARLY")
            }
            className="md:col-span-3 w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>

          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
            className="md:col-span-3 w-full border rounded-lg px-4 py-2"
            inputMode="numeric"
          />
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="md:col-span-3 w-full border rounded-lg px-4 py-2"
            inputMode="numeric"
          />
          <button
            type="submit"
            className="md:col-span-2 w-full bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800"
          >
            Update Search
          </button>
          <button
            type="button"
            onClick={() => {
              setLocation("");
              setType("");
              setTotalRoom("");
              setMinPrice("");
              setMaxPrice("");
              setBillingType("MONTHLY");
              setPage(1);
              router.push("/public/properties");
            }}
            className="md:col-span-2 w-full border rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            Reset
          </button>
        </form>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-80 bg-white border rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border rounded-2xl overflow-hidden"
                >
                  <div className="h-44 bg-gray-100">
                    <img
                      src={resolveAssetUrl(p.thumbnailUrl) || "/images/villa-1.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/villa-1.jpg";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="font-semibold text-gray-900 line-clamp-2">
                      {p.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {p.city}, {p.province}
                    </div>

                    <div className="mt-3 text-sm font-semibold text-gray-900">
                      IDR{" "}
                      {(billingType === "MONTHLY" ? p.priceMonthly : p.priceYearly)?.toLocaleString(
                        "id-ID"
                      )}
                      {billingType === "MONTHLY" ? "/Mo" : "/Yr"}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {p.bedroom} Bedroom • {p.bathroom} Bathroom • {p.totalRoom} Room
                    </div>

                    <Link
                      href={`/public/properties/${p.id}`}
                      className="mt-4 inline-flex items-center text-sm text-blue-600 hover:underline"
                    >
                      View Detail →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-md border disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm text-gray-600">
                Page {page} / {totalPages}
              </div>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-md border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function PublicPropertiesPage() {
  return (
    <Suspense fallback={null}>
      <PublicPropertiesPageInner />
    </Suspense>
  );
}
