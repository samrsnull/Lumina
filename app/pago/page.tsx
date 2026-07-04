"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "../context/CartContext";

function luhn(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (!digits) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function detectBrand(num: string): string | null {
  const d = num.replace(/\s+/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^6(011|5)/.test(d)) return "discover";
  return null;
}

function formatCard(v: string, brand: string | null): string {
  const digits = v.replace(/\D/g, "");
  if (brand === "amex") {
    const d = digits.slice(0, 15);
    if (d.length <= 4) return d;
    if (d.length <= 10) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 10)} ${d.slice(10)}`;
  }
  return digits.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

type FieldKey = "holder" | "card" | "expMonth" | "expYear" | "cvv";
type Errors = Partial<Record<FieldKey, string>>;
type Touched = Record<FieldKey, boolean>;

function validate(
  holder: string,
  card: string,
  expMonth: string,
  expYear: string,
  cvv: string,
  brand: string | null
): Errors {
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  const errors: Errors = {};

  if (!holder.trim()) {
    errors.holder = "El nombre del titular es obligatorio.";
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(holder)) {
    errors.holder = "Solo se permiten letras y espacios.";
  } else if (holder.trim().length < 3) {
    errors.holder = "Mínimo 3 caracteres.";
  }

  const digits = card.replace(/\s+/g, "");
  if (!digits) {
    errors.card = "El número de tarjeta es obligatorio.";
  } else {
    const expectedLen = brand === "amex" ? 15 : 16;
    if (digits.length < expectedLen) {
      errors.card = `La tarjeta debe tener ${expectedLen} dígitos.`;
    } else if (!luhn(digits)) {
      errors.card = "Número de tarjeta inválido.";
    }
  }

  const monthNum = Number(expMonth);
  if (!expMonth) {
    errors.expMonth = "Mes requerido.";
  } else if (!/^\d{1,2}$/.test(expMonth) || monthNum < 1 || monthNum > 12) {
    errors.expMonth = "Ingresa un mes válido (01–12).";
  }

  const yearNum = Number(expYear);
  if (!expYear) {
    errors.expYear = "Año requerido.";
  } else if (!/^\d{2}$/.test(expYear)) {
    errors.expYear = "Ingresa 2 dígitos (ej. 26).";
  } else if (yearNum < currentYear) {
    errors.expYear = "La tarjeta está vencida.";
  } else if (yearNum === currentYear && !errors.expMonth && monthNum < currentMonth) {
    errors.expMonth = "La tarjeta está vencida.";
  }

  const cvvLen = brand === "amex" ? 4 : 3;
  if (!cvv) {
    errors.cvv = "CVV requerido.";
  } else if (cvv.length < cvvLen) {
    errors.cvv = `El CVV debe tener ${cvvLen} dígitos.`;
  }

  return errors;
}

export default function PagoPage() {
  const router = useRouter();
  const { subtotal, clear } = useCart();

  const [holder, setHolder] = useState("");
  const [card, setCard] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [touched, setTouched] = useState<Touched>({
    holder: false,
    card: false,
    expMonth: false,
    expYear: false,
    cvv: false,
  });

  const errors = validate(holder, card, expMonth, expYear, cvv, brand);
  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    fetch("/api/sessionUser")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user) router.push("/login?redirect=/pago");
      });
  }, [router]);

  useEffect(() => {
    if (subtotal <= 0 && !paid) router.push("/carrito");
  }, [subtotal, paid, router]);

  function touch(field: FieldKey) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function inputClass(field: FieldKey, extra = "") {
    const base = `w-full border p-3 rounded focus:outline-none transition-colors ${extra}`;
    if (!touched[field]) return `${base} border-gray-300 focus:border-[#c0a256]`;
    if (errors[field]) return `${base} border-red-400 bg-red-50 focus:border-red-500`;
    return `${base} border-green-500 bg-green-50 focus:border-green-600`;
  }

  function handleHolderChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHolder(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""));
  }

  function handleCardChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newBrand = detectBrand(e.target.value);
    setBrand(newBrand);
    setCard(formatCard(e.target.value, newBrand));
    // Reset CVV if brand changes to/from Amex
    setCvv("");
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 2);
    setExpMonth(v);
  }

  function handleYearChange(e: React.ChangeEvent<HTMLInputElement>) {
    setExpYear(e.target.value.replace(/\D/g, "").slice(0, 2));
  }

  function handleCvvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const maxLen = brand === "amex" ? 4 : 3;
    setCvv(e.target.value.replace(/\D/g, "").slice(0, maxLen));
  }

  function montoFormateado(v: number) {
    return v.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setTouched({ holder: true, card: true, expMonth: true, expYear: true, cvv: true });

    if (!isValid) {
      setSubmitError("Por favor corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setPaid(true);
      const totalPagado = subtotal;
      clear();
      router.push(`/pago/realizado?mode=demo&total=${totalPagado}`);
    } catch {
      setSubmitError("Error procesando el pago. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (subtotal <= 0 && !paid) return null;

  return (
    <>
      <Header showLoginButton={false} />

      <main className="min-h-screen bg-gradient-to-b from-[#fdfaf4] to-white">
        <div className="mx-auto max-w-4xl px-6 py-10">

          {/* PASOS */}
          <div className="mb-10">
            <ol className="flex justify-between text-xs font-semibold">
              <li>CARRITO</li>
              <li className="text-[#c0a256]">PAGO</li>
              <li className="text-gray-400">REALIZADO</li>
            </ol>
          </div>

          {/* MÉTODOS */}
          <div className="bg-white p-5 rounded mb-8 text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-3">Tarjetas aceptadas</p>
            <div className="flex justify-center gap-5 items-center">
              <Image
                src="/Images/visa.jpg"
                alt="Visa"
                width={72}
                height={32}
                className={`transition-opacity rounded ${brand === "visa" ? "ring-2 ring-[#c0a256]" : brand ? "opacity-40" : ""}`}
              />
              <Image
                src="/Images/mastercard.jpg"
                alt="MasterCard"
                width={72}
                height={32}
                className={`transition-opacity rounded ${brand === "mastercard" ? "ring-2 ring-[#c0a256]" : brand ? "opacity-40" : ""}`}
              />
              <Image
                src="/Images/amex.jpg"
                alt="AmEx"
                width={72}
                height={32}
                className={`transition-opacity rounded ${brand === "amex" ? "ring-2 ring-[#c0a256]" : brand ? "opacity-40" : ""}`}
              />
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-white p-8 rounded shadow-sm">

            {/* Nombre del titular */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del titular
              </label>
              <input
                type="text"
                placeholder="Como aparece en la tarjeta"
                value={holder}
                onChange={handleHolderChange}
                onBlur={() => touch("holder")}
                autoComplete="cc-name"
                className={inputClass("holder")}
              />
              {touched.holder && errors.holder && (
                <p className="text-red-500 text-xs mt-1">{errors.holder}</p>
              )}
              {touched.holder && !errors.holder && (
                <p className="text-green-600 text-xs mt-1">✓ Nombre válido</p>
              )}
            </div>

            {/* Número de tarjeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={brand === "amex" ? "XXXX XXXXXX XXXXX" : "XXXX XXXX XXXX XXXX"}
                  value={card}
                  onChange={handleCardChange}
                  onBlur={() => touch("card")}
                  autoComplete="cc-number"
                  className={inputClass("card", "pr-24")}
                />
                {brand && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 capitalize font-medium">
                    {brand}
                  </span>
                )}
              </div>
              {touched.card && errors.card && (
                <p className="text-red-500 text-xs mt-1">{errors.card}</p>
              )}
              {touched.card && !errors.card && (
                <p className="text-green-600 text-xs mt-1">✓ Número válido</p>
              )}
            </div>

            {/* Vencimiento + CVV */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                <input
                  placeholder="MM"
                  inputMode="numeric"
                  value={expMonth}
                  onChange={handleMonthChange}
                  onBlur={() => {
                    touch("expMonth");
                    if (expMonth.length === 1) setExpMonth(expMonth.padStart(2, "0"));
                  }}
                  autoComplete="cc-exp-month"
                  className={inputClass("expMonth")}
                />
                {touched.expMonth && errors.expMonth && (
                  <p className="text-red-500 text-xs mt-1">{errors.expMonth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <input
                  placeholder="AA"
                  inputMode="numeric"
                  value={expYear}
                  onChange={handleYearChange}
                  onBlur={() => touch("expYear")}
                  autoComplete="cc-exp-year"
                  className={inputClass("expYear")}
                />
                {touched.expYear && errors.expYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.expYear}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV{brand === "amex" ? " (4 díg.)" : " (3 díg.)"}
                </label>
                <input
                  type="password"
                  placeholder={brand === "amex" ? "XXXX" : "XXX"}
                  inputMode="numeric"
                  value={cvv}
                  onChange={handleCvvChange}
                  onBlur={() => touch("cvv")}
                  autoComplete="cc-csc"
                  className={inputClass("cvv")}
                />
                {touched.cvv && errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Error global al intentar enviar */}
            {submitError && (
              <div className="text-red-700 text-sm bg-red-50 border border-red-200 rounded p-3">
                {submitError}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between font-semibold text-lg border-t pt-4">
              <span>Total:</span>
              <span className="text-[#c0a256]">{montoFormateado(subtotal)}</span>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/carrito")}
                className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                ATRÁS
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#c0a256] text-white px-6 py-3 rounded font-semibold hover:bg-[#a88c44] transition-colors disabled:opacity-60 flex-1"
              >
                {loading ? "Procesando..." : `PAGAR ${montoFormateado(subtotal)}`}
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
