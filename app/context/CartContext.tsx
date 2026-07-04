"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  categoria?: string;
  qty: number;
};

type AddItemInput = Omit<CartItem, "qty">;

type CartContextType = {
  items: CartItem[];
  addItem: (item: AddItemInput, qty?: number) => void;
  removeItem: (id: string, opts?: { color?: string; size?: string }) => void;
  updateQty: (id: string, qty: number, opts?: { color?: string; size?: string }) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const prevUserRef = useRef<string | null | undefined>(undefined);

  const storageKey = (uid?: string | null) =>
    uid ? `lumina:cart:${uid}` : `lumina:cart:guest`;

  const normalizeItems = (arr: CartItem[] | undefined | null) => {
    if (!Array.isArray(arr)) return [];
    const map = new Map<string, CartItem>();

    for (const it of arr) {
      const key = `${it.id}::${it.color ?? ""}::${it.size ?? ""}`;
      const existing = map.get(key);

      if (existing) {
        existing.qty = (existing.qty || 0) + (it.qty || 0);
      } else {
        map.set(key, { ...it, qty: it.qty || 0 });
      }
    }

    return Array.from(map.values());
  };

  const sameVariant = (a: AddItemInput | CartItem, b: AddItemInput | CartItem) =>
    a.id === b.id && a.color === b.color && a.size === b.size;

  // 🔍 Obtener usuario
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/sessionUser");
        const data = await res.json();
        if (!mounted) return;

        setUserId(data?.user?.uid ?? null);
      } catch {
        if (!mounted) return;
        setUserId(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 📦 Cargar carrito según usuario
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userId));
      if (raw) setItems(normalizeItems(JSON.parse(raw)));
      else setItems([]);
    } catch {
      setItems([]);
    }
  }, [userId]);

  // 🔥 LOGIN → merge guest + user
  useEffect(() => {
    const prev = prevUserRef.current;

    if (!prev && userId) {
      try {
        const guestRaw = localStorage.getItem(storageKey(null)) || "[]";
        const userRaw = localStorage.getItem(storageKey(userId)) || "[]";

        const guest = JSON.parse(guestRaw);
        const user = JSON.parse(userRaw);

        const merged = [...user];

        guest.forEach((g: CartItem) => {
          const i = merged.findIndex((p) => sameVariant(p, g));
          if (i >= 0) merged[i].qty += g.qty;
          else merged.push(g);
        });

        const normalized = normalizeItems(merged);

        localStorage.setItem(storageKey(userId), JSON.stringify(normalized));
        localStorage.removeItem(storageKey(null));

        setItems(normalized);
      } catch {}
    }

    // 🔥 LOGOUT → SOLO limpiar UI (NO migrar a guest)
    if (prev && !userId) {
      setItems([]); // 👈 clave: desaparece el carrito visual
    }

    prevUserRef.current = userId;
  }, [userId]);

  // ☁️ Sync con servidor al iniciar sesión
  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) return;

        const data = await res.json();
        if (!mounted) return;

        const serverItems = data?.items || [];

        const localRaw = localStorage.getItem(storageKey(userId)) || "[]";
        const localItems = JSON.parse(localRaw);

        const merged = [...serverItems];

        localItems.forEach((g: CartItem) => {
          const i = merged.findIndex((p) => sameVariant(p, g));
          if (i >= 0) merged[i].qty += g.qty;
          else merged.push(g);
        });

        const normalized = normalizeItems(merged);

        localStorage.setItem(storageKey(userId), JSON.stringify(normalized));
        setItems(normalized);
      } catch {}
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // ☁️ Sync cambios al servidor
  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: normalizeItems(items) }),
        });
      } catch {}
    })();
  }, [items, userId]);

  // 💾 Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(normalizeItems(items)));
    } catch {}
  }, [items, userId]);

  // 🧼 Normalizar siempre
  useEffect(() => {
    const normalized = normalizeItems(items);
    if (JSON.stringify(normalized) !== JSON.stringify(items)) {
      setItems(normalized);
    }
  }, [items]);

  const addItem = (item: AddItemInput, qty = 1) =>
    setItems((prev) => {
      const i = prev.findIndex((p) => sameVariant(p, item));
      if (i >= 0) {
        const copy = [...prev];
        copy[i].qty += qty;
        return copy;
      }
      return [...prev, { ...item, qty }];
    });

  const removeItem = (id: string, opts?: { color?: string; size?: string }) =>
    setItems((prev) =>
      prev.filter((p) => !(p.id === id && p.color === opts?.color && p.size === opts?.size))
    );

  const updateQty = (id: string, qty: number, opts?: { color?: string; size?: string }) =>
    setItems((prev) =>
      prev.map((p) =>
        p.id === id && p.color === opts?.color && p.size === opts?.size
          ? { ...p, qty: Math.max(1, qty) }
          : p
      )
    );

  const clear = () => {
    setItems([]);
    try {
      localStorage.removeItem(storageKey(userId));
    } catch {}
  };

  const count = useMemo(() => items.reduce((a, i) => a + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, i) => a + i.qty * i.price, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}