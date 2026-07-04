
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./productos.module.css";
import ProductsClient, { Product } from "./ProductsClient";
import { anillosData } from "../../data/anillos";
import { collaresData } from "../../data/collares";
import { pulserasData } from "../../data/pulseras";

export default function Page() {
	const anillos: Product[] = anillosData.map((a) => ({ ...a, categoria: "Anillos" }));
	const collares: Product[] = collaresData.map((c) => ({ ...c, categoria: "Collares" }));

	const pulseras: Product[] = pulserasData.map((p) => ({ ...p, categoria: "Pulseras" }));

	const products: Product[] = [...anillos, ...collares, ...pulseras];

	const categorias = useMemo(() => {
		const set = new Set<string>(products.map((p) => p.categoria));
		return ["Todas", ...Array.from(set)];
	}, [products]);

	const [categoria, setCategoria] = useState<string>("Todas");

	return (
		<main style={{ padding: "6rem 1rem 2rem" }}>
			<div className={styles.topBox}>
				<Link href="/" className={styles.backEdge + ' ' + styles.backBtn}>
					← Volver al inicio
				</Link>
				<div className={styles.topInner}>
					<div className={styles.topLeft}>
						<Image src="/Images/LogoLetra.png" alt="Lumina" width={120} height={120} className={styles.logoSmall} />
					</div>

					<div className={styles.topCenter}>
						<p className="text-sm text-slate-400">Tienda</p>
						<h1 className="text-3xl font-bold text-black">Catálogo de productos</h1>
					</div>

					<div className={styles.topRight}>
						<label htmlFor="categoriaTop" style={{ marginRight: 8, fontWeight: 600, color: "#94a3b8" }}>Filtrar:</label>
						<select id="categoriaTop" className={styles.filterSelect} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
							{categorias.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			<ProductsClient products={products} categoria={categoria} onCategoriaChange={(c) => setCategoria(c)} hideHeader />
		</main>
	);
}
