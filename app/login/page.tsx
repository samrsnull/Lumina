"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../../lib/firebase-cliente";
import styles from "./page.module.css";
import Footer from "../../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------
  //              LOGIN CON CORREO
  // --------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember }),
      });

      if (response.ok) {
        const adminEmails = ["pruebaadmin@lumina.com", "renatogn62@gmail.com"];
        if (adminEmails.includes(user.email || "")) {
          router.push("/dashboard");
        } else {
          router.push(redirectTo);
        }
      } else {
        setError("Error al iniciar sesión en el servidor.");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error al intentar ingresar.");
      }
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------
  //              LOGIN CON GOOGLE
  // --------------------------------------------
  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: true }),
      });

      if (res.ok) {
        const adminEmails = ["pruebaadmin@lumina.com", "renatogn62@gmail.com"];
        if (adminEmails.includes(result.user.email || "")) {
          router.push("/dashboard");
        } else {
          router.push(redirectTo);
        }
      } else {
        setError("Error al crear sesión con Google.");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return;
      }
      setError("Error al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------
  //                RENDER
  // --------------------------------------------
  return (
    <main className={styles.loginPage}>
      <section className={styles.loginWrapper}>
        
        {/* ----------- COLUMNA IZQUIERDA ----------- */}
        <div className={styles.brandCol}>
          <div className={styles.brandInner}>
            <Image
              src="/Images/LogoLetra.png"
              alt="Lumina"
              width={300}
              height={120}
              className={styles.logo}
            />

            <h2 className={styles.tagline}>El brillo que te distingue</h2>

            <div className={styles.diamond}>
              <Image
                src="/Images/luminalogin.png"
                alt="Ícono diamante"
                width={160}
                height={160}
              />
            </div>
          </div>
        </div>

        {/* ----------- COLUMNA DERECHA (FORM) ----------- */}
        <div className={styles.formCol}>
          <div className={styles.card}>
            
            <header className={styles.cardHeader}>
              <h1>Iniciar sesión</h1>
              <p className={styles.cardSubtitle}>
                Accede a tu cuenta para continuar
              </p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {/* EMAIL */}
              <label className={styles.label} htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              {/* PASSWORD */}
              <label className={styles.label} htmlFor="password">Contraseña</label>
              <div className={styles.passwordRow}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* RECUÉRDAME + FORGOT */}
              <div className={styles.row}>
                <label className={styles.checkbox}>
                  <input 
                    type="checkbox" 
                    name="remember" 
                    checked={remember} 
                    onChange={(e) => setRemember(e.target.checked)} 
                  />
                  <span>Recuérdame</span>
                </label>

                {/* ← aquí agregué tu enlace adaptado */}
                <Link href="/forgot" className="forgot-pass_forgot mt-3">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* ERROR */}
              {error && (
                <p style={{ color: "red", fontSize: "0.9rem", textAlign: "center", marginTop: "0.5rem" }}>
                  {error}
                </p>
              )}

              {/* BOTÓN */}
              <button 
                type="submit" 
                className={styles.primaryBtn}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              {/* SEPARADOR */}
              <div className={styles.or}>o continuar con</div>

              {/* GOOGLE */}
              <div style={{ paddingTop: 12 }}>
                <button
                  className="google-btn w-full rounded-xl border px-4 py-2 font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Continuar con Google"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M21.35 11.1h-9.18v2.98h5.27a4.52 4.52 0 0 1-1.95 2.96 6.06 6.06 0 0 1-3.32.96 6.06 6.06 0 0 1-4.28-1.78 6.26 6.26 0 0 1-1.76-4.4 6.25 6.25 0 0 1 1.76-4.4 6.06 6.06 0 0 1 4.28-1.78c1.46 0 2.78.5 3.82 1.33l2.1-2.1A9.3 9.3 0 0 0 12.17 2 9.1 9.1 0 0 0 5.7 4.7 9.25 9.25 0 0 0 3 11.82a9.25 9.25 0 0 0 2.7 7.12A9.1 9.1 0 0 0 12.17 22c2.49 0 4.57-.82 6.08-2.37 1.56-1.56 2.41-3.77 2.41-6.42 0-.68-.05-1.28-.31-2.11Z" />
                  </svg>
                  Continuar con Google
                </button>
              </div>

              {/* OPCIONES INFERIORES */}
              <p className={styles.register}>
                ¿No tienes cuenta? <Link href="/singup" className={styles.link}>Regístrate</Link>
              </p>

              <p className={styles.register} style={{ marginTop: "1rem" }}>
                <Link href="/" className={styles.link}>Volver al Menú Principal</Link>
              </p>

            </form>
          </div>
        </div>

      </section>
      <Footer />
    </main>
  );
}