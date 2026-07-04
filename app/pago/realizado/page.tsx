"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface CartItem {
  description?: string;
  quantity: number;
  amount_total: number;
  currency?: string;
}

interface PaymentData {
  ok: boolean;
  paid: boolean;
  demo: boolean;
  id: string;
  amount_total: number;
  currency: string;
  items: CartItem[];
}

function formatCurrency(n: number, currency = "MXN") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(n);
}

export default function PagoRealizadoPage() {
  const search = useSearchParams();
  const router = useRouter();
  const { items, clear } = useCart();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaymentData | null>(null);

  useEffect(() => {
    const mode = search?.get("mode");
    const totalParam = search?.get("total");

    // 🚫 Protección: si no viene del flujo correcto
    if (mode !== "demo") {
      router.push("/");
      return;
    }

    const total = totalParam ? Number(totalParam) : 0;

    let mounted = true;

    (async () => {
      try {
        // 🕐 Simulación de procesamiento
        await new Promise((r) => setTimeout(r, 1200));

        const fakeData: PaymentData = {
          ok: true,
          paid: true,
          demo: true,
          id: `ORD-${Date.now()}`,
          amount_total: total,
          currency: "MXN",
          items: items.map((it) => ({
            description: it.name,
            quantity: it.qty,
            amount_total: it.price * it.qty,
            currency: "MXN",
          })),
        };

        if (mounted) {
          setData(fakeData);
          clear(); // 🧹 limpia carrito DESPUÉS de guardar data
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [search]);

  return (
    <>
      <Header showLoginButton={false} />

      <main className="min-h-screen bg-gradient-to-b from-[#fdfaf4] to-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="bg-white border rounded-2xl p-8 text-center">

            {loading ? (
              <div>Procesando pago...</div>

            ) : data ? (
              <div>
                <h1 className="text-2xl font-bold mb-3">
                  ¡Pago realizado!
                </h1>

                <p className="text-sm text-gray-600 mb-4">
                  Modo demo — no se realizó ningún cargo.
                </p>

                <p className="text-sm">
                  Orden: <strong>{data.id}</strong>
                </p>

                <p className="mt-4 text-lg">
                  Total:{" "}
                  <strong className="text-[#c0a256]">
                    {formatCurrency(data.amount_total)}
                  </strong>
                </p>

                {/* 🧾 Resumen */}
                {data.items.length > 0 && (
                  <div className="mt-6 text-left max-w-xl mx-auto">
                    <h3 className="font-semibold mb-2">Resumen</h3>
                    <ul className="space-y-2">
                      {data.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{it.description} x{it.quantity}</span>
                          <span>{formatCurrency(it.amount_total)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    onClick={() => router.push("/")}
                    className="rounded-lg bg-[#c0a256] px-6 py-3 text-white font-semibold"
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>

            ) : (
              <div>
                <h2>Algo salió raro...</h2>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 border px-4 py-2 rounded"
                >
                  Volver
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}