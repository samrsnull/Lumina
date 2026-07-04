export type Pulsera = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  rating: number;
  descripcion: string;
};

export const pulserasData: Pulsera[] = [
  {
    id: "set-pulseras-oro",
    nombre: "Set Pulseras de Oro",
    precio: 2200,
    imagen: "/Images/pulseras.webp",
    rating: 5,
    descripcion: "Set de tres pulseras de oro para combinar y crear un look único.",
  },
  {
    id: "pulsera-dije-corazon",
    nombre: "Pulsera Dije Corazón",
    precio: 1200,
    imagen: "/Images/pulseras.jpg",
    rating: 5,
    descripcion: "Encantadora pulsera con dijes de corazón y llave.",
  },
  {
    id: "pulsera-moderna",
    nombre: "Pulsera Dorada Moderna",
    precio: 1500,
    imagen: "/Images/pulseras.png",
    rating: 4,
    descripcion: "Pulsera de eslabones dorados estilo moderno.",
  },
];
