'use client';

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { client, urlFor } from "./lib/sanity"; 

// Importamos la fuente Serif desde Google Fonts
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// --- 📂 DATOS DE ICONOS DE CATEGORÍA (ESTILO NUEVO) ---
// ⚠️ NOTA: He usado emojis como marcadores de posición. 
// Para un resultado idéntico, deberías reemplazar los emojis por imágenes SVG de tus prendas.
const ICONOS_CATEGORIA = [
  { id: 1, nombre: "Brasieres", icono: "👙", link: "/categoria/Brasieres" },
  { id: 2, nombre: "Calzones", icono: "🩲", link: "/categoria/Calzones" },
  { id: 3, nombre: "Fajas", icono: "⏳", link: "/categoria/Fajas" },
  { id: 4, nombre: "Pijamas", icono: "🌙", link: "/categoria/Pijamas" },
  // Puedes añadir más: Trajes de Baño, Ropa Deportiva, etc.
];

const NAV_LINKS = [
  { name: "Inicio", href: "/" },
  { name: "Brasieres", href: "/categoria/Brasieres" },
  { name: "Calzones", href: "/categoria/Calzones" },
  { name: "Fajas", href: "/categoria/Fajas" },
  { name: "Pijamas", href: "/categoria/Pijamas" },
];

// Filtros visuales (sin funcionalidad compleja por ahora)
const FILTROS_VISUALES = ["Talla", "Color", "Precio", "Silueta", "Tamaño de Busto", "Relleno", "Varillas"];

const NUMERO_WHATSAPP = "51999999999"; 

