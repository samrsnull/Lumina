import React from 'react';

export default function FAQ() {
  return (
    <section className="faq section" aria-labelledby="faq-title">
      {/* Puedes agregar una clase al h2 si necesitas centrarlo, ej: className="text-center" */}
      <h2 id="faq-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Preguntas Frecuentes
      </h2>
      
      <div className="container">
        <div className="faq-list">
          
          {/* Pregunta 1 */}
          <details>
            <summary>¿Cómo puedo realizar una compra?</summary>
            <p>
              Para realizar una compra, simplemente navega por nuestra colección, selecciona los productos que te gusten y agrégalos a tu carrito. Luego, sigue el proceso de pago para completar tu compra.
            </p>
          </details>

          {/* Pregunta 2 */}
          <details>
            <summary>¿Ofrecen envíos internacionales?</summary>
            <p>
              Sí, ofrecemos envíos internacionales a la mayoría de los países. Los costos y tiempos de envío pueden variar según la ubicación. Consulta nuestra página de envíos para más detalles.
            </p>
          </details>

          {/* Pregunta 3 */}
          <details>
            <summary>¿Cuál es su política de devoluciones?</summary>
            <p>
              Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que los productos estén en su estado original. Consulta nuestra política de devoluciones para más información.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}