"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const router = useRouter();
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mostramos la ventana de éxito
    setEnviado(true);
  };

  const handleGoHome = () => {
    // Redirige al menú principal (raíz)
    router.push("/");
  };

  return (
    <section className="relative max-w-2xl mx-auto my-20 p-8 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
      
      {/* Ventana Emergente de Éxito */}
      {enviado && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm transition-all duration-500">
          <div className="text-center p-8 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#f4efc9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg 
                className="w-10 h-10 text-[#b29137]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-slate-900 uppercase tracking-[0.2em] mb-2">
              ¡Mensaje enviado!
            </h3>
            <p className="text-sm text-slate-500 mb-8 italic">
              Gracias {formData.nombre}, hemos recibido tu información correctamente.
            </p>
            <button
              onClick={handleGoHome}
              className="px-10 py-3 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-md"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}

      {/* Botón de Regreso (Historial) */}
      <button
        onClick={() => router.back()}
        className="group mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 hover:text-[#b29137] transition-colors duration-300"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="transition-transform duration-300 group-hover:-translate-x-1"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Regresar
      </button>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-light tracking-tight text-slate-900 uppercase">
          Cuéntanos tu <span className="text-[#b29137] font-semibold">proyecto</span>
        </h2>
        <p className="text-sm text-slate-500 mt-2 italic">Te responderemos en menos de 24 horas.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#b29137] mb-2">
            Nombre Completo
          </label>
          <input
            required
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            className="w-full px-4 py-3 bg-[#fcfaf2] border border-transparent rounded-lg focus:outline-none focus:border-[#b29137]/30 focus:bg-white transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#b29137] mb-2">
            Asunto
          </label>
          <input
            required
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            placeholder="Ingresa el motivo de tu consulta"
            className="w-full px-4 py-3 bg-[#fcfaf2] border border-transparent rounded-lg focus:outline-none focus:border-[#b29137]/30 focus:bg-white transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#b29137] mb-2">
            Tu Mensaje
          </label>
          <textarea
            required
            name="mensaje"
            rows={5}
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="¿Cómo podemos ayudarte?"
            className="w-full px-4 py-3 bg-[#fcfaf2] border border-transparent rounded-lg focus:outline-none focus:border-[#b29137]/30 focus:bg-white transition-all resize-none text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-lg shadow-slate-200"
        >
          Enviar Mensaje
        </button>
      </form>
    </section>
  );
}