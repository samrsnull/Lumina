export type Anillo = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  rating: number;
  descripcion: string;
};

export const anillosData: Anillo[] = [
  { id: "anillo-solitario-oro", nombre: "Anillo Solitario Oro", precio: 3200, imagen: "/Images/anillo1.jpg", rating: 5, descripcion: "Diseño solitario con acabado brillante dorado." },
  { id: "anillo-corona", nombre: "Anillo Corona", precio: 2800, imagen: "/Images/anillo2.jpg", rating: 4, descripcion: "Inspirado en coronas reales, detalle elegante." },
  { id: "anillo-minimal", nombre: "Anillo Minimal", precio: 1300, imagen: "/Images/anillo3.jpg", rating: 4, descripcion: "Sencillo y fino para uso cotidiano." },
  { id: "anillo-floral", nombre: "Anillo Floral", precio: 2100, imagen: "/Images/anillo4.jpg", rating: 5, descripcion: "Motivo floral delicado y elegante." }
];