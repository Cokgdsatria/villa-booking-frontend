"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { getPropertyDetail } from "@/services/property.service";
import { createInquiry } from "@/services/inquiry.service";

type BillingType = "MONTHLY" | "YEARLY";

function CheckoutPageInner({
  params,
}: {
  params: { propertyId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"DETAILS" | "PAYMENT" | "SUCCESS">("DETAILS");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");

  const checkIn = searchParams.get("checkIn") || new Date().toISOString().slice(0, 10);
  const checkOut =
    searchParams.get("checkOut") ||
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    })();
  const guests = Number(searchParams.get("guests") || 1);
  const billingType = (searchParams.get("billingType") as BillingType) || "MONTHLY";

  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return `/public/checkout/${params.propertyId}`;
    return window.location.pathname + window.location.search;
  }, [params.propertyId]);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    const raw =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setName(u?.owner?.name || u?.name || "");
        setEmail(u?.email || "");
      } catch {}
    }
  }, [currentUrl, router]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getPropertyDetail(params.propertyId);
        setProperty(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params.propertyId]);

  const price = useMemo(() => {
    if (!property) return 0;
    return billingType === "MONTHLY"
      ? Number(property.priceMonthly || 0)
      : Number(property.priceYearly || 0);
  }, [billingType, property]);

  const handleContinue = async () => {
    const missing: string[] = [];
    if (!name.trim()) missing.push("Name");
    if (!email.trim()) missing.push("Email");
    if (!telephone.trim()) missing.push("Telephone Number");
    if (!checkIn) missing.push("Check-in");
    if (!checkOut) missing.push("Check-out");
    if (!Number.isFinite(guests) || guests < 1) missing.push("Guests");

    if (missing.length > 0) {
      alert(`Field wajib belum lengkap: ${missing.join(", ")}`);
      return;
    }

    try {
      await createInquiry({
        propertyId: params.propertyId,
        name: name.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        message: message.trim() || undefined,
        billingType,
        checkIn,
        checkOut,
        guests,
      });
      setStep("PAYMENT");
    } catch (error) {
      const msg =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Gagal membuat booking. Coba lagi.";
      alert(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-10 w-48 bg-white border rounded-lg" />
          <div className="mt-6 h-96 bg-white border rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white border rounded-xl p-6">
            <div className="font-semibold">Property tidak ditemukan</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <Link
            href={`/public/properties/${params.propertyId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Kembali ke detail
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white border rounded-2xl p-5 sm:p-6">
            {step === "DETAILS" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                  <input
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Telephone Number"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <div className="font-semibold text-gray-900">Message</div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis pesan untuk owner (opsional)"
                    rows={6}
                    className="mt-2 w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full bg-gray-800 text-white rounded-xl py-3 font-semibold hover:bg-gray-900"
                >
                  Continue Booking
                </button>

                <div className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <Link
                    href={`/auth/register?redirect=${encodeURIComponent(currentUrl)}`}
                    className="text-blue-600 hover:underline"
                  >
                    Registrasi
                  </Link>
                </div>
              </div>
            )}

            {step === "PAYMENT" && (
              <div className="space-y-4">
                <div className="font-semibold text-gray-900">Pembayaran</div>
                <div className="text-sm text-gray-600">
                  Ini simulasi pembayaran. Klik tombol di bawah untuk menyelesaikan.
                </div>

                <div className="border rounded-xl p-4 text-sm text-gray-700 space-y-1">
                  <div>
                    <span className="text-gray-500">Property: </span>
                    {property.name}
                  </div>
                  <div>
                    <span className="text-gray-500">Tanggal: </span>
                    {checkIn} → {checkOut}
                  </div>
                  <div>
                    <span className="text-gray-500">Guests: </span>
                    {guests}
                  </div>
                  <div>
                    <span className="text-gray-500">Billing: </span>
                    {billingType}
                  </div>
                  <div className="font-semibold pt-2">
                    Total: IDR {price.toLocaleString("id-ID")}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("SUCCESS")}
                  className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700"
                >
                  Pay Now
                </button>
              </div>
            )}

            {step === "SUCCESS" && (
              <div className="space-y-4">
                <div className="font-semibold text-gray-900">Berhasil</div>
                <div className="text-sm text-gray-600">
                  Booking berhasil dibuat dan pembayaran selesai (simulasi). Owner akan
                  menerima inquiry kamu.
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/public/properties"
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 text-sm"
                  >
                    Cari villa lain
                  </Link>
                  <Link
                    href="/"
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-sm"
                  >
                    Kembali ke Home
                  </Link>
                </div>
              </div>
            )}
          </section>

          <aside className="bg-white border rounded-2xl p-5 sm:p-6 h-fit">
            <div className="font-semibold text-gray-900">Ringkasan</div>
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <div className="font-medium text-gray-900">{property.name}</div>
              <div>
                {property.city}, {property.province}
              </div>
              <div>
                <span className="text-gray-500">Check-in: </span>
                {checkIn}
              </div>
              <div>
                <span className="text-gray-500">Check-out: </span>
                {checkOut}
              </div>
              <div>
                <span className="text-gray-500">Guests: </span>
                {guests}
              </div>
              <div>
                <span className="text-gray-500">Billing: </span>
                {billingType}
              </div>
              <div className="pt-3 text-base font-bold text-gray-900">
                IDR {price.toLocaleString("id-ID")}
                <span className="text-sm font-normal text-gray-600">
                  {billingType === "MONTHLY" ? "/Mo" : "/Yr"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage(props: { params: { propertyId: string } }) {
  return (
    <Suspense fallback={null}>
      <CheckoutPageInner {...props} />
    </Suspense>
  );
}
