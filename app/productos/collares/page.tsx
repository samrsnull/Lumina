import Link from "next/link";
import { collaresData } from "@/data/collares";
import styles from "./collares.module.css";
import Header from "@/components/Header";
// Usar enlace directo a la página principal en lugar del botón dependiente del referrer

export default function CollaresListadoPage() {
  return (
    <>
    {/* Agregamos el Header aquí */}
			<Header showLoginButton={true}/><hr />
    <main className="container section">
      <div style={{ marginBottom: 12 }}>
        <Link href="/" className={styles.backBtn}>&larr; Volver al inicio</Link>
      </div>
      <h1 className={styles.listHeading}>Collares Lumina</h1>
      <div className={styles.cardsGrid}>
        {collaresData.map(c => (
          <div key={c.id} className={styles.productCard}>
            <div className={styles.imageWrap}>
              <img src={c.imagen} alt={c.nombre} className={styles.cardImage} />
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{c.nombre}</h2>
              <p className={styles.cardPrice}>${c.precio.toLocaleString("es-MX")}</p>
              <div className={styles.cardRating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < c.rating ? `${styles.star} ${styles.filled}` : styles.star}>★</span>
                ))}
              </div>
              <div className={styles.cardActions}>
                <Link href={`/productos/collares/${c.id}?from=collares`} className={styles.detailBtn}>DETALLE</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}