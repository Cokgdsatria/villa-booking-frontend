"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { register } from "@/services/auth.service";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const villaImages = ["/images/villa-1.jpg", "/images/villa-2.jpg", "/images/villa-3.jpg"];

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [registerAs, setRegisterAs] = useState<"CUSTOMER" | "OWNER">(
    (searchParams.get("as") as any) === "OWNER" ? "OWNER" : "CUSTOMER"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % villaImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const redirect = searchParams.get("redirect");
      await register({
        name,
        email,
        password,
        role: "OWNER",
        createOwnerProfile: registerAs === "OWNER",
      });
      if (redirect) {
        router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        "Gagal mendaftar. Coba gunakan email lain atau periksa input.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      <div className="relative hidden md:block">
        <Image
          src={villaImages[currentImage]}
          alt="Villa"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Buat Akun Baru</h1>
          <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
            {registerAs === "OWNER"
              ? "Daftarkan akun owner untuk mulai mengelola villa"
              : "Daftar untuk melanjutkan booking dan pembayaran"}
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRegisterAs("CUSTOMER")}
              className={`py-2 rounded-lg text-sm border ${
                registerAs === "CUSTOMER"
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRegisterAs("OWNER")}
              className={`py-2 rounded-lg text-sm border ${
                registerAs === "OWNER"
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nama</label>
              <input
                type="text"
                placeholder="Nama lengkap"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg text-base font-medium hover:bg-teal-700 active:scale-[0.98] transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center">
            Sudah punya akun?{" "}
            <a href="/auth/login" className="text-blue-600 font-medium">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}
