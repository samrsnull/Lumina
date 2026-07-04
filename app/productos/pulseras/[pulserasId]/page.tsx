import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import PulseraClient from "./PulseraClient";

type Pulsera = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  rating: number;
  descripcion: string;
};

const pulserasData: Pulsera[] = [
  { id: "set-pulseras-oro", nombre: "Set Pulseras de Oro", precio: 2200, imagen: "/Images/pulseras.webp", rating: 5, descripcion: "Set de tres pulseras de oro para combinar y crear un look único." },
  { id: "pulsera-dije-corazon", nombre: "Pulsera Dije Corazón", precio: 1200, imagen: "/Images/pulseras.jpg", rating: 5, descripcion: "Encantadora pulsera con dijes de corazón y llave, ideal para regalar." },
  { id: "pulsera-moderna", nombre: "Pulsera Dorada Moderna", precio: 1500, imagen: "/Images/pulseras.png", rating: 4, descripcion: "Un look moderno y sofisticado con estas pulseras de eslabones dorados." }
];

export async function generateStaticParams() {
  return pulserasData.map(p => ({ pulserasId: p.id }));
}

export default async function PulseraDetallePage({ params }: { params: { pulserasId: string } }) {
  const { pulserasId } = await params as { pulserasId: string };
  const pulsera = pulserasData.find(p => p.id === pulserasId);
  if (!pulsera) notFound();

  return (
    <>
      <Header showLoginButton={true} />
      <main className="container section">
        {/* Back link handled inside the client component using `?from=` query param */}
        <PulseraClient pulsera={pulsera} />
      </main>
      <Footer />
    </>
  );
}