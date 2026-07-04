import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import CollarClient from "./CollarClient";
import { collaresData } from "@/data/collares";

export async function generateStaticParams() {
  return collaresData.map(c => ({ collaresId: c.id }));
}

// Si quieres permitir ids fuera del array quita generateStaticParams y añade:
// export const dynamic = "force-dynamic";

export default async function CollarDetallePage({ params }: { params: { collaresId: string } }) {
  const { collaresId } = await params as { collaresId: string };
  const collar = collaresData.find(c => c.id === collaresId);
  if (!collar) notFound();
  return (
    <>
      <Header showLoginButton={true} />
      <main className="container section">
        {/* Back link handled inside the client component using `?from=` query param */}
        <CollarClient collar={collar} />
      </main>
      <Footer />
    </>
  );
}