"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  updateProfile, 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  updatePassword, 
  signOut 
} from "firebase/auth";
import { auth } from "../../lib/firebase-cliente";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useUser } from "../context/UserContext";

export default function PerfilPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Campos para contraseña
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Estado para logout
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, setUser } = useUser();

  // ========================
  //  CARGA INICIAL DEL USER
  // ========================
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      if (!user || user.uid !== currentUser.uid) {
        setUser({
          ...currentUser,
          email: currentUser.email ?? undefined,
          displayName: currentUser.displayName ?? undefined,
        });
      }

      setDisplayName(currentUser.displayName || "");
    });

    return () => unsub();
  }, [router, setUser, user]);

  // ============================
  //       CAMBIAR NOMBRE
  // ============================
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile(auth.currentUser!, {
        displayName: displayName.trim(),
      });

      // Actualizamos contexto
      setUser(
        auth.currentUser
          ? {
              ...auth.currentUser,
              email: auth.currentUser.email ?? undefined,
              displayName: auth.currentUser.displayName ?? undefined,
            }
          : null
      );

      setSuccess(true);

      setTimeout(() => {
        router.refresh();
      }, 300);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError("No se pudo actualizar el nombre");
    } finally {
      setLoading(false);
    }
  }

  // ============================
  //      CAMBIAR CONTRASEÑA
  // ============================
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (!auth.currentUser || !auth.currentUser.email) {
      setPassError("No se pudo validar al usuario.");
      setPassLoading(false)
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError("Las contraseñas no coinciden.");
      setPassLoading(false)
      return;
    }

    setPassLoading(true);

    if (newPassword.length < 8) {
      setPassError("La nueva contraseña debe tener mínimo 8 caracteres");
      setPassLoading(false)
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setPassSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error("Error al cambiar contraseña:", err);
      setPassError("No se pudo cambiar la contraseña. Revisa tu contraseña actual.");
      setPassLoading(false)
    } finally {
      setPassLoading(false);
    }
  }

  // ============================
  //       CERRAR SESIÓN
  // ============================
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut(auth);
      setUser(null); // Limpiar contexto
      router.push("/login"); // O redirigir a home '/'
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  if (!user) return null;

  return (
    <>
      <Header showLoginButton={false} />

      <main className="min-h-screen bg-gradient-to-b from-[#fdfaf4] to-white py-10">
        <div className="max-w-md mx-auto px-6">

          {/* ---------------- PERFIL ---------------- */}
          <div className="bg-white/80 border border-[#e7ddc9] rounded-2xl p-8 shadow-sm mb-10">
            <h1 className="text-2xl font-bold tracking-wide text-gray-800 mb-6 text-center">
              Mi Perfil
            </h1>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold tracking-wide mb-2 text-gray-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-lg bg-gray-100 border border-[#d6c9b0] px-4 py-3 text-base text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El correo no se puede cambiar
                </p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold tracking-wide mb-2 text-gray-700">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="w-full rounded-lg bg-white border border-[#d6c9b0] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#c0a256]/40"
                  maxLength={50}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
                  ✓ Nombre actualizado correctamente
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 border border-[#d6c9b0] rounded-lg px-6 py-3 text-base font-medium tracking-wide hover:bg-[#f5efe2] transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading || !displayName.trim()}
                  className="flex-1 bg-[#c0a256] hover:bg-[#b09148] text-white font-semibold rounded-lg px-6 py-3 text-base tracking-wide disabled:opacity-60 shadow-sm transition-colors"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>

          {/* ------------- CAMBIAR CONTRASEÑA -------------- */}
          <div className="bg-white/80 border border-[#e7ddc9] rounded-2xl p-8 shadow-sm mb-10">
            <h2 className="text-xl font-bold tracking-wide text-gray-800 mb-6 text-center">
              Cambiar Contraseña
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#d6c9b0] px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#d6c9b0] px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-700">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#d6c9b0] px-4 py-3"
                  required
                />
              </div>

              {passError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
                  {passError}
                </div>
              )}

              {passSuccess && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
                  ✓ Contraseña actualizada correctamente
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 border border-[#d6c9b0] rounded-lg px-6 py-3 font-medium tracking-wide hover:bg-[#f5efe2]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="flex-1 bg-[#c0a256] hover:bg-[#b09148] text-white font-semibold rounded-lg px-6 py-3 tracking-wide disabled:opacity-60"
                >
                  {passLoading ? "Guardando..." : "Cambiar"}
                </button>
              </div>
            </form>
          </div>

          {/* ------------- LOGOUT -------------- */}
          <div className="mt-8 text-center">
             <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-red-600 hover:text-red-800 font-medium px-6 py-3 hover:bg-red-50 rounded-lg transition-colors"
              >
                {loggingOut ? "Cerrando..." : "Cerrar sesión"}
             </button>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}