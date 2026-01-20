'use client';

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { client, urlFor } from "./lib/sanity"; 
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// --- ⚙️ CONFIGURACIÓN DE TU NEGOCIO ---
const NUMERO_WHATSAPP = "51916932897"; 
const PRECIO_DELIVERY_BASE = 10; // Costo delivery normal
const META_PARA_GRATIS = 3;      // Cantidad de productos para envío gratis

// --- 📂 DATOS DE ICONOS Y NAVEGACIÓN ---
const ICONOS_CATEGORIA = [
  { id: 1, nombre: "Brasieres", icono: "👙", link: "/categoria/Brasieres" },
  { id: 2, nombre: "Calzones", icono: "🩲", link: "/categoria/Calzones" },
  { id: 3, nombre: "Fajas", icono: "⏳", link: "/categoria/Fajas" },
  { id: 4, nombre: "Pijamas", icono: "🌙", link: "/categoria/Pijamas" },
];

const NAV_LINKS = [
  { name: "Inicio", href: "/" },
  { name: "Brasieres", href: "/categoria/Brasieres" },
  { name: "Calzones", href: "/categoria/Calzones" },
  { name: "Fajas", href: "/categoria/Fajas" },
  { name: "Pijamas", href: "/categoria/Pijamas" },
];

const FILTROS_VISUALES = ["Talla", "Color", "Precio", "Silueta"];

// --- 🔥 BANNERS DE RESPALDO ---
const BANNERS_BACKUP = [
  {
    _id: "backup-1",
    titulo: "CONFORT REAL",
    subtitulo: "Nueva Colección 2025",
    descripcion: "Tecnología Seamless que se adapta a tu piel.",
    imgBackup: "https://plus.unsplash.com/premium_photo-1683121351249-a38b3ba40d68?q=80&w=1470&auto=format&fit=crop",
    boton: "Ver Confort",
    color: "rose"
  },
  {
    _id: "backup-2",
    titulo: "ENCANTOS DE ENCAJE",
    subtitulo: "Línea Seduction",
    descripcion: "Detalles florales que resaltan tu belleza.",
    imgBackup: "https://plus.unsplash.com/premium_photo-1661608920421-dd988eb5d9e0?q=80&w=1470&auto=format&fit=crop",
    boton: "Ver Lencería",
    color: "purple"
  },
];

