"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";

type Props = {
    open: boolean;
    onClose: () => void;
    inquiryName: string;
    onSend: (message: string) => void;
};

export default function ReplyInquiryModal({
    open, 
    onClose,
    inquiryName,
    onSend,
}: Props) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage("");
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Balas Inquiry">
            <p className="text-sm text-slate-600 mb-4">
                Kepada: <strong>{inquiryName}</strong>
            </p>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan balasan..."
                rows={5}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white/90 focus:outline-none focus:ring-4 focus:ring-cyan-200/50"
            />

            <div className="flex justify-end gap-3 mt-4">
                <button
                    onClick={handleSend}
                    className="px-4 py-2 text-sm rounded-xl bg-cyan-700 text-white hover:bg-cyan-800 shadow-sm"
                >
                Kirim
                </button>
            </div>
        </Modal>
    );    
}
