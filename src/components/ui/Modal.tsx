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
            <div className="bg-white/80 backdrop-blur border border-white/60 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/60">
                    <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-800 text-xl"
                    >
                        x
                    </button>
                </div>

                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