export default function Tienda() {
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- 🛒 ESTADO DEL CARRITO Y ENTREGA (NUEVO) ---
  const [carrito, setCarrito] = useState<any[]>([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState<"tienda" | "delivery">("tienda"); // 👈 Nuevo estado

  // --- ESTADOS DE DATOS ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<any[]>(BANNERS_BACKUP); 
  const [productosReales, setProductosReales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CARGAR DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerQuery = `*[_type == "banner"]`;
        const bannerData = await client.fetch(bannerQuery);
        setBanners([...bannerData, ...BANNERS_BACKUP]);

        const productQuery = `*[_type == "producto"] | order(_createdAt desc)`;
        const productData = await client.fetch(productQuery);
        setProductosReales(productData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  // --- 🛒 LÓGICA DEL CARRITO ---
  const agregarAlCarrito = (producto: any) => {
    setCarrito([...carrito, producto]);
    setCarritoAbierto(true);
  };

  const eliminarDelCarrito = (index: number) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  // --- 🚚 LÓGICA DE COSTOS (NUEVO) ---
  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => total + item.precio, 0);
  };

  const calcularCostoEnvio = () => {
    if (tipoEntrega === "tienda") return 0;
    if (carrito.length >= META_PARA_GRATIS) return 0; // Gratis si cumple meta
    return PRECIO_DELIVERY_BASE;
  };

  const calcularTotalFinal = () => {
    return calcularSubtotal() + calcularCostoEnvio();
  };

  // --- 🚀 CHECKOUT WHATSAPP ACTUALIZADO ---
  const checkoutWhatsApp = () => {
    if (carrito.length === 0) return;

    const envio = calcularCostoEnvio();
    const total = calcularTotalFinal();
    const esGratis = tipoEntrega === "delivery" && carrito.length >= META_PARA_GRATIS;

    let mensaje = "Hola D'Carito! 👋 Quiero hacer el siguiente pedido:\n\n";
    
    carrito.forEach((item) => {
      const linkFoto = item.imagen ? urlFor(item.imagen).width(400).url() : "Sin foto";
      mensaje += `🛍️ *${item.nombre}* (S/ ${item.precio})\n`;
      mensaje += `   Foto: ${linkFoto}\n\n`;
    });

    mensaje += `--------------------------\n`;
    mensaje += `📦 *ENTREGA:* ${tipoEntrega === "tienda" ? "Recojo en Tienda" : "Delivery"}\n`;
    
    if (tipoEntrega === "delivery") {
        if (esGratis) mensaje += `🚚 *Envío:* ¡GRATIS! (Promo)\n`;
        else mensaje += `🚚 *Envío:* S/ ${envio}\n`;
    }
    
    mensaje += `💰 *TOTAL FINAL: S/ ${total}*\n`;
    mensaje += `--------------------------\n\n`;
    mensaje += `¿Me envían el QR de Yape/Plin?`;

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const getBannerImage = (slide: any) => {
    if (slide.imagen) return urlFor(slide.imagen).url();
    if (slide.imgBackup) return slide.imgBackup;
    return null; 
  };

  const MARQUEE_TEXT = "🚚 ENVÍOS GRATIS LLEVANDO 3 PRENDAS • 💳 ACEPTAMOS YAPE Y PLIN • 🎁 REGALO POR COMPRAS > S/199 • ";

  return (
    <div className={`min-h-screen bg-[#f8f5f0] font-sans text-gray-900 ${playfair.variable}`}>
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .font-serif-title { fontFamily: var(--font-playfair), serif; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 20s linear infinite; }
      `}</style>

      {/* --- DRAWER DEL CARRITO (AQUÍ ESTÁ EL CAMBIO CLAVE) --- */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCarritoAbierto(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Cabecera */}
            <div className="p-5 border-b border-[#e8e0d5] flex justify-between items-center bg-[#f8f5f0]">
              <h2 className="text-xl font-serif-title font-bold flex items-center gap-2">Tu Bolsa <span className="text-rose-600">({carrito.length})</span></h2>
              <button onClick={() => setCarritoAbierto(false)} className="p-2 hover:bg-[#e8e0d5] rounded-full">✕</button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {carrito.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <p className="text-4xl mb-4">🛍️</p>
                  <p>Tu bolsa está vacía.</p>
                  <button onClick={() => setCarritoAbierto(false)} className="mt-4 text-rose-600 font-bold hover:underline">Ir a vitrinear</button>
                </div>
              ) : (
                carrito.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center bg-white border border-[#e8e0d5] p-3 rounded-xl shadow-sm">
                    <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagen && <img src={urlFor(item.imagen).width(100).url()} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1">{item.nombre}</h4>
                      <p className="font-bold text-rose-600 mt-1">S/ {item.precio}</p>
                    </div>
                    <button onClick={() => eliminarDelCarrito(i)} className="text-gray-300 hover:text-red-500 p-2">🗑️</button>
                  </div>
                ))
              )}
            </div>

            {/* SECCIÓN DE ENTREGA Y TOTALES (NUEVO DISEÑO INTEGRADO) */}
            {carrito.length > 0 && (
              <div className="p-6 border-t border-[#e8e0d5] bg-[#f8f5f0]">
                
                {/* Selector de Entrega */}
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Opciones de Entrega</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setTipoEntrega("tienda")}
                      className={`py-2 px-3 rounded-md text-sm font-bold border transition-all ${tipoEntrega === "tienda" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-[#d8d0c5] hover:border-gray-400"}`}
                    >
                      🏪 Recojo (S/0)
                    </button>
                    <button 
                      onClick={() => setTipoEntrega("delivery")}
                      className={`py-2 px-3 rounded-md text-sm font-bold border transition-all ${tipoEntrega === "delivery" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-[#d8d0c5] hover:border-gray-400"}`}
                    >
                      🛵 Delivery
                    </button>
                  </div>

                  {/* Aviso de Envío Gratis */}
                  {tipoEntrega === "delivery" && (
                    <div className={`mt-3 p-3 rounded-md text-xs font-bold text-center border ${carrito.length >= META_PARA_GRATIS ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-50 text-orange-800 border-orange-100"}`}>
                      {carrito.length >= META_PARA_GRATIS ? (
                        <span>🎉 ¡Genial! Tienes <b>ENVÍO GRATIS</b></span>
                      ) : (
                        <span>💡 Agrega <b>{META_PARA_GRATIS - carrito.length} prenda(s)</b> más para envío GRATIS</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Resumen */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>S/ {calcularSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    {calcularCostoEnvio() === 0 ? (
                      <span className="text-green-600 font-bold">GRATIS</span>
                    ) : (
                      <span>S/ {calcularCostoEnvio()}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-[#d8d0c5] pt-2 mt-2 font-serif-title">
                    <span>Total</span>
                    <span>S/ {calcularTotalFinal()}</span>
                  </div>
                </div>

                <button 
                  onClick={checkoutWhatsApp}
                  className="w-full bg-green-600 text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-green-700 transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="h-5 w-5 invert brightness-0 grayscale-0" />
                  Pedir por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. CINTA MARQUESINA */}
      <div className="bg-[#2a2a2a] text-[#f8f5f0] overflow-hidden py-2 relative z-50 border-b border-[#e8e0d5]">
        <div className="whitespace-nowrap animate-marquee">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mx-4">{MARQUEE_TEXT}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mx-4">{MARQUEE_TEXT}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mx-4">{MARQUEE_TEXT}</span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mx-4">{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* 2. NAVBAR ELEGANTE */}
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
            {/* BOTÓN CARRITO */}
            <button onClick={() => setCarritoAbierto(true)} className="relative group rounded-full p-2 transition hover:bg-[#e8e0d5]">
              <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white group-hover:scale-110 transition ${carrito.length > 0 ? 'bg-rose-600' : 'bg-gray-400'}`}>{carrito.length}</span>
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

      {/* 3. HERO SLIDER (Híbrido) */}
      <div className="relative h-[50vh] md:h-[85vh] w-full bg-gray-900 overflow-hidden">
        {banners.map((slide, index) => {
          const imgSrc = getBannerImage(slide);
          return (
            <div key={slide._id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>
              {imgSrc ? (
                <img src={imgSrc} alt={slide.titulo} className={`h-full w-full object-cover object-center transition-transform duration-[5s] ${index === currentSlide ? 'scale-110' : 'scale-100'}`} />
              ) : <div className="h-full w-full bg-gray-800"></div>}
            </div>
          );
        })}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-24">
          <div className="max-w-xl animate-in slide-in-from-bottom-10 fade-in duration-700">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-white uppercase border border-white/30 backdrop-blur-md rounded-full">
              {banners[currentSlide]?.subtitulo || "Colección"}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif-title font-bold text-white leading-[1.1] drop-shadow-xl mb-6">
              {banners[currentSlide]?.titulo || "D'CARITO"}
            </h1>
            <p className="text-sm md:text-xl text-gray-100 font-light mb-8 max-w-md hidden md:block">
              {banners[currentSlide]?.descripcion}
            </p>
            <button className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[#e8e0d5] transition-colors shadow-lg">
              {banners[currentSlide]?.boton || "Ver Colección"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. CONTENIDO PRINCIPAL */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        
        <h1 className="text-3xl md:text-5xl font-serif-title text-center text-gray-900 mb-12">
          Nuestras Colecciones
        </h1>

        {/* ICONOS CIRCULARES */}
        <div className="flex justify-center gap-6 md:gap-12 mb-16 overflow-x-auto pb-4 no-scrollbar">
          {ICONOS_CATEGORIA.map((cat) => (
            <Link href={cat.link} key={cat.id} className="group flex flex-col items-center flex-shrink-0 cursor-pointer">
              <div className="h-20 w-20 md:h-28 md:w-28 rounded-full bg-[#e8e0d5] flex items-center justify-center text-3xl md:text-4xl mb-4 transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#d8d0c5] shadow-sm">
                {cat.icono}
              </div>
              <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-800">{cat.nombre}</span>
            </Link>
          ))}
        </div>

        {/* BARRA DE FILTROS */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-[#e8e0d5] gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTROS_VISUALES.map((filtro) => (
              <button key={filtro} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-gray-600 bg-transparent hover:bg-[#e8e0d5] rounded-sm flex items-center gap-1 transition-colors border border-transparent hover:border-gray-300">
                {filtro} ▾
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">{productosReales.length} PRODUCTOS</span>
        </div>
        
        {/* GRILLA DE PRODUCTOS */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16 sm:grid-cols-3 lg:grid-cols-4 animate-in fade-in duration-500">
            {productosReales.map((producto: any) => (
              <div key={producto._id} className="group relative flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#e8e0d5] mb-4">
                  {producto.etiqueta && (
                    <span className="absolute left-0 top-3 z-20 px-3 py-1 text-[10px] font-bold text-white bg-black uppercase tracking-wider shadow-sm">
                      {producto.etiqueta}
                    </span>
                  )}
                  {producto.imagen ? (
                    <img src={urlFor(producto.imagen).width(500).url()} alt={producto.nombre} className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
                  ) : <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs font-bold">SIN FOTO</div>}
                  
                  {/* Botón Hover Desktop */}
                  <button onClick={() => agregarAlCarrito(producto)} className="hidden md:block absolute bottom-0 left-0 w-full bg-white/90 py-3 text-xs font-bold uppercase tracking-widest text-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-black hover:text-white">
                    Agregar a la bolsa
                  </button>
                </div>

                <div className="flex flex-col text-left">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-rose-600 transition-colors">{producto.nombre}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">S/ {producto.precio}</span>
                    {producto.antes && <span className="text-xs text-gray-400 line-through">S/ {producto.antes}</span>}
                  </div>
                  {/* Botón Móvil */}
                  <button onClick={() => agregarAlCarrito(producto)} className="md:hidden mt-2 w-full border border-black py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 7. FOOTER */}
      <footer className="bg-[#e8e0d5] text-gray-700 py-16 text-sm mt-20 border-t border-[#d8d0c5]">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h4 className="font-serif-title font-bold text-2xl mb-6 text-gray-900">D'Carito<span className="text-rose-600">.PE</span></h4>
            <p className="text-gray-600 leading-relaxed mb-6">Elegancia, confort y sensualidad en cada prenda. Diseñado para realzar tu belleza natural.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-bold uppercase tracking-widest text-xs text-gray-900">Ayuda</h5>
            <a href="#" className="hover:text-black">Guía de Tallas</a>
            <a href="#" className="hover:text-black">Cambios y Devoluciones</a>
            <a href="#" className="hover:text-black">Términos y Condiciones</a>
          </div>
          <div className="flex flex-col gap-4">
             <h5 className="font-bold uppercase tracking-widest text-xs text-gray-900">Síguenos</h5>
             <div className="flex justify-center md:justify-start gap-4">
               <span className="cursor-pointer hover:text-rose-600">Instagram</span>
               <span className="cursor-pointer hover:text-rose-600">Facebook</span>
               <span className="cursor-pointer hover:text-rose-600">TikTok</span>
             </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-12 pt-8 border-t border-gray-300/50">
          © {new Date().getFullYear()} D'Carito Perú. Todos los derechos reservados.
        </div>
      </footer>

      {/* 8. BOTÓN WHATSAPP FLOTANTE */}
      <a href={`https://wa.me/${NUMERO_WHATSAPP}?text=Hola%20D'Carito,%20tengo%20una%20consulta.`} target="_blank" className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-12 w-12 md:h-14 md:w-14 drop-shadow-xl" />
      </a>
    </div>
  );
}
