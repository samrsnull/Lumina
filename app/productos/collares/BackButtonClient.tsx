"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./collares.module.css";

export default function BackButtonClient() {
  const [href, setHref] = useState<string>("/productos");

  useEffect(() => {
    try {
      const ref = document.referrer || "";
      const origin = location.origin;
      let resolved = "/productos";

      if (ref.startsWith(origin)) {
        const path = ref.slice(origin.length);
        if (path === "/" || path === "") resolved = "/"; // came from homepage
        else if (path.startsWith("/productos")) resolved = "/productos";
        else resolved = "/productos";
      } else {
        // external referrer or no referrer — fallback to productos
        resolved = "/productos";
      }

      setHref(resolved);
    } catch (e) {
      setHref("/productos");
    }
  }, []);

  return (
    <Link href={href} className={styles.backBtn}>
      ← Volver
    </Link>
  );
}
