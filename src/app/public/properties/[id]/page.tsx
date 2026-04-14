"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { getPropertyDetail } from "@/services/property.service";
import { resolveAssetUrl } from "@/utils/url";

type BillingType = "MONTHLY" | "YEARLY" | "DAILY";

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
    d.setDate(d.getDate() + 30);
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

  const parseLocalDate = (value: string) => new Date(value + "T00:00:00");
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const bookingPricing = useMemo(() => {
    if (!property) {
      return {
        appliedBillingType: billingType as BillingType,
        nights: 0,
        totalPrice: 0,
        label: "-",
        sublabel: "",
        invalidDaily: false,
        effectiveCheckIn: checkIn,
        effectiveCheckOut: checkOut,
      };
    }

    const today = new Date();
    const defaultCheckIn = formatDate(today);

    if (billingType === "MONTHLY") {
      const start = parseLocalDate(defaultCheckIn);
      const end = new Date(start);
      end.setDate(end.getDate() + 30);
      return {
        appliedBillingType: "MONTHLY" as const,
        nights: 30,
        totalPrice: Number(property.priceMonthly || 0),
        label: `IDR ${Number(property.priceMonthly || 0).toLocaleString("id-ID")}/Mo`,
        sublabel: "Langganan bulanan (30 malam)",
        invalidDaily: false,
        effectiveCheckIn: defaultCheckIn,
        effectiveCheckOut: formatDate(end),
      };
    }

    if (billingType === "YEARLY") {
      const start = parseLocalDate(defaultCheckIn);
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      return {
        appliedBillingType: "YEARLY" as const,
        nights: 365,
        totalPrice: Number(property.priceYearly || 0),
        label: `IDR ${Number(property.priceYearly || 0).toLocaleString("id-ID")}/Yr`,
        sublabel: "Langganan tahunan (1 tahun)",
        invalidDaily: false,
        effectiveCheckIn: defaultCheckIn,
        effectiveCheckOut: formatDate(end),
      };
    }

    const start = parseLocalDate(checkIn);
    const end = parseLocalDate(checkOut);
    const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate =
      Number(property.priceNight) > 0
        ? Number(property.priceNight)
        : Math.round(Number(property.priceMonthly || 0) / 30);
    const invalidDaily = !Number.isFinite(nights) || nights < 1 || nights >= 30;
    const total = Math.round(dailyRate * Math.max(0, nights));

    return {
      appliedBillingType: "DAILY" as const,
      nights: Math.max(0, nights),
      totalPrice: total,
      label: `IDR ${total.toLocaleString("id-ID")}/Total`,
      sublabel: `IDR ${dailyRate.toLocaleString("id-ID")}/Night • ${Math.max(0, nights)} malam`,
      invalidDaily,
      effectiveCheckIn: checkIn,
      effectiveCheckOut: checkOut,
    };
  }, [billingType, checkIn, checkOut, property]);

  useEffect(() => {
    if (!property) return;
    if (billingType === "MONTHLY" || billingType === "YEARLY") {
      setCheckIn(bookingPricing.effectiveCheckIn);
      setCheckOut(bookingPricing.effectiveCheckOut);
      return;
    }
    const start = parseLocalDate(checkIn);
    const end = parseLocalDate(checkOut);
    if (end.getTime() <= start.getTime()) {
      const next = new Date(start);
      next.setDate(next.getDate() + 1);
      setCheckOut(formatDate(next));
    }
  }, [billingType, bookingPricing.effectiveCheckIn, bookingPricing.effectiveCheckOut, checkIn, checkOut, property]);

  const photos = useMemo(() => {
    return Array.isArray(property?.photos) ? property.photos : [];
  }, [property]);

  const galleryUrls = useMemo(() => {
    const raw = [
      property?.thumbnailUrl,
      ...photos.map((p: any) => p?.url).filter(Boolean),
    ]
      .map((u) => resolveAssetUrl(u))
      .filter(Boolean) as string[];

    const seen = new Set<string>();
    const unique: string[] = [];
    for (const u of raw) {
      if (seen.has(u)) continue;
      seen.add(u);
      unique.push(u);
    }
    return unique;
  }, [photos, property?.thumbnailUrl]);

  const mapQuery = useMemo(() => {
    const parts = [
      property?.name,
      property?.address,
      property?.city,
      property?.province,
    ].filter(Boolean);
    return parts.join(", ");
  }, [property?.address, property?.city, property?.name, property?.province]);

  const googleMapsLink = useMemo(() => {
    if (!mapQuery) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapQuery
    )}`;
  }, [mapQuery]);

  const googleMapsEmbed = useMemo(() => {
    if (!mapQuery) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  }, [mapQuery]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const galleryStripRef = useRef<HTMLDivElement | null>(null);
  const gallerySlideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const galleryOpenIndexRef = useRef(0);

  useEffect(() => {
    if (!galleryOpen) return;
    const slideEl = gallerySlideRefs.current[galleryOpenIndexRef.current];
    if (!slideEl) return;
    const id = window.setTimeout(() => {
      slideEl.scrollIntoView({ behavior: "auto", inline: "start", block: "nearest" });
    }, 0);
    return () => window.clearTimeout(id);
  }, [galleryOpen]);

  const scrollToGalleryIndex = (idx: number, behavior: ScrollBehavior = "smooth") => {
    const next = Math.max(0, Math.min(galleryUrls.length - 1, idx));
    setActivePhotoIndex(next);
    window.requestAnimationFrame(() => {
      const slideEl = gallerySlideRefs.current[next];
      if (slideEl) {
        slideEl.scrollIntoView({ behavior, inline: "start", block: "nearest" });
        return;
      }
      const el = galleryStripRef.current;
      if (!el) return;
      const width = el.getBoundingClientRect().width || el.clientWidth;
      if (!width) return;
      el.scrollTo({ left: next * width, behavior });
    });
  };

  const handleContinue = () => {
    const paramsQS = new URLSearchParams();
    paramsQS.set("checkIn", bookingPricing.effectiveCheckIn);
    paramsQS.set("checkOut", bookingPricing.effectiveCheckOut);
    paramsQS.set("guests", String(guests));
    paramsQS.set("billingType", bookingPricing.appliedBillingType);
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
                    src={galleryUrls[0] || "/images/villa-1.jpg"}
                    alt={property.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/villa-1.jpg";
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  <div className="h-32 bg-gray-100 rounded-xl overflow-hidden">
                    {galleryUrls[1] ? (
                      <img
                        src={galleryUrls[1]}
                        alt="Photo"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/villa-2.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (galleryUrls.length === 0) return;
                      const initialIndex = Math.min(2, galleryUrls.length - 1);
                      galleryOpenIndexRef.current = initialIndex;
                      setActivePhotoIndex(initialIndex);
                      setGalleryOpen(true);
                    }}
                    className="relative h-32 bg-gray-100 rounded-xl overflow-hidden text-left"
                    disabled={galleryUrls.length === 0}
                  >
                    {galleryUrls[2] ? (
                      <img
                        src={galleryUrls[2]}
                        alt="Photo"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/villa-3.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                    <div className="absolute inset-0 bg-slate-900/35" />
                    <div className="absolute inset-0 p-3 flex items-end justify-between">
                      <div className="text-white">
                        <div className="text-sm font-semibold">Lihat semua foto</div>
                        <div className="text-xs text-white/90">
                          {galleryUrls.length} foto
                        </div>
                      </div>
                      {galleryUrls.length > 3 && (
                        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white">
                          +{galleryUrls.length - 3}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {galleryOpen && (
              <div className="fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => setGalleryOpen(false)}
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-5xl bg-white/80 backdrop-blur border border-white/60 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="px-5 sm:px-6 py-4 border-b border-white/40 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {property.name}
                        </div>
                        <div className="text-sm text-slate-600">
                          Foto {activePhotoIndex + 1} / {galleryUrls.length}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGalleryOpen(false)}
                          className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div
                        ref={galleryStripRef}
                        className="flex overflow-x-auto snap-x snap-proximity rounded-2xl overscroll-x-contain"
                        onScroll={(e) => {
                          const el = e.currentTarget;
                          const width = el.getBoundingClientRect().width || el.clientWidth;
                          if (!width) return;
                          const rawIdx = Math.round(el.scrollLeft / width);
                          const idx = Math.max(0, Math.min(galleryUrls.length - 1, rawIdx));
                          if (idx !== activePhotoIndex) setActivePhotoIndex(idx);
                        }}
                      >
                        {galleryUrls.map((url, idx) => (
                          <div
                            key={url + idx}
                            ref={(el) => {
                              gallerySlideRefs.current[idx] = el;
                            }}
                            className="snap-start shrink-0 w-full"
                          >
                            <div className="h-[60vh] min-h-[320px] bg-slate-100 rounded-2xl overflow-hidden">
                              <img
                                src={url}
                                alt={`Photo ${idx + 1}`}
                                className="w-full h-full object-contain bg-slate-100"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-2">
                        {galleryUrls.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              scrollToGalleryIndex(idx);
                            }}
                            className={`h-2.5 rounded-full transition-all ${
                              idx === activePhotoIndex
                                ? "w-6 bg-cyan-800"
                                : "w-2.5 bg-slate-300"
                            }`}
                            aria-label={`Photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/70 backdrop-blur border border-white/60 rounded-3xl p-6">
              <h2 className="font-semibold text-slate-900">About This Space</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {property.description}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
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
              </div>

              <div className="mt-8 border-t border-white/40 pt-6">
                <h3 className="font-semibold text-slate-900">Popular Facilities</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
                  <div className="border border-emerald-100 bg-emerald-50/70 rounded-full px-3 py-1">
                    Wi-Fi
                  </div>
                  <div className="border border-emerald-100 bg-emerald-50/70 rounded-full px-3 py-1">
                    Air Conditioning
                  </div>
                  <div className="border border-emerald-100 bg-emerald-50/70 rounded-full px-3 py-1">
                    Kitchen
                  </div>
                  <div className="border border-emerald-100 bg-emerald-50/70 rounded-full px-3 py-1">
                    Parking
                  </div>
                  <div className="border border-emerald-100 bg-emerald-50/70 rounded-full px-3 py-1">
                    Swimming Pool
                  </div>
                  <div className="border border-emerald-100 bg-emerald-50/70 rounded-full px-3 py-1">
                    {property.bedroom} Bedrooms
                  </div>
                  <div className="border border-emerald-100 bg-emerald-50/70 rounded-full px-3 py-1">
                    {property.bathroom} Bathrooms
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/40 pt-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">Location</h3>
                  {googleMapsLink && (
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm px-3 py-2 rounded-xl bg-cyan-700 text-white hover:bg-cyan-800"
                    >
                      Buka Google Maps
                    </a>
                  )}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {mapQuery || "-"}
                </div>

                {googleMapsEmbed && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/60 bg-white/60">
                    <iframe
                      src={googleMapsEmbed}
                      className="w-full h-64"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
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
              {bookingPricing.label}
            </div>
            {bookingPricing.sublabel && (
              <div className="mt-2 text-sm text-slate-600">
                {bookingPricing.sublabel}
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Check-in</label>
                <input
                  type="date"
                  value={bookingPricing.effectiveCheckIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  disabled={billingType !== "DAILY"}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Check-out</label>
                <input
                  type="date"
                  value={bookingPricing.effectiveCheckOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={billingType !== "DAILY"}
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
                  <option value="DAILY">Per Malam</option>
                </select>
              </div>
            </div>

            {billingType === "DAILY" && bookingPricing.invalidDaily && (
              <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3">
                Untuk durasi 30 malam atau lebih, gunakan Monthly atau Yearly.
              </div>
            )}

            <button
              type="button"
              onClick={handleContinue}
              disabled={billingType === "DAILY" && bookingPricing.invalidDaily}
              className="mt-6 w-full bg-cyan-700 text-white rounded-xl px-4 py-3 hover:bg-cyan-800 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
