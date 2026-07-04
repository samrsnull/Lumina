import Header from "@/components/Header";
import CategoriesClient from "./CategoriesClient";

export const runtime = "nodejs";

export default function DashboardCategoriesPage() {
  return (
    <>
      <Header variant="dashboard" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <CategoriesClient />
      </main>
    </>
  );
}