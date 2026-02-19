"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReplyInquiryModal from "@/components/inquiries/ReplyInquiryModal"
import { getOwnerInquiries,replyInquiry } from "@/services/inquiry.service"; 

type StatCard = {
    title: string;
    value: number;
    subtitle?: string;
};

type Inquiry = {
    id: string;
    name: string;
    property: string;
    date: string;
    status: "PENDING" | "RESPONDED";
    message: string;
};

export default function OwnerDashboardPage() {
    const [stats, setStats] = useState<StatCard[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    useEffect(() => {
        fetchInquiries();

    }, []);

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

    const [replyOpen, setReplyOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

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
            {/* ==STAT CARD == */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white rounded-xl p-6 shadow-sm border"
                    >
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        {stat.subtitle && (
                            <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                {stat.subtitle}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* == INQUIRIES LIST == */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-lg font-semibold">Inquiries Terbaru</h2>
                    <Link
                        href="/dashboard/owner/inquiries"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Lihat Semua
                    </Link>
                </div>

                <div className="divide-y">
                    {inquiries.map((inq) =>(
                        <div
                            key={inq.id}
                            className="flex items-center justify-between p-6"
                        >
                            <div>
                                <p className="font-medium">{inq.name}</p>
                                <p className="text-sm text-gray-500">{inq.property}</p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {inq.message}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">{inq.date}</span>

                                <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                        inq.status === "PENDING"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {inq.status === "PENDING"
                                    ? "Belum Dibalas"
                                    : "Sudah Dibalas"}
                                </span>

                                <button
                                    onClick={() => handleReply(inq)}
                                    disabled={inq.status === "RESPONDED"}
                                    className={`text-sm px-4 py-2 rounded-lg transition ${
                                        inq.status === "RESPONDED"
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {/* Balas */}
                                    {inq.status === "RESPONDED" ? "Sudah Dibalas" : "Balas"}
                                </button>
                            </div>
                        </div>
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