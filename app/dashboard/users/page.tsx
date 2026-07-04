import Header from "@/components/Header";
import UsersClient from "./UsersClient";

export const runtime = "nodejs";

export default function DashboardUsersPage() {
  return (
    <>
      <Header variant="dashboard" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <UsersClient />
      </main>
    </>
  );
}