"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { getPublicProperties, type PublicPropertyListItem } from "@/services/property.service";
import { resolveAssetUrl } from "@/utils/url";

export default function HomePage() {
  const router = useRouter();
  const [popular, setPopular] = useState<PublicPropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");
  const [billingType, setBillingType] = useState<"MONTHLY" | "YEARLY">("MONTHLY");

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
    params.set("billingType", billingType);
    router.push(`/public/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <section className="bg-white border rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Temukan Villa Impianmu
              </h1>
              <p className="mt-3 text-gray-600">{heroSubtitle}</p>

              <form
                onSubmit={handleSearch}
                className="mt-6 grid grid-cols-1 sm:grid-cols-6 gap-3"
              >
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cari lokasi (mis. Bali / Ubud)"
                  className="sm:col-span-3 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />

                <select
                  value={billingType}
                  onChange={(e) =>
                    setBillingType(e.target.value as "MONTHLY" | "YEARLY")
                  }
                  className="sm:col-span-2 w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>

                <button
                  type="submit"
                  className="sm:col-span-1 w-full bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800"
                >
                  Search
                </button>
              </form>

              <div className="mt-4 text-sm text-gray-500">
                Atau lihat semua listing di{" "}
                <Link href="/public/properties" className="text-blue-600 hover:underline">
                  halaman properties
                </Link>
                .
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border p-6 sm:p-8">
              <h2 className="font-semibold text-gray-900">Promo Event</h2>
              <p className="text-sm text-gray-600 mt-2">
                Diskon untuk booking pertama dan promo musiman.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="h-20 rounded-xl bg-white/70 border" />
                <div className="h-20 rounded-xl bg-white/70 border" />
                <div className="h-20 rounded-xl bg-white/70 border" />
                <div className="h-20 rounded-xl bg-white/70 border" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Explore Our Popular Villas
            </h2>
            <Link
              href="/public/properties"
              className="text-sm text-blue-600 hover:underline"
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
                  className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-40 bg-gray-100">
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
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-500">
                      {p.city}, {p.province}
                    </div>
                    <div className="mt-3 text-sm font-semibold text-gray-900">
                      IDR {p.priceMonthly?.toLocaleString("id-ID")}/Mo
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {p.bedroom} Bedroom • {p.bathroom} Bathroom • {p.totalRoom} Room
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section id="about" className="mt-14 bg-white border rounded-2xl p-6 sm:p-10">
          <h2 className="text-xl font-semibold text-gray-900">About</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            VillaBook membantu kamu menemukan villa berdasarkan lokasi, tipe, harga,
            dan kebutuhan menginap. Kamu bisa melihat detail properti dan melanjutkan
            proses booking secara sederhana.
          </p>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
            <div className="font-semibold text-gray-900">VillaBook</div>
            <div className="mt-2">Navigate, Contact, dan info promo.</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Navigate</div>
            <div className="mt-2 space-y-1">
              <Link href="/" className="block hover:underline">
                Home
              </Link>
              <Link href="/#about" className="block hover:underline">
                About
              </Link>
              <Link href="/public/properties" className="block hover:underline">
                Properties
              </Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Contact</div>
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

