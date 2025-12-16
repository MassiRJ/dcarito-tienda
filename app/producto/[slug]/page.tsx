'use client';

import { useState, useEffect } from "react";
import { client, urlFor } from "../../lib/sanity";
import Link from "next/link";
import { useParams } from "next/navigation";

const NUMERO_WHATSAPP = "51999999999"; 

export default function PaginaProductoDetalle() {
  const { slug } = useParams();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        // Buscamos el producto que tenga ese SLUG exacto
        const query = `*[_type == "producto" && slug.current == "${slug}"][0]`;
        const data = await client.fetch(query);
        setProducto(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    if (slug) fetchProducto();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-rose-600 border-t-transparent rounded-full"></div></div>;
  if (!producto) return <div className="text-center py-20">Producto no encontrado</div>;

  const comprarWsp = () => {
    const msj = `Hola, quiero comprar el *${producto.nombre}* que vi en la web por S/ ${producto.precio}.`;
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(msj)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* NAVBAR SIMPLE */}
      <nav className="border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 bg-white/95 z-50">
        <Link href="/" className="font-black text-xl tracking-tighter">D'Carito<span className="text-rose-600">.PE</span></Link>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest hover:text-rose-600">✕ Cerrar</Link>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12">
        
        {/* COLUMNA 1: FOTO GIGANTE */}
        <div className="relative h-[50vh] md:h-[calc(100vh-65px)] bg-gray-100">
          {producto.imagen && (
            <img 
              src={urlFor(producto.imagen).url()} 
              alt={producto.nombre} 
              className="w-full h-full object-cover"
            />
          )}
          {producto.etiqueta && (
            <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
              {producto.etiqueta}
            </span>
          )}
        </div>

        {/* COLUMNA 2: DETALLES Y COMPRA */}
        <div className="p-8 md:p-12 flex flex-col justify-center h-full">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">{producto.categoria}</span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-none">{producto.nombre}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-light">S/ {producto.precio}</span>
            {producto.antes && <span className="text-xl text-gray-400 line-through">S/ {producto.antes}</span>}
          </div>

          <div className="prose prose-sm text-gray-500 mb-10 leading-relaxed">
            <p>{producto.descripcion || "Prenda diseñada con los mejores materiales para tu confort y elegancia."}</p>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            onClick={comprarWsp}
            className="w-full bg-rose-600 text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 shadow-xl mb-4 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/></svg>
            Comprar ahora
          </button>
          
          <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-2">
            🔒 Compra segura vía WhatsApp
          </p>
        </div>
      </main>
    </div>
  );
}