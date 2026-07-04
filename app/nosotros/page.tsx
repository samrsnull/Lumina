import Image from "next/image";
import styles from "./nosotros.module.css";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Nosotros() {
    return (
        <>
            {/* Header va aquí arriba, pero dentro del fragmento */}
            <Header showLoginButton={true} />

            <section className={styles.container}>
                <div>
                    {/* Botón de regreso */}
                    <Link href="/" className={styles.backBtn}> ← Volver al inicio</Link>
                </div>
                
                <h1 className={styles.title}>Sobre Nosotros</h1>

                {/* Bloque 1: Historia (Texto Izq - Foto Der) */}
                <div className={styles.block}>
                    <div className={styles.text}>
                        <h2>Nuestra Historia</h2>
                        <p>
                            En <strong>Lumina</strong>, creemos que cada joya cuenta una historia. 
                            Nacimos con la pasión de crear piezas que acompañen momentos especiales 
                            y que reflejen la elegancia que vive en cada persona.
                        </p>
                    </div>

                    <Image
                        src="/Images/nosotros.webp"
                        alt="Joyería elegante Lumina"
                        width={450}
                        height={450}
                        className={styles.img}
                        style={{ maxWidth: "100%", height: "auto" }} 
                    />
                </div>

                {/* Bloque 2: Filosofía (Foto Izq - Texto Der - Reverse) */}
                <div className={styles.blockReverse}>
                    <Image
                        src="/Images/nosotros1.webp"
                        alt="Diseño de joyería Lumina"
                        width={450}
                        height={450}
                        className={styles.img}
                        style={{ maxWidth: "100%", height: "auto" }}
                    />

                    <div className={styles.text}>
                        <h2>Nuestra Filosofía</h2>
                        <p>
                            Cada pieza es creada con dedicación, cuidando cada detalle para lograr un 
                            equilibrio perfecto entre diseño, brillo y durabilidad.
                        </p>
                    </div>
                </div>

                {/* Bloque 3: Valores */}
                <div className={styles.values}>
                    <h2>Valores que nos definen</h2>
                    <ul>
                        <li>✦ <strong>Calidad:</strong> materiales cuidadosamente seleccionados.</li>
                        <li>✦ <strong>Elegancia:</strong> diseños que destacan con sutileza.</li>
                        <li>✦ <strong>Confianza:</strong> piezas hechas para durar.</li>
                        <li>✦ <strong>Pasión:</strong> amor por la joyería fina.</li>
                    </ul>
                </div>

                {/* Bloque Final */}
                <div className={styles.finalBlock}>
                    <h2>Nuestro Compromiso</h2>
                    <p>
                        En Lumina no solo vendemos joyas: creamos experiencias. Cada pieza está hecha 
                        para iluminar tus momentos más importantes y acompañarte con elegancia.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}