"use client";
import ClientImageZoom from "@/components/ClientImageZoom";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { useState } from "react";

type Pulsera = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  rating: number;
  descripcion: string;
};

export default function PulseraClient({ pulsera }: { pulsera: Pulsera }) {
  const router = useRouter();
  const search = useSearchParams();
  const { addItem } = useCart();
  const { push } = useToast();
  const [qty, setQty] = useState<number>(1);

  function handleBack() {
    const from = search?.get("from") || "pulseras";
    if (from === "productos") return router.push("/productos");
    if (from === "pulseras") return router.push("/productos/pulseras");
    if (from === "collares") return router.push("/productos/collares");
    if (from === "anillos") return router.push("/productos/anillos");
    // default
    router.push("/productos/pulseras");
  }

  function handleAddToCart() {
    const count = Math.max(1, Math.floor(qty));
    addItem({ id: pulsera.id, name: pulsera.nombre, price: pulsera.precio, image: pulsera.imagen, categoria: "Pulseras" }, count);
    push("Añadido al carrito");
  }

  function handleBuyNow() {
    const count = Math.max(1, Math.floor(qty));
    addItem({ id: pulsera.id, name: pulsera.nombre, price: pulsera.precio, image: pulsera.imagen, categoria: "Pulseras" }, count);
    push("Añadido al carrito");
    router.push("/carrito");
  }

  function inc() {
    setQty((q) => Math.min(99, q + 1));
  }

  function dec() {
    setQty((q) => Math.max(1, q - 1));
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleBack} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 0 }}>&larr; Volver</button>
      </div>
    <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px", background: "#f8f8f8", borderRadius: "12px", overflow: "hidden" }}>
        <ClientImageZoom src={pulsera.imagen} alt={pulsera.nombre} />
      </div>
      <div style={{ flex: "1 1 400px", paddingTop: "1rem" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 700, margin: "0 0 1rem" }}>{pulsera.nombre}</h1>
        <p style={{ fontSize: "2.2rem", fontWeight: "bold", color: "var(--brand)", margin: "1rem 0" }}>
          ${pulsera.precio.toLocaleString("es-MX")}
        </p>
        <p style={{ fontSize: "1.1rem", color: "#444", lineHeight: 1.6, margin: "1rem 0 2rem" }}>{pulsera.descripcion}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={dec} style={{ padding: "0.5rem 0.8rem", borderRadius: 8 }}>-</button>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} style={{ width: 64, textAlign: "center", padding: "0.4rem" }} />
            <button onClick={inc} style={{ padding: "0.5rem 0.8rem", borderRadius: 8 }}>+</button>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={handleAddToCart} style={{ padding: "1rem 2.2rem", fontSize: "1.05rem", background: "#f0d58c", borderRadius: "10px", fontWeight: 600 }}>
              Añadir al Carrito
            </button>
            <button onClick={handleBuyNow} style={{ padding: "1rem 2.2rem", fontSize: "1.05rem", background: "#111", color: "#fff", borderRadius: "10px", fontWeight: 600 }}>
              Comprar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}