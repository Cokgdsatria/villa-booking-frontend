"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { login } from "@/services/auth.service";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const villaImages = [
    "/images/villa-1.jpg",
    "/images/villa-2.jpg",
    "/images/villa-3.jpg",
];

function LoginPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [currentImage, setCurrentImage] = useState(0);

    //Auto rotate image setaip 5 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % villaImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const res = await login({ email, password });

        const jwtToken = res?.token;
        const user = res?.user; 

        if (!jwtToken || !user) {
        throw new Error("Invalid login response");
        }

        // simpan token
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("token", jwtToken);
        storage.setItem("user", JSON.stringify(user));

        const redirect = searchParams.get("redirect");
        if (redirect) {
          router.push(redirect);
          return;
        }

        if (user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (user.role === "OWNER" && user.owner) {
          router.push("/dashboard/owner");
        } else {
          router.push("/");
        }
    } catch (err: any) {
        const message =
            err?.response?.data?.message ||
            err?.message ||
            "Email atau Password salah";
        setError(message);
    } finally {
        setLoading(false);
    }
    };

    return (
        <div
            className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50"
            style={{
                minHeight: "100vh",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                backgroundColor: "#f9fafb",
            }}
        >
            {/* LEFT IMAGE (DESKTOP ONLY)*/}
            <div
                className="relative hidden md:block"
                style={{ position: "relative", minHeight: "100vh" }}
            >
                <Image
                    src={villaImages[currentImage]}
                    alt="Villa"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* RIGHT FORM */}
            <div
                className="flex items-center justify-center px-4 sm:px-6"
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <div className="
                w-full 
                max-w-md
                bg-white
                rounded-xl
                shadow-lg
                p-6
                sm:p-8
                "
                >
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Masuk ke Akun Anda
                    </h1>
                    <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
                        Kelola Booking Villa anda dengan mudah
                    </p>

                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* EMAIL*/}
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                placeholder="nama@gmail.com"
                                className="
                                w-full 
                                border 
                                rounded-lg 
                                px-4 
                                py-2
                                focus:outline-none 
                                focus:ring-2
                                focus:ring-teal-500
                                "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm mb-1">Password</label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Masukkan password"
                                    className="
                                        w-full
                                        border
                                        rounded-lg
                                        px-4
                                        py-2
                                        pr-12
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-teal-500
                                    "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                        hover:text-gray-700
                                    "
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <div className="text-right mt-1">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => alert("Fitur lupa password belum tersedia")}
                                > 
                                    Lupa Password?
                                </button>
                            </div>
                        </div>

                        {/* REMEMBER ME*/}
                        <div className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label htmlFor="remember" className="cursor-pointer">Ingat saya</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                            w-full
                            bg-teal-600
                            text-white
                            py-3
                            rounded-lg
                            text-base
                            font-medium
                            hover:bg-teal-700
                            active:scale-[0.98]
                            transition
                            disabled:opacity-60
                            "
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    {/* SOCIAL LOGIN (UI Only) */}
                        <div className="my-6 flex items-center gap-3 text-gray-400 text-sm">
                            <div className="flex-1 h-px bg-gray-300"/>
                            atau masuk dengan
                            <div className="flex-1 h-px bg-gray-300"/>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="flex-1 border py-3 rounded-lg">
                                Google
                            </button>
                            <button className="flex-1 border py-3 rounded-lg    bg-blue-600 text-white">
                                Facebook
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-center">
                            Belum punya akun?{" "}
                            <Link href="/auth/register" className="text-blue-600 font-medium">
                                Daftar Sekarang
                            </Link>
                        </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}


