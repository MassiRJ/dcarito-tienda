'use client';

import { useState, useEffect } from "react";
import { client, urlFor } from "../../lib/sanity"; 
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaginaCategoria() {
  const params = useParams();
  const categoriaNombre = decodeURIComponent(params.nombre as string);

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Traemos el producto y también su SLUG (el link)
        const query = `*[_type == "producto" && categoria == "${categoriaNombre}"] | order(_createdAt desc)`;
        const data = await client.fetch(query);
        setProductos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    if (categoriaNombre) {
      fetchProductos();
    }
  }, [categoriaNombre]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-100">
      
      {/* NAVBAR SIMPLE */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 py-4">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter hover:text-rose-600 transition">
            D'Carito<span className="text-rose-600">.PE</span>
          </Link>
          <Link href="/" className="text-sm font-bold flex items-center gap-2 hover:underline">
            ← Volver al Inicio
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <span className="text-rose-600 font-bold tracking-widest text-xs uppercase">Colección Exclusiva</span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mt-2 uppercase">{categoriaNombre}</h1>
          <p className="text-gray-500 mt-4">Explora nuestros diseños seleccionados para ti.</p>
        </div>

        {/* LISTA DE PRODUCTOS */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Buscando prendas...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <p className="text-2xl mb-4">😢</p>
            <h3 className="text-xl font-bold">No encontramos productos en esta categoría</h3>
            <Link href="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full font-bold text-sm">
              Ver todo el catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {productos.map((producto: any) => (
              <div key={producto._id} className="group relative bg-white flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 shadow-sm md:shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                   
                   {/* LÓGICA DEL LINK: Si tiene slug, es un enlace. Si no, es solo imagen. */}
                   {producto.slug?.current ? (
                     <Link href={`/producto/${producto.slug.current}`}>
                        {producto.imagen && (
                          <img 
                            src={urlFor(producto.imagen).width(600).url()} 
                            alt={producto.nombre} 
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                          />
                        )}
                     </Link>
                   ) : (
                     producto.imagen && (
                        <img 
                          src={urlFor(producto.imagen).width(600).url()} 
                          alt={producto.nombre} 
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                        />
                      )
                   )}

                  {/* Botón flotante "Ver Detalle" */}
                  <div className="hidden md:block absolute bottom-4 left-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                     {producto.slug?.current ? (
                       <Link href={`/producto/${producto.slug.current}`}>
                         <button className="w-full rounded-xl bg-white/90 backdrop-blur-md py-3 text-sm font-bold text-black shadow-lg hover:bg-black hover:text-white transition-colors">
                          Ver detalle
                        </button>
                       </Link>
                     ) : (
                       <button className="w-full rounded-xl bg-gray-200 py-3 text-sm font-bold text-gray-500 cursor-not-allowed">
                          Sin detalle
                       </button>
                     )}
                  </div>
                </div>
                
                {/* Textos del producto */}
                <div className="mt-3 md:mt-4">
                  {producto.slug?.current ? (
                    <Link href={`/producto/${producto.slug.current}`}>
                      <h3 className="text-sm md:text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2">{producto.nombre}</h3>
                    </Link>
                  ) : (
                    <h3 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-2">{producto.nombre}</h3>
                  )}
                  
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg md:text-xl font-black text-gray-900">S/ {producto.precio}</span>
                    {producto.antes && <span className="text-xs text-gray-400 line-through">S/ {producto.antes}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

       {/* FOOTER SIMPLE */}
       <footer className="bg-black text-white py-8 text-center text-xs mt-20">
          © {new Date().getFullYear()} D'Carito Perú.
       </footer>
    </div>
  );
}