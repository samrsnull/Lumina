import Link from "next/link";
import { anillosData } from "@/data/anillos";
import styles from "./anillos.module.css";
import Header from "@/components/Header";

export default function AnillosListadoPage() {
  return (
    <>
    {/* Agregamos el Header aquí */}
			<Header showLoginButton={true}/>
    <main className="container section">
      <div style={{ marginBottom: 12 }}>
        <Link href="/" className={styles.backBtn}>&larr; Volver al inicio</Link>
      </div>
      <h1 className={styles.listHeading}>Anillos Lumina</h1>
      <div className={styles.cardsGrid}>
        {anillosData.map(a => (
          <div key={a.id} className={styles.productCard}>
            <div className={styles.imageWrap}>
              <img src={a.imagen} alt={a.nombre} className={styles.cardImage} />
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{a.nombre}</h2>
              <p className={styles.cardPrice}>${a.precio.toLocaleString("es-MX")}</p>
              <div className={styles.cardRating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < a.rating ? `${styles.star} ${styles.filled}` : styles.star}>★</span>
                ))}
              </div>
              <div className={styles.cardActions}>
                <Link href={`/productos/anillos/${a.id}`} className={styles.detailBtn}>DETALLE</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}