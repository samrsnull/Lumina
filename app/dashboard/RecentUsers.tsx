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
};

export default function RecentUsers() {
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
        const all: AdminUser[] = data.users ?? [];

        // Opcional: ordenamos por lastSignInTime descendente
        const sorted = [...all].sort((a, b) => {
          const ta = a.lastSignInTime ? Date.parse(a.lastSignInTime) : 0;
          const tb = b.lastSignInTime ? Date.parse(b.lastSignInTime) : 0;
          return tb - ta;
        });

        // Nos quedamos con los primeros 3
        setUsers(sorted.slice(0, 3));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : typeof e === "string" ? e : undefined;
        setErr(msg ?? "Error al cargar usuarios recientes");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-slate-400">
        Cargando usuarios recientes...
      </p>
    );
  }

  if (err) {
    return (
      <p className="text-sm text-red-300">
        {err}
      </p>
    );
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No hay usuarios aún. Pídele a alguien que se registre 😊
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <ul className="divide-y divide-slate-800/70">
        {users.map((u) => (
          <li
            key={u.uid}
            className="py-2 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-slate-100">
                {u.displayName ?? u.email ?? (
                  <span className="text-slate-500 italic">Sin nombre</span>
                )}
              </p>
              <p className="text-xs text-slate-400">
                {u.email ?? "Sin email"}
              </p>
            </div>
            <span className="text-[11px] text-slate-500">
              {u.lastSignInTime
                ? new Date(u.lastSignInTime).toLocaleDateString("es-MX")
                : "Nunca"}
            </span>
          </li>
        ))}
      </ul>

      <div className="pt-2">
        <Link
          href="/dashboard/users"
          className="text-xs text-emerald-400 hover:text-emerald-300"
        >
          Ver todos los usuarios →
        </Link>
      </div>
    </div>
  );
}