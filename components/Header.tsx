"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import CartButton from "../components/CartButton";
import { useUser } from "../app/context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase-cliente";

type Props = {
  showLoginButton?: boolean;
  variant?: "public" | "dashboard";
  hideNav?: boolean;
};

export default function Header({
  showLoginButton = true,
  variant = "public",
  hideNav = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = variant === "dashboard";

  const { user, setUser } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const { clear } = useCart();

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut(auth);
      await fetch("/api/sessionLogout", { method: "POST" });

      setUser(null); // 🔥 clave
      clear();       // 🔥 limpia carrito

      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Error al cerrar sesión", e);
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    if (user !== undefined) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/sessionUser");
        if (!mounted) return;

        const data = await res.json();
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user, setUser]);

  return (
    <header className="site-header">
      <nav className="container nav">
        {/* LOGO */}
        <div className="nav-logo">
          <Link href={isDashboard ? "/dashboard" : "/"} aria-label="Ir al inicio">
            <Image
              src="/Images/LogoLetra.png"
              alt="Logo Lumina"
              width={220}
              height={200}
              style={{
                maxWidth: "90px",
                width: "100%",
                margin: "0 1rem 0 0",
                borderRadius: "12px",
              }}
            />
          </Link>
        </div>

        {/* LINKS */}
        {isDashboard ? (
          <nav className="nav-links">
            <Link href="/dashboard" className="navLink">Panel</Link>
            <Link href="/dashboard/users" className="navLink">Usuarios</Link>
            <Link href="/dashboard/categories" className="navLink">Categorías</Link>
          </nav>
        ) : (
          !hideNav && (
            <nav className="nav-links">
              <Link href="/productos" className="navLink">Productos</Link>
              <Link href="/nosotros" className="navLink">Nosotros</Link>
              <Link href="/contact" className="navLink">Contacto</Link>
            </nav>
          )
        )}

        {/* MENU */}
        <ul className="menu">
          {!isDashboard && pathname !== "/signup" && (
            <li>
              <CartButton
                key={user ? "logged" : "guest"} // 🔥 reinicia estado visual
                onClick={!user ? () => router.push("/login") : undefined}
                className="cartLink"
                ariaLabel="Ir al carrito"
              />
            </li>
          )}

          {isDashboard ? (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="btnTransparente"
              >
                {loggingOut ? "Cerrando..." : "Cerrar sesión"}
              </button>
            </li>
          ) : (
            showLoginButton && (
              <>
                {!user && (
                  <>
                    {pathname !== "/login" && pathname !== "/singup" && (
                      <li>
                        <Link href="/login" className="btnTransparente">
                          Iniciar sesión
                        </Link>
                      </li>
                    )}

                    {pathname !== "/singup" && (
                      <li>
                        <Link href="/singup" className="btnYellow">
                          Registrarse
                        </Link>
                      </li>
                    )}
                  </>
                )}

                {user && (
                  <li className="navGreeting">
                    <Link
                      href="/perfil"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Hola, {user.displayName ?? user.email}
                    </Link>
                  </li>
                )}
              </>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}