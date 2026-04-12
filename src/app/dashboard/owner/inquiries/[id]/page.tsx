"use client"

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getInquiryDetail, replyInquiry } from "@/services/inquiry.service";
import ReplyInquiryModal from "@/components/inquiries/ReplyInquiryModal";


export default function InquiryDetailPage() {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyOpen, setReplyOpen] = useState(false);

    const fetchInquiry = useCallback(async () => {
        if (!id) return;
        try {
            const data = await getInquiryDetail(id as string);
            setInquiry(data);
        } catch (error) {
            console.error("Gagal mengambil detail inquiry");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchInquiry();
    }, [fetchInquiry]);

    const handleSendReply = async (message: string) => {
        try {
            await replyInquiry(inquiry.id, message);
            setReplyOpen(false);
            fetchInquiry();
        } catch (error) {
            alert("Gagal mengirim balasan")
        }
    };

    if(loading) {
        return (
            <div className="space-y-6">
                <div className="h-7 w-56 rounded-xl bg-white/60 backdrop-blur border border-white/60" />
                <div className="h-80 rounded-3xl bg-white/60 backdrop-blur border border-white/60" />
            </div>
        );
    }
    if (!inquiry) {
        return (
            <div className="border border-white/60 bg-white/70 backdrop-blur rounded-3xl p-8">
                <div className="font-semibold text-slate-900">Inquiry tidak ditemukan</div>
                <Link
                    href="/dashboard/owner/inquiries"
                    className="mt-3 inline-flex text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
                >
                    Kembali ke daftar
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-9">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <Link
                        href="/dashboard/owner/inquiries"
                        className="inline-flex text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
                    >
                        ← Kembali
                    </Link>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">
                        Detail Inquiry
                    </h1>
                </div>
                <span
                    className={`px-4 py-1 text-sm rounded-full ${
                        inquiry.status === "PENDING"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                >
                    {inquiry.status}
                </span>
            </div>

            {/* INFORMASI TAMU */}
            <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white/60 space-y-3 shadow-[0_20px_60px_-40px_rgba(2,132,199,0.18)]">
                <h2 className="font-semibold text-lg text-slate-900">Informasi Tamu</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                    <p><span className="text-slate-500">Nama:</span> {inquiry.name}</p>
                    <p><span className="text-slate-500">Email:</span> {inquiry.email}</p>
                    <p><span className="text-slate-500">Telepon:</span> {inquiry.telephone}</p>
                    <p>
                        <span className="text-slate-500">Tanggal Inquiry:</span>{" "}
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* DETAIL PERMINTAAN */}
            <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white/60 space-y-3 shadow-[0_20px_60px_-40px_rgba(13,148,136,0.16)]">
                <h2 className="font-semibold text-lg text-slate-900">Detail Permintaan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                    <p><span className="text-slate-500">Property:</span> {inquiry.property?.name}</p>
                    <p><span className="text-slate-500">Guest:</span> {inquiry.guests}</p>
                    <p>
                        <span className="text-slate-500">Check-in:</span>{" "}
                        {new Date(inquiry.checkIn).toLocaleDateString()}                        
                    </p>
                    <p>
                        <span className="text-slate-500">Check-out:</span>{" "}
                        {new Date(inquiry.checkOut).toLocaleDateString()}
                    </p>
                    <p><span className="text-slate-500">Billing Type:</span> {inquiry.billingType}</p>
                </div>
            </div>

            {/* PESAN TAMU */}
            <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white/60 space-y-3">
                <h2 className="font-semibold text-lg text-slate-900">Pesan Tamu</h2>
                <div className="bg-white/70 border border-white/60 p-4 rounded-2xl text-sm leading-relaxed text-slate-700">
                    {inquiry.message}
                </div>
            </div>

            {/* BALASAN */}
            {inquiry.replies && inquiry.replies.length > 0 && (
                <div className="bg-white/70 backdrop-blur p-6 rounded-3xl border border-white/60">
                    <h2 className="font-semibold text-lg mb-6 text-slate-900">Percakapan</h2>

                    <div className="space-y-6">

                        {/* CUSTOMER MESSAGE */}
                        <div className="flex">
                            <div className="max-w-md bg-white/70 border border-white/60 rounded-2xl px-4 py-3 shadow-sm">
                                <p className="text-sm text-slate-800">{inquiry.message}</p>
                                <p className="text-xs text-slate-500 mt-2 text-right">
                                    {new Date(inquiry.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* OWNER REPLIES */}
                        {inquiry.replies?.map((reply: any) => (
                            <div key={reply.id} className="flex justify-end">
                                <div className="max-w-md bg-cyan-700 text-white rounded-2xl px-4 py-3 shadow-sm">
                                    <p className="text-sm">{reply.message}</p>
                                    <p className="text-xs text-cyan-100 mt-2 text-right">
                                        {new Date(reply.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            )}

            {/* ACTION BUTTON */}
            <div>
                <button
                onClick={() => setReplyOpen(true)}
                className="bg-cyan-700 text-white px-5 py-2 rounded-xl hover:bg-cyan-800 shadow-sm"
                >
                Balas Inquiry
                </button>
            </div>

            <ReplyInquiryModal
                open={replyOpen}
                onClose={() => setReplyOpen(false)}
                inquiryName={inquiry.name}
                onSend={handleSendReply}
            />
        </div>
    );
}