export default function Tienda() {
  const [carrito, setCarrito] = useState<number>(0);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- ESTADOS ---
  const [productosReales, setProductosReales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CARGAR DATOS DE SANITY ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productQuery = `*[_type == "producto"] | order(_createdAt desc)`;
        const productData = await client.fetch(productQuery);
        setProductosReales(productData);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- EFECTOS VISUALES ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const comprarPorWhatsApp = (producto: any) => {
    const mensaje = `Hola D'Carito, vi este producto en la web: *${producto.nombre}* a S/ ${producto.precio}. ¿Tienen stock?`;
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    // Aplicamos la variable de la fuente y el nuevo color de fondo crema
    <div className={`min-h-screen bg-[#f8f5f0] font-sans text-gray-900 ${playfair.variable}`}>
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        /* Clase de utilidad para usar la fuente Serif */
        .font-serif-title { fontFamily: var(--font-playfair), serif; }
      `}</style>

      {/* 1. BARRA DE OFERTAS SUPERIOR (ESTILO NUEVO) */}
      <div className="bg-[#e8e0d5] py-2 text-center text-[11px] md:text-xs font-medium tracking-wider text-gray-800 flex justify-center items-center gap-2">
        <span>🚚</span> VER OFERTAS | Envío Gratis desde S/180
      </div>

      {/* 2. NAVBAR (Estilo más limpio) */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#e8e0d5] ${scrolled ? 'bg-[#f8f5f0]/95 shadow-sm backdrop-blur-md py-2' : 'bg-[#f8f5f0] py-4'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="text-2xl md:text-3xl font-serif-title font-bold tracking-tight cursor-pointer text-gray-900" onClick={() => window.scrollTo(0,0)}>
            D'Carito<span className="text-rose-600">.PE</span>
          </div>
          <div className="hidden space-x-8 text-sm font-medium md:flex text-gray-600">
            {NAV_LINKS.map((item) => (
              <Link key={item.name} href={item.href} className={`group relative py-2 transition-colors duration-300 hover:text-black`}>
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-rose-600 transition-all duration-300 ease-out w-0 group-hover:w-full`}></span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative group rounded-full p-2 transition hover:bg-[#e8e0d5]">
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white group-hover:scale-110 transition">{carrito}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
            <button className="block md:hidden p-2 text-gray-800" onClick={() => setMenuAbierto(!menuAbierto)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
        {menuAbierto && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#f8f5f0] border-b border-[#e8e0d5] shadow-xl py-6 flex flex-col items-center gap-6 text-lg font-medium z-40">
            {NAV_LINKS.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setMenuAbierto(false)} className="hover:text-rose-600">{item.name}</Link>
            ))}
          </div>
        )}
      </nav>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        
        {/* TÍTULO PRINCIPAL (SERIF) */}
        <h1 className="text-4xl md:text-5xl font-serif-title text-center text-gray-900 mb-12">
          Explora Nuestras Colecciones
        </h1>

        {/* 4. ICONOS DE CATEGORÍA CIRCULARES (ESTILO NUEVO) */}
        <div className="flex justify-center gap-6 md:gap-12 mb-16 overflow-x-auto pb-4 no-scrollbar">
          {ICONOS_CATEGORIA.map((cat) => (
            <Link href={cat.link} key={cat.id} className="group flex flex-col items-center flex-shrink-0 cursor-pointer">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-[#e8e0d5] flex items-center justify-center text-4xl md:text-5xl mb-4 transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#d8d0c5] shadow-sm">
                {cat.icono}
              </div>
              <span className="text-sm md:text-base font-medium text-gray-800">{cat.nombre}</span>
            </Link>
          ))}
        </div>

        {/* 5. BARRA DE FILTROS Y ORDENACIÓN (VISUAL) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-[#e8e0d5] gap-4">
          {/* Filtros a la izquierda */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            {FILTROS_VISUALES.map((filtro) => (
              <button key={filtro} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-transparent hover:bg-[#e8e0d5] rounded-md flex items-center gap-1 transition-colors">
                {filtro} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            ))}
          </div>
          {/* Botón de Ordenar a la derecha */}
          <button className="px-6 py-2 text-sm font-bold text-gray-800 bg-[#e8e0d5] rounded-md flex items-center gap-2 hover:bg-[#d8d0c5] transition-colors">
            ORDENAR POR <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
        
        {/* CUADRÍCULA DE PRODUCTOS (ADAPTADA AL NUEVO ESTILO) */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 sm:grid-cols-3 lg:grid-cols-4 animate-in fade-in duration-500">
            {productosReales.map((producto: any) => (
              <div key={producto._id} className="group relative flex flex-col cursor-pointer" onClick={() => comprarPorWhatsApp(producto)}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#e8e0d5] mb-3">
                  {producto.etiqueta && (
                    // Etiqueta estilo nuevo (beige con texto oscuro)
                    <span className="absolute left-0 top-3 z-20 px-3 py-1 text-[10px] font-bold text-gray-800 bg-[#f8f5f0] uppercase tracking-wider shadow-sm">
                      {producto.etiqueta}
                    </span>
                  )}
                  {producto.imagen ? (
                    <img src={urlFor(producto.imagen).width(500).url()} alt={producto.nombre} className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">Sin Foto</div>
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-rose-600 transition-colors">{producto.nombre}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">S/ {producto.precio}</span>
                    {producto.antes && <span className="text-xs text-gray-500 line-through">S/ {producto.antes}</span>}
                  </div>
                  {/* Opcional: Mostrar colores disponibles si los tuvieras en Sanity */}
                  {/* <div className="flex gap-1 mt-2"><span className="h-3 w-3 rounded-full bg-black"></span><span className="h-3 w-3 rounded-full bg-beige-500"></span></div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 7. FOOTER (Simplificado para combinar) */}
      <footer className="bg-[#e8e0d5] text-gray-700 py-12 text-sm mt-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h4 className="font-serif-title font-bold text-2xl mb-4 text-gray-900">D'Carito<span className="text-rose-600">.PE</span></h4>
          <p className="mb-8 text-gray-600">Redefiniendo la lencería en Perú con elegancia y confort.</p>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="text-gray-600 hover:text-rose-600 transition">Instagram</a>
            <a href="#" className="text-gray-600 hover:text-rose-600 transition">Facebook</a>
            <a href="#" className="text-gray-600 hover:text-rose-600 transition">TikTok</a>
          </div>
          <div className="text-xs text-gray-500">© {new Date().getFullYear()} D'Carito Perú. Todos los derechos reservados.</div>
        </div>
      </footer>

      {/* 8. BOTÓN WHATSAPP */}
      <a href={`https://wa.me/${NUMERO_WHATSAPP}?text=Hola%20D'Carito,%20consulta.`} target="_blank" className="fixed bottom-6 right-6 z-50 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-14 w-14 drop-shadow-lg" />
      </a>
    </div>
  );
}
