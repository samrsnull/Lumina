"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import styles from "./productos.module.css";

export type Product = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  rating: number;
  descripcion: string;
  categoria: string;
};

function getProductHref(p: Product) {
  const cat = (p.categoria || "").toLowerCase();
  if (cat.includes("anill")) return `/productos/anillos/${encodeURIComponent(p.id)}`;
  if (cat.includes("collar")) return `/productos/collares/${encodeURIComponent(p.id)}`;
  if (cat.includes("pulser")) return `/productos/pulseras/${encodeURIComponent(p.id)}`;
  return `/productos/${encodeURIComponent(p.id)}`;
}

export default function ProductsClient({
  products,
  categoria: controlledCategoria,
  onCategoriaChange,
  hideHeader,
}: {
  products: Product[];
  categoria?: string;
  onCategoriaChange?: (c: string) => void;
  hideHeader?: boolean;
}) {
  const [categoriaState, setCategoriaState] = useState<string>("Todas");

  const categorias = useMemo(() => {
    const set = new Set<string>(products.map((p) => p.categoria));
    return ["Todas", ...Array.from(set)];
  }, [products]);

  const categoria = controlledCategoria ?? categoriaState;
  const setCategoria = onCategoriaChange ?? setCategoriaState;

  const filtrados = useMemo(() => {
    return categoria === "Todas"
      ? products
      : products.filter((p) => p.categoria === categoria);
  }, [products, categoria]);
  const { addItem } = useCart();
  const { push } = useToast();


  return (
    <section>
      {!hideHeader && (
        <header className={styles.catalogHeader}>
          <div className={styles.logoWrap}>
            <Image src="/Images/LogoLetra.png" alt="Lumina" width={90} height={90} className={styles.logoSmall} />
          </div>

          <div className={styles.headerCenter}>
            <p className="text-sm text-slate-400">Tienda</p>
            <h1 className="text-3xl font-bold text-black">Catálogo de productos</h1>
          </div>

          <div className={styles.filterWrapper}>
            <label htmlFor="categoria" style={{ marginRight: 8, fontWeight: 600, color: "#94a3b8" }}>Filtrar:</label>
            <select id="categoria" className={styles.filterSelect} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </header>
      )}

      <div className={styles.productGrid}>
        {filtrados.map((p) => (
          <article key={p.id} className={styles.productCard}>
            <div className={styles.cardContent}>
              <div className={styles.productImageWrapper}>
                <Image src={p.imagen} alt={p.nombre} className={styles.productImage} width={320} height={240} />
              </div>
              <h3 className={styles.productName}>{p.nombre}</h3>
              <div className={styles.productPrice}>${p.precio.toLocaleString("es-AR")}</div>
              <div className={styles.productRating}><span className={styles.iconSmall}>⭐</span> <span className={styles.iconSmall}>{p.rating}</span></div>
              <p className={styles.productDesc}>{p.descripcion}</p>
            </div>

            <div className={styles.cardFooter}>
              <Link href={`${getProductHref(p)}?from=productos`} className={styles.productButton}>
                Ver producto
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Floating cart quick access */}
      <div className={styles.floatingCart}>
        <Link href="/carrito" aria-label="Ver carrito">
          <div style={{ background: "#fff", padding: 12, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🛒</span>
            <span style={{ fontWeight: 700 }}>Ver carrito</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
