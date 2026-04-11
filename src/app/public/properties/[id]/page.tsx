"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { getPropertyDetail } from "@/services/property.service";
import { resolveAssetUrl } from "@/utils/url";

type BillingType = "MONTHLY" | "YEARLY";

export default function PublicPropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [checkOut, setCheckOut] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [guests, setGuests] = useState(1);
  const [billingType, setBillingType] = useState<BillingType>("MONTHLY");

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getPropertyDetail(params.id);
        setProperty(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params.id]);

  const priceText = useMemo(() => {
    if (!property) return "-";
    const price =
      billingType === "MONTHLY" ? property.priceMonthly : property.priceYearly;
    const suffix = billingType === "MONTHLY" ? "/Mo" : "/Yr";
    return `IDR ${Number(price || 0).toLocaleString("id-ID")}${suffix}`;
  }, [billingType, property]);

  const handleContinue = () => {
    const paramsQS = new URLSearchParams();
    paramsQS.set("checkIn", checkIn);
    paramsQS.set("checkOut", checkOut);
    paramsQS.set("guests", String(guests));
    paramsQS.set("billingType", billingType);
    router.push(`/public/checkout/${params.id}?${paramsQS.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <PublicNavbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-10 w-48 bg-white/70 backdrop-blur border border-white/60 rounded-xl" />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-white/70 backdrop-blur border border-white/60 rounded-3xl" />
            <div className="h-96 bg-white/70 backdrop-blur border border-white/60 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen">
        <PublicNavbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl p-6">
            <div className="font-semibold text-slate-900">Property tidak ditemukan</div>
          </div>
        </div>
      </div>
    );
  }

  const photos = Array.isArray(property.photos) ? property.photos : [];

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-sm text-slate-600">
          {property.city}, {property.province}
        </div>
        <h1 className="mt-1 text-2xl sm:text-4xl font-semibold text-slate-900">
          {property.name}
        </h1>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
                <div className="md:col-span-2 h-64 bg-gray-100 rounded-xl overflow-hidden">
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
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {photos.slice(0, 2).map((ph: any) => (
                    <div
                      key={ph.id}
                      className="h-32 bg-gray-100 rounded-xl overflow-hidden"
                    >
                      <img
                        src={resolveAssetUrl(ph.url) || "/images/villa-2.jpg"}
                        alt="Photo"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/villa-2.jpg";
                        }}
                      />
                    </div>
                  ))}
                  {photos.length === 0 && (
                    <>
                      <div className="h-32 bg-gray-100 rounded-xl" />
                      <div className="h-32 bg-gray-100 rounded-xl" />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl p-6">
              <h2 className="font-semibold text-slate-900">About This Space</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {property.description}
              </p>

              <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs text-slate-700">
                <div className="border border-cyan-100 bg-cyan-50/70 rounded-full px-3 py-1 text-center">
                  {property.totalRoom} Room
                </div>
                <div className="border border-cyan-100 bg-cyan-50/70 rounded-full px-3 py-1 text-center">
                  {property.bedroom} Bedroom
                </div>
                <div className="border border-cyan-100 bg-cyan-50/70 rounded-full px-3 py-1 text-center">
                  {property.bathroom} Bathroom
                </div>
                <div className="border border-cyan-100 bg-cyan-50/70 rounded-full px-3 py-1 text-center">
                  {property.type}
                </div>
                <div className="border border-cyan-100 bg-cyan-50/70 rounded-full px-3 py-1 text-center">
                  {property.address || "Address"}
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl p-6">
              <h2 className="font-semibold text-slate-900">Owner</h2>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 truncate">
                    {property.owner?.name || "-"}
                  </div>
                  <div className="text-sm text-slate-600 truncate">
                    {property.owner?.email || "-"}
                  </div>
                </div>
                <a
                  href={
                    property.owner?.whatsapp
                      ? `https://wa.me/${String(property.owner.whatsapp).replace(/\D/g, "")}`
                      : "#"
                  }
                  className="px-4 py-2 rounded-xl border border-white/60 bg-white/70 backdrop-blur hover:bg-white text-sm"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <aside className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl p-6 h-fit shadow-[0_20px_60px_-40px_rgba(13,148,136,0.35)]">
            <div className="text-sm text-slate-600">Price</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {priceText}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Guests</label>
                <input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Billing</label>
                <select
                  value={billingType}
                  onChange={(e) => setBillingType(e.target.value as BillingType)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-6 w-full bg-cyan-700 text-white rounded-xl px-4 py-3 hover:bg-cyan-800 shadow-sm"
            >
              Continue
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
