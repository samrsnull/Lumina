import Image from "next/image"; 
// import Hero from "../components/Hero"; // <-- Lo comento porque ya escribiste el código manualmente abajo
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Link from "next/link";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Header showLoginButton={true} />
      {/* Contenido principal */}
      <main className="container">
        {/* Sección Hero (Principal) */}
        <Hero />

        {/* Sección de categorías */}
        <section className="section" aria-labelledby="feat-title">
          {/* Título invisible para accesibilidad o puedes poner un h2 visible aquí */}
          <h2 id="feat-title" className="visually-hidden" style={{display:'none'}}>Categorías destacadas</h2>
          
          <div className="container">
            <div className="grid">
              
              {/* Tarjeta 1: Anillos */}
              <article className="card">
                <Image
                  src="/Images/anillos.webp"
                  alt="Anillos de colección"
                  width={300}
                  height={200}
                  style={{ borderRadius: "12px", width: "100%", height: "auto" }}
                />
                <h3 className="h3">Anillos</h3>
                <div className="card-text">
                  <p>
                    Descubre anillos diseñados para cada momento de tu vida.
                    Desde estilos minimalistas hasta piezas con piedras que roban miradas.
                  </p>
                </div>
                <Link href="/productos/anillos" className="btn1">Comprar</Link>
              </article>

              {/* Tarjeta 2: Pulseras */}
              <article className="card">
                <Image
                  src="/Images/pulseras.jpg"
                  alt="Pulseras elegantes"
                  width={300}
                  height={200}
                  style={{ borderRadius: "12px", width: "100%", height: "auto" }}
                />
                <h3 className="h3">Pulseras</h3>
                <div className="card-text">
                  <p>
                    Detalles que marcan la diferencia. Pulseras versátiles y sofisticadas,
                    ideales para llevar solas o combinadas.
                  </p>
                </div>
                <Link href="/productos/pulseras" className="btn1">Comprar</Link>
              </article>

              {/* Tarjeta 3: Collares */}
              <article className="card">
                <Image
                  src="/Images/collarPerla.jpg"
                  alt="Collares con estilo"
                  width={300}
                  height={200}
                  style={{ borderRadius: "12px", width: "100%", height: "auto" }}
                />
                <h3 className="h3">Collares</h3>
                <div className="card-text">
                  <p>
                    Collares únicos que iluminan tu estilo. Desde cadenas delicadas hasta
                    diseños con brillo impactante.
                  </p>
                </div>
                <Link href="/productos/collares" className="btn1">Comprar</Link>
              </article>

            </div>
          </div>
        </section>

        {/* Sección FAQ */}
        <FAQ />       
      </main>
      {/* Pie de página */}
      <Footer />
    </>
  );
}