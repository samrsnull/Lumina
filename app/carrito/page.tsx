"use client";

import React from "react";
import Link from "next/link";
import CartClient from "./CartClient";

export default function Page() {
  return (
    <main style={{ padding: "6rem 1rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto 18px", display: "flex", justifyContent: "flex-start" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button style={{ padding: "8px 12px", borderRadius: 10, background: "#f2c94c", border: "none", fontWeight: 700 }}>← Volver al inicio</button>
        </Link>
      </div>
      <CartClient />
    </main>
  );
}
