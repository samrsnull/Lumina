"use client";
import Link from "next/link";
import { useCart } from "../app/context/CartContext";
import { useUser } from "../app/context/UserContext"; // 🔥 IMPORTANTE

interface CartButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export default function CartButton({ onClick, className, ariaLabel }: CartButtonProps) {
  const { count } = useCart();
  const { user } = useUser(); // 🔥 ahora sabemos si hay sesión

  const content = (
    <span className="relative inline-block">
      {/* Carrito */}
      <span className="cartIcon text-gray-700 text-xl transition-colors duration-200 group-hover:text-yellow-500 group-hover:scale-110 transform inline-block">
        🛒
      </span>

      {/* Badge */}
      {user && count > 0 && ( // 🔥 SOLO si hay usuario
        <span className="cartBadge absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1 rounded-full transition-all duration-200 group-hover:bg-yellow-500">
          {count}
        </span>
      )}
    </span>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`group inline-block cursor-pointer ${className || ""}`}
        aria-label={ariaLabel || "Ir al carrito"}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href="/carrito"
      className={`group inline-block cursor-pointer ${className || ""}`}
      aria-label={ariaLabel || "Ir al carrito"}
    >
      {content}
    </Link>
  );
}