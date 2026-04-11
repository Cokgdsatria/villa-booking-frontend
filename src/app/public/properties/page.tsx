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
    <div className="min-h-screen">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Jelajahi Villa Tropis
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Gunakan filter untuk menemukan villa yang terasa pas: lokasi, tipe, jumlah
          kamar, dan rentang harga.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 border border-white/60 bg-white/70 backdrop-blur rounded-3xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 shadow-[0_20px_60px_-40px_rgba(2,132,199,0.25)]"
        >
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="md:col-span-4 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
          />
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Property Type"
            className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
          />
          <input
            value={totalRoom}
            onChange={(e) => setTotalRoom(e.target.value)}
            placeholder="Total Room"
            className="md:col-span-2 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
            inputMode="numeric"
          />
          <select
            value={billingType}
            onChange={(e) =>
              setBillingType(e.target.value as "MONTHLY" | "YEARLY")
            }
            className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>

          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
            className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
            inputMode="numeric"
          />
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
            inputMode="numeric"
          />
          <button
            type="submit"
            className="md:col-span-2 w-full bg-cyan-700 text-white rounded-xl px-4 py-3 hover:bg-cyan-800 shadow-sm"
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
            className="md:col-span-2 w-full border border-white/60 bg-white/70 backdrop-blur rounded-xl px-4 py-3 hover:bg-white"
          >
            Reset
          </button>
        </form>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-80 border border-white/60 bg-white/60 backdrop-blur rounded-3xl"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white/80 backdrop-blur border border-white/60 rounded-3xl overflow-hidden hover:shadow-[0_20px_60px_-40px_rgba(2,132,199,0.35)] transition"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={resolveAssetUrl(p.thumbnailUrl) || "/images/villa-1.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/villa-1.jpg";
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent" />
                  </div>

                  <div className="p-5">
                    <div className="font-semibold text-slate-900 line-clamp-2">
                      {p.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {p.city}, {p.province}
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-900 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">
                      IDR{" "}
                      {(billingType === "MONTHLY"
                        ? p.priceMonthly
                        : p.priceYearly
                      )?.toLocaleString("id-ID")}
                      {billingType === "MONTHLY" ? "/Mo" : "/Yr"}
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      {p.bedroom} Bedroom • {p.bathroom} Bathroom • {p.totalRoom} Room
                    </div>

                    <Link
                      href={`/public/properties/${p.id}`}
                      className="mt-5 inline-flex items-center text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
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
                className="px-3 py-2 rounded-xl border border-white/60 bg-white/70 backdrop-blur disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm text-slate-600">
                Page {page} / {totalPages}
              </div>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded-xl border border-white/60 bg-white/70 backdrop-blur disabled:opacity-50"
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
