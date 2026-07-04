import Image from 'next/image';
import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      
      <div className={styles.heroContainer}>
        
        {/* Textos */}
        <div className={styles.heroText}>
          <span className={styles.subtitle}>Nueva Colección</span>
          <h1 id="hero-title" className={styles.title}>
            Collares que hablan por ti
          </h1>
          <p className={styles.description}>
            Cada detalle refleja elegancia; cada pieza está hecha a mano para contar una historia única. Descubre el brillo que mereces.
          </p>
          <Link href="/productos/collares" className={styles.btnPrimary}>
            Ver Colección
          </Link>
        </div>

        {/* Imagen */}
        <div className={styles.heroImg}>
          <Image
            src="/Images/Modelo1.png"
            alt="Modelo luciendo collar de la colección"
            width={550}
            height={550}
            priority
          />
        </div>
      </div>
    </section>
  );
}