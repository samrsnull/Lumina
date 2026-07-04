"use client";
import React, { createContext, useContext, useState } from "react";

type Toast = { id: string; message: string };

type ToastContextType = {
  push: (msg: string, ms?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (message: string, ms = 2500) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [...s, { id, message }]);
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, ms);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ marginTop: 8, background: "rgba(0,0,0,0.8)", color: "#fff", padding: "10px 14px", borderRadius: 8, minWidth: 220, boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
