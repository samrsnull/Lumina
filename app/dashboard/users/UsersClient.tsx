"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  disabled: boolean;
  creationTime: string;
  lastSignInTime: string | null;
  providers: string[];
};

function providerLabel(id: string): string {
  switch (id) {
    case "password":
      return "Email";
    case "google.com":
      return "Google";
    case "facebook.com":
      return "Facebook";
    case "github.com":
      return "GitHub";
    default:
      return id;
  }
}

export default function UsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setErr(null);
        setLoading(true);
        const res = await fetch("/api/admin/users");

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Error ${res.status}`);
        }

        const data = await res.json();
        setUsers(data.users ?? []);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* 🚀 Encabezado - Más limpio y espaciado */}
      <section className="dashboard-header flex flex-col gap-1">
        <p className="text-sm text-slate-400">Administración</p>
        <h1 className="text-3xl font-bold text-white">Usuarios</h1>
        <p className="mt-1 text-sm text-slate-400">
          Lista de usuarios desde la API /api/admin/users (Firebase Auth).
        </p>

        {/* Mantenemos el link de "Volver" con el color de marca */}
        <div className="mt-4">
          <Link
                href="/dashboard"
                style={{ 
                    color: 'var(--brand--600)', 
                    textDecoration: 'none', 
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
             ← Volver al dashboard
            </Link>
        </div>
      </section>

      {/* 📊 Contenido principal - La tabla dentro de la card */}
      <section className="cardT">
        {loading && (
          <p className="text-sm text-slate-400" style={{ color: 'var(--muted)' }}>Cargando usuarios...</p>
        )}

        {err && <p className="mb-4 text-sm text-red-300">{err}</p>}

        {!loading && !err && users.length === 0 && (
          <p className="text-sm text-slate-400" style={{ color: 'var(--muted)' }}>
            No hay usuarios aún. Pídele a alguien que se registre en la app 😊
          </p>
        )}

        {!loading && !err && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="user-table">
              <thead>
                <tr>
                  {/* Se usará el <th> del CSS: uppercase, más pequeño, color muted */}
                  <th style={{ width: '25%' }}>Nombre</th> 
                  <th style={{ width: '35%' }}>Email</th>
                  <th style={{ width: '20%' }}>UID</th>
                  <th style={{ width: '10%' }}>Último acceso</th>
                  <th style={{ width: '10%' }}>Método de acceso</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid}>
                    <td>
                      {u.displayName ?? (
                        <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                          Sin nombre
                        </span>
                      )}
                    </td>
                    <td>
                      {u.email ?? (
                        <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Sin email</span>
                      )}
                    </td>
                    {/* El UID lo mantenemos pequeño y monoespaciado */}
                    <td className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{u.uid}</td>
                    {/* La fecha también pequeña y con color secundario */}
                    <td style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {u.lastSignInTime
                        ? new Date(u.lastSignInTime).toLocaleDateString("es-MX", {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : "Nunca"}
                    </td>
                    <td>
                      {u.providers.length === 0 ? (
                        <span className="access-badge" style={{ backgroundColor: 'var(--border)', color: 'var(--muted)', borderColor: 'var(--border)' }}>
                          Desconocido
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {u.providers.map((p) => (
                            <span
                              key={p}
                              className="access-badge" // Usamos la nueva clase de badge
                            >
                              {providerLabel(p)}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}