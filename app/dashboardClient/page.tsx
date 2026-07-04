import Image from "next/image";
import styles from "./dashboard.module.css";
import Link from "next/link";

export default function Dashboard() {
    return (
        <section className={styles.container}>
            
            {/* Botón para volver al inicio */}
            <Link href="/" className={styles.backBtn}>← Volver al inicio</Link>

            {/* Encabezado del Dashboard */}
            <div className={styles.header}>
                <div>
                    <h1>Bienvenida, Damaris</h1>
                    <p>Este es tu panel personal en Lumina ✨</p>
                </div>

                <Image
                    src="/Images/user.jpg"
                    alt="Foto de usuario"
                    width={90}
                    height={90}
                    className={styles.profileImg}
                />
            </div>

            {/* Tarjetas principales */}
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3>Mis Pedidos</h3>
                    <p>Consulta el estado de tus compras.</p>
                    <Link href="/dashboard/pedidos" className={styles.btn}>Ver pedidos</Link>
                </div>

                <div className={styles.card}>
                    <h3>Favoritos</h3>
                    <p>Joyas que guardaste para después.</p>
                    <Link href="/dashboard/favoritos" className={styles.btn}>Ver favoritos</Link>
                </div>

                <div className={styles.card}>
                    <h3>Mi Perfil</h3>
                    <p>Actualiza tu información personal.</p>
                    <Link href="/dashboard/perfil" className={styles.btn}>Editar perfil</Link>
                </div>

                <div className={styles.card}>
                    <h3>Ajustes</h3>
                    <p>Preferencias y seguridad de tu cuenta.</p>
                    <Link href="/dashboard/ajustes" className={styles.btn}>Ir a ajustes</Link>
                </div>
            </div>

            {/* Pedidos recientes */}
            <div className={styles.recent}>
                <h2>Pedidos Recientes</h2>

                <div className={styles.recentItem}>
                    <Image
                        src="/Images/anillo1.jpg"
                        width={80}
                        height={80}
                        alt="Anillo"
                        className={styles.productImg}
                    />
                    <div>
                        <p><strong>Anillo Solitario Oro</strong></p>
                        <p>Fecha: 20 Nov 2024</p>
                    </div>
                    <span className={styles.status}>Entregado</span>
                </div>

                <div className={styles.recentItem}>
                    <Image
                        src="/Images/collar.jpg"
                        width={80}
                        height={80}
                        alt="Collar"
                        className={styles.productImg}
                    />
                    <div>
                        <p><strong>Collar Estrella Lumina</strong></p>
                        <p>Fecha: 3 Dic 2024</p>
                    </div>
                    <span className={styles.statusPending}>En tránsito</span>
                </div>
            </div>

        </section>
    );
}
