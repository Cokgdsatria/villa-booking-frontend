"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReplyInquiryModal from "@/components/inquiries/ReplyInquiryModal"

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
};

export default function OwnerDashboardPage() {
    const [stats, setStats] = useState<StatCard[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    useEffect(() => {
        // NANTI GANTI INI JADI API CALL
        setStats([
            { title: "Total Properties", value: 12, subtitle: "+2 bulan ini" },
            { title: "Total Inquiries", value: 87, subtitle: "+15 bulan ini" },
            { title: "Pending Inquiries", value: 23 },
            { title: "Contacted Inquiries", value: 64 },
        ]);

        setInquiries([
            {
                id: "1",
                name: "Sarah Johnson",
                property: "Ocean View Paradise",
                date: "15 Des 2024",  
                status: "PENDING",
            },
            {
                id: "2",
                name: "Michael Chen",
                property: "Villa Purnama Luxury",
                date: "14 Des 2024",  
                status: "RESPONDED",
            },
            {
                id: "3",
                name: "Emily Williams",
                property: "Mountain Breeze Villa",
                date: "13 Des 2024",  
                status: "PENDING",
            },
        ]);
    }, []);

    const [replyOpen, setReplyOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    const handleReply = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setReplyOpen(true);
    };

    const handleSendReply = (message: string) => {
        if(!selectedInquiry) return;
        
        console.log("Send reply:", {
            inquiryId: selectedInquiry?.id,
            message,
        });

        setInquiries((prev) => 
        prev.map((inq) => 
            inq.id === selectedInquiry?.id
                ? { ...inq, status: "RESPONDED" }
                : inq
            )
        );

        setReplyOpen(false);
        setSelectedInquiry(null);

    }

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

                                {/* <Link
                                    href={`/dashboard/owner/inquiries/${inq.id}`}
                                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Balas
                                </Link> */}

                                <button
                                    onClick={() => handleReply(inq)}
                                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Balas
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