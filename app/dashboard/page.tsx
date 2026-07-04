import Link from "next/link";
import { getServerUser } from "@/lib/auth-server";
import Header from "@/components/Header";
import './dashboard.css';

export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await getServerUser();

  // Datos de ejemplo para las métricas
  const stats = [
    { title: "Usuarios", value: "24", note: "+1 Nuevo hoy (0 ayer)", className: "" },
    { title: "Categorías", value: "5", note: "Noticias, Blog, Tareas…", className: "muted-text" }, // Clase para estilizar la nota
    { title: "Publicaciones", value: "18", note: "Número de entradas (total)", className: "" },
  ];

  // Datos de ejemplo para la tabla (se añadió una segunda fila)
  const recentUsers = [
    { email: "pruebaadmin@lumina.com", date: "30/11/2023" },
    { email: "usuario1@ejemplo.com", date: "01/12/2023" },
    { email: "usuario2@ejemplo.com", date: "01/12/2023" },
  ];

  return (
    <>
      <Header variant="dashboard" />

      <main>
        {/* Encabezado */}
        <section className="dashboard-header">
          <div>
            <p>Panel de administración</p>
            <h1>
              {user ? (
                <>
                  Hola, <span className="highlight">{user.displayName ?? user.email ?? user.uid}</span>
                </>
              ) : (
                "Dashboard"
              )}
            </h1>
            <p>Desde aquí puedes revisar usuarios, categorías y contenido de la clase.</p>
          </div>
          {/* Se elimina la tarjeta de "Sesión activa" para mejorar el foco */}
        </section>

        {/* Estadísticas - Usando una cuadrícula (grid) */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <p className="title">{stat.title}</p>
              <p className="value">{stat.value}</p>
              {/* Aplicar clase condicional a la nota */}
              <p className={`note ${stat.className}`}>{stat.note}</p>
            </div>
          ))}
        </section>

        {/* Contenido principal: Usuarios recientes y Acciones rápidas */}
        <section className="content-grid">
          {/* Usuarios recientes */}
          <div className="card">
            <h2>👥 Usuarios recientes</h2> {/* Se añade icono */}
            <table className="user-table">
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Fecha de registro</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((item, index) => (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Acciones rápidas */}
          <div className="card quick-actions">
            <h2>⚡ Acciones rápidas</h2> {/* Se añade icono */}
            <p>Lo más usado.</p>
            {/* Se añade icono de lista a los enlaces */}
            <Link href="/dashboard/users">
                <span>➕</span> Ver usuarios
            </Link>
            <Link href="/dashboard/categories">
                <span>📂</span> Administrar categorías
            </Link>
          </div>
        </section>

        {/* Mensaje si no hay usuario */}
        {!user && (
          <p style={{ color: "red", fontSize: "0.875rem", marginTop: "1rem" }}>
            No hay sesión válida. Verifica el middleware o la cookie de sesión.
          </p>
        )}
      </main>
    </>
  );
}