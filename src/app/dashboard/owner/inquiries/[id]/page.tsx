"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getInquiryDetail, replyInquiry } from "@/services/inquiry.service";
import ReplyInquiryModal from "@/components/inquiries/ReplyInquiryModal";


export default function InquiryDetailPage() {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyOpen, setReplyOpen] = useState(false);

    useEffect(() => {
        if (id)fetchInquiry();
    }, [id]);

    const fetchInquiry = async () => {
        try {
            const data = await getInquiryDetail(id as string);
            setInquiry(data);
        } catch (error) {
            console.error("Gagal mengambil detail inquiry");
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async (message: string) => {
        try {
            await replyInquiry(inquiry.id, message);
            setReplyOpen(false);
            fetchInquiry();
        } catch (error) {
            alert("Gagal mengirim balasan")
        }
    };

    if(loading) return <p>Loading...</p>;
    if (!inquiry) return <p>Inquiry tidak ditemukan</p>;

    return (
        <div className="space-y-9">
            {/* <h1 className="text-xl font-semibold">Detain Inquiry</h1>

            <div className="bg-white p-6 rounded-xl border space-y-2">
                <p><b>Nama:</b> {inquiry.name}</p>
                <p><b>Email:</b> {inquiry.email}</p>
                <p><b>Telepon</b> {inquiry.telephone}</p>
                <p><b>Property:</b> {inquiry.property.name}</p>
                <p><b>Statuus:</b> {inquiry.status}</p>
                <p className="bg-gray-50 p-3 rounded">{inquiry.message}</p>
            </div>

            <button
                onClick={() => setReplyOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Balas Inquiry
            </button> */}

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Detail Inquiry</h1>
                <span
                    className={`px-4 py-1 text-sm rounded-full ${
                        inquiry.status === "PENDING"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                    }`}
                >
                    {inquiry.status}
                </span>
            </div>

            {/* INFORMASI TAMU */}
            <div className="bg-white p-6 rounded-xl border space-y-3">
                <h2 className="font-semibold text-lg">Informasi Tamu</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><b>Nama:</b> {inquiry.name}</p>
                    <p><b>Email:</b> {inquiry.email}</p>
                    <p><b>Telepon:</b> {inquiry.telephone}</p>
                    <p>
                        <b>Tanggal Inquiry:</b>{" "}
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* DETAIL PERMINTAAN */}
            <div className="bg-white p-6 rounded-xl border space-y-3">
                <h2 className="font-semibold text-lg">Detail Permintaan</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><b>Property:</b>{inquiry.property?.name}</p>
                    <p><b>Guest:</b>{inquiry.guests}</p>
                    <p>
                        <b>Check-in:</b>{" "}
                        {new Date(inquiry.checkIn).toLocaleDateString()}                        
                    </p>
                    <p>
                        <b>Check-out:</b>{" "}
                        {new Date(inquiry.checkOut).toLocaleDateString()}
                    </p>
                    <p><b>Billing Type:</b>{inquiry.billingType}</p>
                </div>
            </div>

            {/* PESAN TAMU */}
            <div className="bg-white p-6 rounded-xl border space-y-3">
                <h2 className="font-semibold text-lg">Pesan Tamu</h2>
                <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                    {inquiry.message}
                </div>
            </div>

            {/* BALASAN */}
            {inquiry.replies && inquiry.replies.length > 0 && (
                <div className="bg-white p-6 rounded-xl border">
                    <h2 className="font-semibold text-lg mb-6">Percakapan</h2>

                    <div className="space-y-6">

                        {/* CUSTOMER MESSAGE */}
                        <div className="flex">
                            <div className="max-w-md bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                                <p className="text-sm">{inquiry.message}</p>
                                <p className="text-xs text-gray-400 mt-2 text-right">
                                    {new Date(inquiry.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* OWNER REPLIES */}
                        {inquiry.replies?.map((reply: any) => (
                            <div key={reply.id} className="flex justify-end">
                                <div className="max-w-md bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm">
                                    <p className="text-sm">{reply.message}</p>
                                    <p className="text-xs text-blue-200 mt-2 text-right">
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
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
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