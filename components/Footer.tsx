import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="bg-gradient-to-b from-[#f4efc9] to-[#eee8ba] text-slate-900 py-16 mt-20 border-t border-black/5"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Logo y Eslogan */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="relative group">
              <Image
                src="/Images/luminalogo.png"
                alt="Logo Lumina"
                width={120}
                height={80}
                className="rounded-lg transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-sm font-medium text-black/60 max-w-[200px] text-center md:text-left leading-relaxed">
              Iluminando cada detalle con elegancia y precisión.
            </p>
          </div>

          {/* Contacto Directo - Ahora redirige a /contacto */}
          <div className="flex flex-col items-center">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-[#b29137]">
              Contacto
            </h3>
            <div className="space-y-6 text-center">
              {/* Link al Formulario vía Teléfono */}
              <Link 
                href="/contact" 
                className="group block transition-all duration-300"
              >
                <span className="font-semibold block text-[10px] text-black/40 uppercase mb-1 tracking-widest group-hover:text-[#b29137]">
                  Llámanos
                </span>
                <span className="text-sm text-black/70 group-hover:text-black border-b border-transparent group-hover:border-[#b29137]/30 pb-1">
                  +52 722 123 4567
                </span>
              </Link>

              {/* Link al Formulario vía Email */}
              <Link 
                href="/contact" 
                className="group block transition-all duration-300"
              >
                <span className="font-semibold block text-[10px] text-black/40 uppercase mb-1 tracking-widest group-hover:text-[#b29137]">
                  Email
                </span>
                <span className="text-sm text-black/70 group-hover:text-black border-b border-transparent group-hover:border-[#b29137]/30 pb-1">
                  somos@lumina.com
                </span>
              </Link>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-[#b29137]">
              Síguenos
            </h3>
            <div className="flex gap-8">
              <Link href="#" className="flex flex-col items-center group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 group-hover:bg-[#b29137]/10 transition-all duration-300">
                  <Image
                    src="/Images/instagram.png"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-[10px] mt-2 text-black/50 group-hover:text-black uppercase font-bold tracking-widest transition-colors">
                  Instagram
                </span>
              </Link>

              <Link href="#" className="flex flex-col items-center group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 group-hover:bg-[#b29137]/10 transition-all duration-300">
                  <Image
                    src="/Images/facebook.png"
                    alt="Facebook"
                    width={20}
                    height={20}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-[10px] mt-2 text-black/50 group-hover:text-black uppercase font-bold tracking-widest transition-colors">
                  Facebook
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Separador y Copyright */}
        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-black/40 tracking-wider">
            © {new Date().getFullYear()} LUMINA STUDIO. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-6 text-[11px] text-black/40 font-medium">
            <Link href="#" className="hover:text-[#b29137] transition-colors">POLÍTICA DE PRIVACIDAD</Link>
            <Link href="#" className="hover:text-[#b29137] transition-colors">TÉRMINOS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}