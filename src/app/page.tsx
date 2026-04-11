"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { getPublicProperties, type PublicPropertyListItem } from "@/services/property.service";
import { resolveAssetUrl } from "@/utils/url";

export default function HomePage() {
  const router = useRouter();
  const [popular, setPopular] = useState<PublicPropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [totalRoom, setTotalRoom] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [billingType, setBillingType] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

  const promos = useMemo(
    () => [
      {
        id: "promo-newyear",
        title: "New Year Promo",
        subtitle: "Diskon booking pertama untuk periode terbatas.",
        badge: "Limited",
      },
      {
        id: "promo-weekend",
        title: "Weekend Special",
        subtitle: "Harga spesial untuk check-in Jumat–Minggu.",
        badge: "Hot",
      },
      {
        id: "promo-longstay",
        title: "Long Stay Deal",
        subtitle: "Lebih hemat untuk sewa bulanan & tahunan.",
        badge: "Best Value",
      },
      {
        id: "promo-referral",
        title: "Referral Bonus",
        subtitle: "Ajak teman dan dapatkan bonus promo.",
        badge: "Bonus",
      },
    ],
    []
  );

  const [promoIndex, setPromoIndex] = useState(0);
  const promoRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getPublicProperties({ limit: 6, sort: "popular" });
        setPopular(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const heroSubtitle = useMemo(() => {
    return billingType === "MONTHLY"
      ? "Cari villa bulanan terbaik untuk staycation, kerja remote, atau liburan panjang."
      : "Cari villa tahunan untuk tempat tinggal nyaman dan fleksibel.";
  }, [billingType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (propertyType.trim()) params.set("type", propertyType.trim());
    if (totalRoom.trim()) params.set("totalRoom", totalRoom.trim());
    if (minPrice.trim()) params.set("minPrice", minPrice.trim());
    if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());
    params.set("billingType", billingType);
    router.push(`/public/properties?${params.toString()}`);
  };

  useEffect(() => {
    const node = promoRefs.current[promoIndex];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [promoIndex]);

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <section className="relative overflow-hidden border border-white/60 bg-white/70 backdrop-blur rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_-40px_rgba(2,132,199,0.35)]">
          <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-cyan-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 w-80 h-80 rounded-full bg-sky-200/50 blur-3xl" />

          <div className="relative">

            <h1 className="mt-4 text-3xl sm:text-5xl font-semibold text-slate-900 leading-tight">
              Temukan villa yang terasa seperti pulang ke alam
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl">
              Pilih lokasi, tipe properti, dan rentang harga. Kita bantu kamu menemukan
              tempat terbaik untuk rehat, kerja remote, atau liburan panjang.
            </p>

            <div className="mt-7 border border-cyan-100 bg-white/80 backdrop-blur rounded-2xl p-4 sm:p-6 shadow-sm">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-12 gap-3"
            >
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (mis. Bali / Ubud)"
                className="md:col-span-4 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
              />

              <input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="Property Type (mis. Villa)"
                className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
              />

              <input
                value={totalRoom}
                onChange={(e) => setTotalRoom(e.target.value)}
                placeholder="Total Room"
                inputMode="numeric"
                className="md:col-span-2 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
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
                inputMode="numeric"
                className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
              />

              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price"
                inputMode="numeric"
                className="md:col-span-3 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
              />

              <button
                type="submit"
                className="md:col-span-2 w-full bg-cyan-700 text-white rounded-xl px-4 py-3 hover:bg-cyan-800 shadow-sm"
              >
                Cari Villa
              </button>

              <Link
                href="/public/properties"
                className="md:col-span-4 w-full border border-slate-200 rounded-xl px-4 py-3 text-center bg-white/90 hover:bg-white transition"
              >
                Lihat Semua Properti
              </Link>
            </form>
          </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Explore Our Popular Villas
            </h2>
            <Link
              href="/public/properties"
              className="text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-white border rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular.map((p) => (
                <Link
                  key={p.id}
                  href={`/public/properties/${p.id}`}
                  className="group bg-white/80 backdrop-blur border border-white/60 rounded-3xl overflow-hidden hover:shadow-[0_20px_60px_-40px_rgba(2,132,199,0.35)] transition"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={resolveAssetUrl(p.thumbnailUrl) || "/images/villa-1.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/images/villa-1.jpg";
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="font-semibold text-slate-900 line-clamp-2">
                      {p.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {p.city}, {p.province}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-900 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">
                      IDR {p.priceMonthly?.toLocaleString("id-ID")}/Mo
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      {p.bedroom} Bedroom • {p.bathroom} Bathroom • {p.totalRoom} Room
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Promo Event</h2>
              <p className="text-sm text-slate-600 mt-1">
                Penawaran musiman yang terasa seperti angin laut—ringan, segar, dan
                pas.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setPromoIndex((prev) => (prev - 1 + promos.length) % promos.length)
                }
                className="px-3 py-1.5 rounded-xl border border-white/60 bg-white/70 backdrop-blur hover:bg-white text-sm"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPromoIndex((prev) => (prev + 1) % promos.length)}
                className="px-3 py-1.5 rounded-xl border border-white/60 bg-white/70 backdrop-blur hover:bg-white text-sm"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-5 border border-white/60 bg-white/70 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_-40px_rgba(13,148,136,0.35)]">
            <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
              {promos.map((promo, idx) => (
                <div
                  key={promo.id}
                  ref={(el) => {
                    promoRefs.current[idx] = el;
                  }}
                  className="snap-start shrink-0 w-[85%] sm:w-[420px] rounded-3xl border border-white/60 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-900">{promo.title}</div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-900 text-white">
                      {promo.badge}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{promo.subtitle}</div>
                  <div className="mt-5 h-24 rounded-2xl bg-gradient-to-r from-cyan-100/70 via-sky-100/70 to-emerald-100/60 border border-white/70" />
                  <button
                    type="button"
                    onClick={() => setPromoIndex(idx)}
                    className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                      idx === promoIndex
                        ? "bg-cyan-700 text-white"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {idx === promoIndex ? "Sedang Ditampilkan" : "Lihat Promo"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {promos.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPromoIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === promoIndex ? "w-6 bg-cyan-800" : "w-2.5 bg-slate-300"
                  }`}
                  aria-label={`Promo ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="mt-14 border border-white/60 bg-white/70 backdrop-blur rounded-3xl p-6 sm:p-10"
        >
          <h2 className="text-xl font-semibold text-slate-900">About</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            VillaBook dirancang untuk kamu yang ingin liburan tanpa ribet. Jelajahi
            properti, rasakan suasana resort tropis, lalu lanjut checkout dengan langkah
            yang sederhana dan jelas.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/40 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-slate-600">
          <div>
            <div className="font-semibold text-slate-900">VillaBook</div>
            <div className="mt-2">
              Rekomendasi villa dengan nuansa laut, hijau tropis, dan tenang.
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Navigate</div>
            <div className="mt-2 space-y-1">
              <Link href="/" className="block hover:underline hover:text-slate-900">
                Home
              </Link>
              <Link href="/#about" className="block hover:underline hover:text-slate-900">
                About
              </Link>
              <Link
                href="/public/properties"
                className="block hover:underline hover:text-slate-900"
              >
                Properties
              </Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Contact</div>
            <div className="mt-2 space-y-1">
              <div>cs@villabook.test</div>
              <div>+62 812-0000-0000</div>
              <div>Jakarta, Indonesia</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

