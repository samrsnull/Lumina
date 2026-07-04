"use client"; // indicates that this component is rendered on the client (React hooks available)
import React, { useState } from "react"; // import React and useState hook for local state
import "./signup.css" // <-- import custom CSS
import Link from "next/link"; // Next.js Link component for internal navigation
import { useRouter } from "next/navigation"; // hook for programmatic redirection in Next 13+
// Header removed to show a clean signup page
import { auth } from "../../lib/firebase-cliente"; // Firebase auth instance initialized in lib
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Firebase auth functions
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Google authentication provider
import Image from "next/image"; // Import the Next.js Image component
import Footer from "../../components/Footer";

export default function SignUpPage() { // signup page component
  const router = useRouter(); // router for router.push(...)
  const [name, setName] = useState(""); // state for name
  const [email, setEmail] = useState(""); // state for email
  const [password, setPassword] = useState(""); // state for password
  const [confirm, setConfirm] = useState(""); // state to confirm password
  const [agree, setAgree] = useState(false); // state for terms checkbox
  const [loading, setLoading] = useState(false); // state for submission loading
  const [isError, setIsError] = useState(false); // flag to indicate error
  const [message, setMessage] = useState<string | null>(null); // message to display to the user

  async function handleFirebaseSignUp(e: React.FormEvent<HTMLFormElement>) { // submit handler
    e.preventDefault(); // prevents page reload
    setMessage(null); // clears previous messages
    setIsError(false); // resets error flag

    if (!name.trim() || !email.trim() || !password || !confirm) { // validates empty fields
      setIsError(true);
      setMessage("Completa todos los campos.");
      return; // exits if any field is missing
    }
    if (password.length < 8) { // validates minimum password length
      setIsError(true);
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) { // validates matching passwords
      setIsError(true);
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    if (!agree) { // validates terms acceptance
      setIsError(true);
      setMessage("Debes aceptar términos y privacidad.");
      return;
    }

    setLoading(true); // activates loading indicator
    try {
      // 1. Crear usuario en Firebase
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      // 2. Actualizar perfil (Nombre)
      if (cred.user && name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() }); 
      }

      // --- NUEVO: Lógica de Cookie de Sesión ---
      
      // 3. Obtener el token de identificación
      const idToken = await cred.user.getIdToken();

      // 4. Llamar a la API para crear la cookie
      const response = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: true }), // Por defecto recordamos la sesión al registrarse
      });

        if (response.ok) {
        setIsError(false);
        setMessage("¡Cuenta creada! Entrando...");
        router.push("/");
        router.refresh();
      } else {
        // No queremos error rojo ni estado de error
        setIsError(false);
        setMessage("Cuenta creada. Por favor inicia sesión para continuar.");
        setTimeout(() => router.push("/login"), 1500);
      }

    } catch (err: unknown) {
      console.error("Firebase signup error:", err);

      setIsError(true);

      // Normalizar el error desconocido a una forma con código opcional
      type AuthErrorLike = { code?: string; message?: string };
      const authErr = err as AuthErrorLike;

      // Detectar error de correo en uso
      if (authErr.code === "auth/email-already-in-use") {
        setMessage("Este correo ya está registrado. Intenta iniciar sesión.");
      } 
      // Contraseña débil (Firebase exige 6 caracteres mínimo)
      else if (authErr.code === "auth/weak-password") {
        setMessage("La contraseña es demasiado débil. Usa mínimo 6 caracteres.");
      } 
      // Otro error cualquiera
      else {
        setMessage("No se pudo crear la cuenta. Intenta de nuevo.");
      }
    }
  }


  const signupWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider); // ✅ usa auth importado
      
      const idToken = await result.user.getIdToken();
      const response = await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: true }),
      });

      if (response.ok) {
        // Al iniciar sesión con Google, redirigimos al inicio para que el header muestre la sesión
        router.push("/");
        router.refresh();
      } else {
        console.error("Error sesión Google");
      }
    } catch (error) {
      console.error("Error en el registro con Google:", error);
    }
  }

  return (
    <div className="lumina-signup-root">

      <section className="lumina-section relative overflow-hidden min-h-screen"> {/* hero section occupying at least the full screen */}
        {/* background */}
        <div className="bg-gradient absolute inset-0" /> 
        {/* background gradient positioned behind content */}

        {/* main layout */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12 relative h-full flex items-center">
          {/* centered container with max width */}
          <div className="grid md:grid-cols-12 gap-12 items-center w-full">
            {/* responsive 12-column grid */}

            {/* Hero left: Brand Column (Replaces original Hero content) */}
            <div className="hero-left md:col-span-7 md:col-start- px-5 md:px-0">
              {/* Container centering the brand elements */}
              <div className="flex flex-col items-center justify-center w-full text-center">
                {/* Logo Image */}
                <Image
                  src="/Images/LogoLetra.png"
                  alt="Lumina"
                  width={300}
                  height={120}
                  className="block" 
                />
                {/* Slogan / tagline */}
                <h2 className="text-xl font-semibold text-slate-800 mt-2 mb-8 text-center">
                  El brillo que te distingue
                </h2>

                {/* Diamond Icon Container */}
                {/* Uses light background from Lumina palette (fdf5e6) */}
                <div className="flex flex-col items-center justify-center w-full text-center">
                  <Image
                    src="/Images/luminalogosolo.png"
                    alt="Ícono diamante"
                    width={160}
                    height={160}
                    // Centering the image within its container
                    className="block"
                  />
                </div>
              </div>
            </div>

            {/* Right Card Column */}
            <div className="card-right md:col-span-7 flex justify-center px-6 md:px-0">
              {/* registration card container */}
              <div className="card-wrapper rounded-3xl p-8 shadow-2xl w-full max-w-2xl">
                {/* card header */}
                <header className="mb-6 text-center">
                  <div className="avatar-placeholder">
                    {/* Icon with dark color */}
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-900" fill="currentColor" aria-hidden="true">
                      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5.33 0-8 2.67-8 6v1h16v-1c0-3.33-2.67-6-8-6Z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-semibold text-slate-900">Crear cuenta</h2>
                  <p className="mt-1 text-sm text-slate-600">Completa los campos para registrarte.</p>
                </header>

                <form className="space-y-4" 
                onSubmit={handleFirebaseSignUp}> {/* form that calls the Firebase function on submit */}
                  <div>
                    {/* Field label with dark color */}
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-900">Nombre</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)} // updates name state when typing
                      placeholder="Tu nombre"
                      required
                      // Input with yellow focus ring
                      className="w-full rounded-xl border-[#e6dccc] bg-[#fff3d9] px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#f0d58c]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-900">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} // updates email state
                      placeholder="tucorreo@dominio.com"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border-[#e6dccc] bg-[#fff3d9] px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#f0d58c]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-900">Contraseña</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // updates password state
                      placeholder="********"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="w-full rounded-xl border-[#e6dccc] bg-[#fff3d9] px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#f0d58c]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-slate-900">Confirmar contraseña</label>
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)} // updates confirm state
                      placeholder="********"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="w-full rounded-xl border-[#e6dccc] bg-[#fff3d9] px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-[#f0d58c]"
                    />
                  </div>
                  {/* Checkbox and login/forgot link */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-slate-600">
                     
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)} // toggles agree
                        className="rounded border-gray-300 bg-white"
                      />
                      Acepto términos y privacidad
                    </label>
                    <Link href="/login" className="text-slate-600 hover:text-slate-900">¿Ya tienes cuenta?</Link> {/* login link */}
                  </div>
                    <p className="text-slate-600 hover:text-slate-900">
                      ¿Ya tienes cuenta?{" "}
                      <Link href="/login" className="text-[#f0d58c] hover:text-[#e2cfa0]">
                        Inicia sesión
                      </Link>
                    </p>
                  {message && ( // if there is a message, displays it with style according to isError
                    <p
                      // Message color logic: red for error, Lumina yellow for success
                      className={`rounded-xl p-2 text-sm ${isError ? "bg-red-500/10 border border-red-500/30 text-red-700" : "bg-[#f0d58c]/20 border border-[#f0d58c]/50 text-slate-900"}`}
                      role="status"
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading} // disables while loading=true
                    className="inline-flex w-full items-center justify-center font-semibold" // button styles in signup.css
                  >
                    {loading ? "Creando..." : "Crear cuenta"} {/* changes text according to loading */}
                  </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1" /> 
                  <span className="text-xs text-slate-600">o</span>
                  <div className="h-px flex-1" />
                </div>

                <button
                  className="google-btn w-full rounded-xl border px-4 py-2 font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Continuar con Google"
                  type="button"
                  onClick={signupWithGoogle} // calls function
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M21.35 11.1h-9.18v2.98h5.27a4.52 4.52 0 0 1-1.95 2.96 6.06 6.06 0 0 1-3.32.96 6.06 6.06 0 0 1-4.28-1.78 6.26 6.26 0 0 1-1.76-4.4 6.25 6.25 0 0 1 1.76-4.4 6.06 6.06 0 0 1 4.28-1.78c1.46 0 2.78.5 3.82 1.33l2.1-2.1A9.3 9.3 0 0 0 12.17 2 9.1 9.1 0 0 0 5.7 4.7 9.25 9.25 0 0 0 3 11.82a9.25 9.25 0 0 0 2.7 7.12A9.1 9.1 0 0 0 12.17 22c2.49 0 4.57-.82 6.08-2.37 1.56-1.56 2.41-3.77 2.41-6.42 0-.68-.05-1.28-.31-2.11Z" />
                  </svg>
                  Continuar con Google
                </button>

                {/* Help link (FAQ) */}
                <p className="mt-6 text-center text-sm text-slate-600">
                  ¿Necesitas ayuda? 
                  <Link href="/#faq" className="text-[#f0d58c] hover:text-[#e2cfa0] font-medium">FAQ</Link>
                </p>
                
                {/* NEW: Link to return to main menu */}
                <p className="mt-3 text-center text-sm text-slate-600">
                  <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">Volver al Menú Principal</Link>
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Simple footer (styles in signup.css) */}
      <Footer />
    </div>
   );
 }