export type Collar = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  rating: number;
  descripcion: string;
};

export const collaresData: Collar[] = [
  { id: "collar-dije-luz", nombre: "Collar Dije Luz", precio: 1800, imagen: "/Images/collarPerla.jpg", rating: 5, descripcion: "Collar con dije de luz y brillo elegante." },
  { id: "collar-perlas-dorado", nombre: "Collar Perlas Dorado", precio: 2500, imagen: "/Images/collares.png", rating: 4, descripcion: "Perlas tono dorado para un estilo clásico refinado." },
  { id: "collar-minimal", nombre: "Collar Minimal Oro", precio: 1400, imagen: "/Images/collares qhpt.png", rating: 4, descripcion: "Diseño minimalista ideal para uso diario." },
  { id: "collar-floral", nombre: "Collar Floral", precio: 1950, imagen: "/Images/collarfloral.jpg", rating: 5, descripcion: "Detalle floral suave y sofisticado." }
];