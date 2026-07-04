"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

// Firebase imports
import { auth } from "../../lib/firebase-cliente";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function ForgotPage() { const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setLoading(true); 
  try { // 1. Verificar si el correo está registrado 
    const methods = await fetchSignInMethodsForEmail(auth, email); 
    if (methods.length === 0) { alert("Ese correo no existe en el sistema. Ingrese uno valido"); 
      setLoading(false); 
      return; 
    } 
      // 2. Si existe, mandar correo de recuperación 
      await sendPasswordResetEmail(auth, email); 
      alert( "Enlace enviado. Revise su correo" ); 
    } catch (error: unknown) { 
      console.error("Error:", error); 
      alert("Algo falló al intentar enviar el enlace."); 
    } 
    setLoading(false); 
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>

        {/* --- Columna Izquierda: Marca --- */}
        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <Image
              src="/Images/LogoLetra.png"
              alt="Lumina"
              width={300}
              height={120}
              className={styles.logo}
            />

            <p className={styles.tagline}>El brillo que te distingue</p>

            <div className={styles.iconWrapper}>
              <Image
                src="/Images/luminalogin.png"
                alt="Ícono diamante"
                width={160}
                height={160}
              />
            </div>
          </div>
        </div>

        {/* --- Columna Derecha: Formulario --- */}
        <div className={styles.formSide}>
          <div className={styles.formContent}>
            <h2 className={styles.title}>Recuperar acceso</h2>

            <p className={styles.subtitle}>
              Te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Correo electrónico</label>

                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.goldInput}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.goldButton}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>

            <div className={styles.backLink}>
              <Link href="/login" className={styles.linkText}>
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
