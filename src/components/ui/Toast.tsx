"use client";

import { useEffect, useState } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  title?: string;
  durationMs?: number;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = "success",
  title = "Bilgileriniz Güncellendi",
  durationMs = 4500,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!visible) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        className={`p-4 rounded-2xl backdrop-blur-xl shadow-2xl border flex items-start gap-3.5 transition-all ${
          isSuccess
            ? "bg-white/95 border-emerald-500/40 text-ink shadow-emerald-500/10"
            : "bg-white/95 border-red-500/40 text-ink shadow-red-500/10"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-xs border ${
            isSuccess
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600"
              : "bg-red-500/15 border-red-500/30 text-red-600"
          }`}
        >
          {isSuccess ? "✓" : "!"}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="font-semibold text-xs text-ink leading-tight">
            {title}
          </div>
          <div className="text-[11.5px] text-muted mt-0.5 leading-snug">
            {message}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="text-muted hover:text-ink text-xs p-1 font-bold rounded-lg transition-colors cursor-pointer"
          title="Kapat"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
