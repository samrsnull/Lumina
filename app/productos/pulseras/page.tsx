import Link from "next/link";
import styles from "./pulseras.module.css";
import Header from "@/components/Header";

type Pulsera = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  rating: number;
  descripcion: string;
};

const pulserasData: Pulsera[] = [
  {
    id: "set-pulseras-oro",
    nombre: "Set Pulseras de Oro",
    precio: 2200,
    imagen: "/Images/pulseras.webp",
    rating: 5,
    descripcion: "Set de tres pulseras de oro para combinar y crear un look único.",
  },
  {
    id: "pulsera-dije-corazon",
    nombre: "Pulsera Dije Corazón",
    precio: 1200,
    imagen: "/Images/pulseras.jpg",
    rating: 5,
    descripcion: "Encantadora pulsera con dijes de corazón y llave.",
  },
  {
    id: "pulsera-moderna",
    nombre: "Pulsera Dorada Moderna",
    precio: 1500,
    imagen: "/Images/pulseras.png",
    rating: 4,
    descripcion: "Pulsera de eslabones dorados estilo moderno.",
  },
];

export default function PulserasListadoPage() {
  return (
    <>
    {/* Agregamos el Header aquí */}
			<Header showLoginButton={true}/><hr />
    <main className="container section">
      <div style={{ marginBottom: 12 }}>
        <Link href="/" className={styles.backBtn}>&larr; Volver al inicio</Link>
      </div>
      <h1 className={styles.listHeading}>Pulseras Lumina</h1>
      <div className={styles.cardsGrid}>
        {pulserasData.map((p) => (
          <div key={p.id} className={styles.productCard}>
            <div className={styles.imageWrap}>
              <img src={p.imagen} alt={p.nombre} className={styles.cardImage} />
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{p.nombre}</h2>
              <p className={styles.cardPrice}>${p.precio.toLocaleString("es-MX")}</p>
              <div className={styles.cardRating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < p.rating ? `${styles.star} ${styles.filled}` : styles.star}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.cardActions}>
                <Link href={`/productos/pulseras/${p.id}?from=pulseras`} className={styles.detailBtn}>DETALLE</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}