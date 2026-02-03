"use client";

import React from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

export default function Modal ({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-lg relative">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        x
                    </button>
                </div>

                {/* Content*/}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}