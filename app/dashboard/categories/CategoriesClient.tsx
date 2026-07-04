"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#f0c058");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadCategories() {
    try {
      setErr(null);
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setCategories(data.categories ?? []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setColor("#f0c058");
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setErr("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    setErr(null);
    try {
      const body = { name, description, color };
      let res: Response;

      if (editingId) {
        res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");

      await loadCategories();
      resetForm();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al guardar categoría");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setColor(cat.color || "#f0c058");
    // Scroll suave hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      setErr(null);
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al eliminar");
      await loadCategories();
      if (editingId === id) resetForm();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al eliminar categoría");
    }
  }

  // --- Estilos Inline para consistencia ---
  const inputStyle = {
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    backgroundColor: "var(--surface)", // Fondo blanco limpio
    color: "var(--text)",
    fontSize: "0.95rem",
    outline: "none",
    marginTop: "0.3rem",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
    transition: "border-color 0.2s, box-shadow 0.2s"
  };

  const labelStyle = {
    fontSize: "0.75rem",
    color: "var(--muted)",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "0.2rem",
    display: "block"
  };

  return (
    <main>
      {/* Encabezado */}
      <header className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="text-sm text-slate-400">Administración</p>
            <h1 style={{ fontSize: '2.5rem', margin: '0.2rem 0' }}>Categorías</h1>
            <p style={{ maxWidth: '600px', margin: 0 }}>
              Gestiona las etiquetas de tus productos. El <span style={{ color: 'var(--brand)', fontWeight: 600 }}>Slug</span> se genera automáticamente.
            </p>
          </div>
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
      </header>

      {/* Grid Layout: Formulario (Izq) - Lista (Der) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        alignItems: 'start' 
      }}>
        
        {/* --- COLUMNA 1: FORMULARIO (Sticky en Desktop) --- */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <section className="card" style={{ borderTop: '4px solid var(--brand)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              {editingId ? "Editar Categoría" : "Crear Nueva"}
            </h2>

            {err && (
              <div style={{ 
                  color: '#b91c1c', backgroundColor: '#fef2f2', padding: '0.75rem', 
                  borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fca5a5', fontSize: '0.9rem' 
              }}>
                  {err}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  style={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Collares de Perlas"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Descripción (Opcional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descripción para SEO..."
                />
              </div>

              <div>
                <label style={labelStyle}>Color Distintivo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="color"
                        style={{ 
                            ...inputStyle, padding: '0', height: '45px', width: '60px', 
                            cursor: 'pointer', overflow: 'hidden', paddingBlock: 0, paddingInline: 0 
                        }}
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{color}</span>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                      backgroundColor: 'var(--brand)',
                      color: '#000',
                      border: 'none',
                      padding: '0.9rem',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      opacity: saving ? 0.7 : 1,
                      boxShadow: '0 4px 6px rgba(240, 192, 88, 0.2)'
                  }}
                >
                  {saving ? (editingId ? "Guardando..." : "Creando...") : (editingId ? "Guardar Cambios" : "Crear Categoría")}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{ 
                        background: 'transparent', border: '1px solid var(--border)', 
                        padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', 
                        color: 'var(--muted)', fontWeight: 600 
                    }}
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* --- COLUMNA 2: LISTA DE CATEGORÍAS --- */}
        <div>
           {/* Header de la sección de lista */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>Listado ({categories.length})</h3>
           </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Cargando datos...</div>
          ) : categories.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>No hay categorías registradas.</p>
              <p style={{ fontSize: '0.9rem' }}>Utiliza el formulario para añadir la primera.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {categories.map((cat) => (
                <article
                  key={cat.id}
                  className="card"
                  style={{
                      padding: '0', // Reset padding para controlar bordes internos
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden', // Para que la barra de color no se salga
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      position: 'relative'
                  }}
                >
                    {/* Barra de color superior */}
                    <div style={{ height: '6px', backgroundColor: cat.color, width: '100%' }}></div>
                    
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)' }}>
                                {cat.name}
                            </h3>
                            <span style={{ 
                                fontSize: '0.7rem', color: 'var(--muted)', 
                                background: '#f3f4f6', padding: '2px 6px', 
                                borderRadius: '4px', border: '1px solid #e5e7eb',
                                fontFamily: 'monospace'
                            }}>
                                /{cat.slug}
                            </span>
                        </div>

                        <p style={{ 
                            fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 1.5rem 0', 
                            lineHeight: '1.5', flex: 1 
                        }}>
                            {cat.description || "Sin descripción."}
                        </p>

                        <div style={{ 
                            paddingTop: '1rem', borderTop: '1px solid var(--border)', 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                        }}>
                             <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleEdit(cat)}
                                    title="Editar"
                                    style={{ 
                                        background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', 
                                        width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center',
                                        color: 'var(--text)'
                                    }}
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    title="Eliminar"
                                    style={{ 
                                        background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', 
                                        width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center',
                                        color: '#b91c1c'
                                    }}
                                >
                                    ✕
                                </button>
                             </div>
                        </div>
                    </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}