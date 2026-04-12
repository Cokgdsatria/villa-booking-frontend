"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReplyInquiryModal from "@/components/inquiries/ReplyInquiryModal"
import { getOwnerInquiries,replyInquiry } from "@/services/inquiry.service"; 
import { getDashboardStats } from "@/services/property.service";

type Inquiry = {
    id: string;
    name: string;
    property: string;
    date: string;
    status: "PENDING" | "RESPONDED";
    message: string;
};

export default function OwnerDashboardPage() {
    // Dashboard Stats
    const [stats, setStats] = useState<any>(null);

    //inquiries
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    const [replyOpen, setReplyOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        fetchStats();
        fetchInquiries();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed fetch stats", error);
        }
    };


    const fetchInquiries = async () => {
        try {
            const data = await getOwnerInquiries();

            const mapped = data.map((inq: any) => ({
                id: inq.id,
                name: inq.name,
                property: inq.property.name,
                date: new Date(inq.createdAt).toLocaleDateString(),
                status: inq.status,
                message: inq.message
            }));

            setInquiries(mapped);
        } catch (error){
            console.log("Failed fetch inquiries", error);
        }
    };

    

    const handleReply = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setReplyOpen(true);
    };

    const handleSendReply = async (message: string) => {
        if (!selectedInquiry) return;

        try {
            await replyInquiry(selectedInquiry.id, message);

            setInquiries((prev) =>
            prev.map((inq) =>
                inq.id === selectedInquiry.id
                    ? { ...inq, status: "RESPONDED" }
                    : inq
            )
        );

        setReplyOpen(false);
        setSelectedInquiry(null);
        } catch (error) {
            console.error("Reply inquiry error:", error);  
            alert("Gagal mengirim balasan. Coba lagi.");
        }
    };

    return (
        <div className="space-y-8">
            
            {/*DASHBOARD STATS */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white/70 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_-40px_rgba(2,132,199,0.25)] border border-white/60">
                        <p className="text-sm text-slate-600">Total Revenue</p>
                        <h3 className="text-2xl sm:text-3xl font-semibold mt-1 text-slate-900">
                            IDR {stats.totalRevenue}
                        </h3>
                    </div>

                    <div className="bg-white/70 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_-40px_rgba(13,148,136,0.22)] border border-white/60">
                        <p className="text-sm text-slate-600">Total Bookings</p>
                        <h3 className="text-2xl font-semibold mt-1 text-slate-900">{stats.totalBookings}</h3>
                    </div>

                    <div className="bg-white/70 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_-40px_rgba(2,132,199,0.25)] border border-white/60">
                        <p className="text-sm text-slate-600">Total Inquiries</p>
                        <h3 className="text-2xl font-semibold mt-1 text-slate-900">{stats.totalInquiries}</h3>
                    </div>

                    <div className="bg-white/70 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_-40px_rgba(13,148,136,0.22)] border border-white/60">
                        <p className="text-sm text-slate-600">Avg Rating</p>
                        <h3 className="text-2xl font-semibold mt-1 text-slate-900">{stats.avgRating}</h3> 
                    </div>
                </div>
            )}

            {/* == INQUIRIES LIST == */}
            <div className="bg-white/70 backdrop-blur rounded-3xl shadow-[0_20px_60px_-40px_rgba(2,132,199,0.22)] border border-white/60 overflow-hidden">
                <div className="flex flex-wrap justify-between items-center gap-2 p-4 sm:p-6 border-b border-white/60">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Inquiries Terbaru</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Pesan terbaru dari calon tamu, siap kamu balas dengan cepat.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/owner/inquiries"
                        className="text-sm text-cyan-800 hover:text-cyan-900 hover:underline"
                    >
                        Lihat Semua
                    </Link>
                </div>

                <div className="divide-y">
                    {inquiries.map((inq) =>(
                        <Link
                            key={inq.id}
                            href={`/dashboard/owner/inquiries/${inq.id}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 cursor-pointer hover:bg-white/60 transition">
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{inq.name}</p>
                                    <p className="text-sm text-slate-600 truncate">{inq.property}</p>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                        {inq.message}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-between sm:justify-end">
                                    <span className="text-sm text-slate-600 whitespace-nowrap">{inq.date}</span>

                                    <span
                                        className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                                            inq.status === "PENDING"
                                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        }`}
                                    >
                                        {inq.status === "PENDING"
                                        ? "Belum Dibalas"
                                        : "Sudah Dibalas"}
                                    </span>

                                    <button
                                        onClick={(e) =>{ 
                                            e.stopPropagation();
                                            handleReply(inq)
                                        }}
                                        disabled={inq.status === "RESPONDED"}
                                        className={`text-sm px-4 py-2 rounded-xl transition w-full sm:w-auto ${
                                            inq.status === "RESPONDED"
                                                ? "bg-white/60 text-slate-500 border border-white/60 cursor-not-allowed"
                                                : "bg-cyan-700 text-white hover:bg-cyan-800 shadow-sm"
                                        }`}
                                    >
                                        {/* Balas */}
                                        {inq.status === "RESPONDED" ? "Sudah Dibalas" : "Balas"}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {selectedInquiry && (
                <ReplyInquiryModal
                    open={replyOpen}
                    onClose={() => setReplyOpen(false)}
                    inquiryName={selectedInquiry.name}
                    onSend={handleSendReply}
                />
            )}
        </div>
    );
}
