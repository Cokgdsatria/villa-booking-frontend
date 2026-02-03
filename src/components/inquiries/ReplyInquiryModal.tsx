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
            <p className="text-sm text-gray-600 mb-4">
                Kepada: <strong>{inquiryName}</strong>
            </p>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan balasan..."
                rows={5}
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3 mt-4">
                <button
                    onClick={handleSend}
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                Kirim
                </button>
            </div>
        </Modal>
    );    
}