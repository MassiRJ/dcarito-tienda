'use client';

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { client, urlFor } from "./lib/sanity"; 

// --- 🎬 DATOS DEL HERO SLIDER ---
const HERO_SLIDES = [
  {
    id: 1,
    titulo: "CONFORT REAL",
    subtitulo: "Nueva Colección 2025",
    desc: "Tecnología Seamless que se adapta a tu piel como si no llevaras nada.",
    img: "https://plus.unsplash.com/premium_photo-1683121351249-a38b3ba40d68?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    boton: "Ver Confort",
    color: "rose"
  },
  {
    id: 2,
    titulo: "ENCANTOS DE ENCAJE",
    subtitulo: "Línea Seduction",
    desc: "Detalles florales y transparencias que resaltan tu belleza natural.",
    img: "https://plus.unsplash.com/premium_photo-1661608920421-dd988eb5d9e0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    boton: "Ver Lencería",
    color: "purple"
  },
  {
    id: 3,
    titulo: "CONTROL TOTAL",
    subtitulo: "Fajas & Body",
    desc: "Define tu silueta al instante sin sacrificar la comodidad.",
    img: "https://images.unsplash.com/photo-1604703552572-65664ecfc3a6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    boton: "Ver Fajas",
    color: "emerald"
  }
];

// --- 📂 DATOS DE CATEGORÍAS (OPTIMIZADO PARA MÓVIL) ---
const CATEGORIAS = [
  { 
    id: 1,
    nombre: "Sexy & Encaje", 
    link: "/categoria/Brasieres", 
    subtitulo: "Atrévete a lucir",
    img: "https://images.unsplash.com/photo-1568441556126-f36ae0900180?q=80&w=1468&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // EN MÓVIL: Ocupa las 2 columnas (full width) para destacar
    // EN PC: Ocupa 2 columnas
    spanCol: "col-span-2 md:col-span-2", 
    spanRow: "row-span-1 md:row-span-2"  
  },
  { 
    id: 2,
    nombre: "Fajas Control", 
    link: "/categoria/Fajas",
    subtitulo: "Silueta perfecta",
    img: "https://leonisa.pe/cdn/shop/files/012901_700_1200X1500_o.k_1_caac8c95-d842-4e8a-b72f-c23cc46c8995_900x.jpg?v=1762958266",
    // EN MÓVIL: Ocupa 1 columna (mitad)
    spanCol: "col-span-1 md:col-span-1",
    spanRow: "row-span-1 md:row-span-1" 
  },
  { 
    id: 3,
    nombre: "Pijamas Soft", 
    link: "/categoria/Pijamas",
    subtitulo: "Descanso total",
    img: "https://bombonrojo.com/cdn/shop/files/PIJ-SILVIE.png?v=1731946696",
    spanCol: "col-span-1 md:col-span-1",
    spanRow: "row-span-1 md:row-span-2" 
  },
  { 
    id: 4,
    nombre: "Packs Diarios", 
    link: "/categoria/Calzones",
    subtitulo: "Algodón Premium",
    img: "https://images.pexels.com/photos/16303272/pexels-photo-16303272.jpeg?auto=compress&cs=tinysrgb&w=600",
    spanCol: "col-span-1 md:col-span-1",
    spanRow: "row-span-1 md:row-span-1"
  }
];

// --- 💬 DATOS DE TESTIMONIOS ---
const TESTIMONIOS = [
  {
    id: 1,
    nombre: "Ana María R.",
    ciudad: "Barranca",
    texto: "¡Me encantó la calidad del encaje! Llegó super rápido a mi casa y la talla fue exacta. Definitivamente pediré más.",
    estrellas: 5
  },
  {
    id: 2,
    nombre: "Carla T.",
    ciudad: "Lima",
    texto: "La faja es invisible tal como dicen. La uso con vestidos pegados y no se nota nada. Excelente atención por WhatsApp.",
    estrellas: 5
  },
  {
    id: 3,
    nombre: "Lucía M.",
    ciudad: "Huacho",
    texto: "Compré el pack de pijamas y son suavitas. Me gustó mucho que aceptaran Yape, muy práctico.",
    estrellas: 4
  }
];

const NUMERO_WHATSAPP = "51999999999"; 

export default function Tienda() {
  const [carrito, setCarrito] = useState<number>(0);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 🔌 CONEXIÓN CON SANITY ---
  const [productosReales, setProductosReales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- 🔢 ESTADO PARA PAGINACIÓN ---
  const [cantidadVisible, setCantidadVisible] = useState(8); 

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const query = `*[_type == "producto"] | order(_createdAt desc)`;
        const data = await client.fetch(query);
        setProductosReales(data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // --- EFECTOS VISUALES ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const comprarPorWhatsApp = (producto: any) => {
    const mensaje = `Hola D'Carito, vi este producto en la web: *${producto.nombre}* a S/ ${producto.precio}. ¿Tienen stock?`;
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. BARRA SUPERIOR */}
      <div className="bg-black py-2 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">
        🚚 Envíos GRATIS a todo el Perú por compras mayores a S/ 199
      </div>

      {/* 2. NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md py-2' : 'bg-white py-4'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="text-xl md:text-2xl font-black tracking-tighter cursor-pointer">
            D'Carito<span className="text-rose-600">.PE</span>
          </div>
          <div className="hidden space-x-8 text-sm font-medium md:flex text-gray-600">
            <a href="#coleccion" className="hover:text-rose-600 transition hover:scale-105 transform">Colección</a>
            <a href="#categorias" className="hover:text-rose-600 transition hover:scale-105 transform">Categorías</a>
            <a href="#ofertas" className="text-rose-600 font-bold hover:scale-105 transform">Ofertas 🔥</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative group rounded-full p-2 transition hover:bg-gray-100">
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white group-hover:scale-110 transition">{carrito}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
            <button className="block md:hidden p-2 text-gray-800" onClick={() => setMenuAbierto(!menuAbierto)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
        {menuAbierto && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 flex flex-col items-center gap-6 text-lg font-medium z-40">
            <a href="#coleccion" onClick={() => setMenuAbierto(false)} className="hover:text-rose-600">Colección</a>
            <a href="#categorias" onClick={() => setMenuAbierto(false)} className="hover:text-rose-600">Categorías</a>
            <a href="#ofertas" onClick={() => setMenuAbierto(false)} className="text-rose-600 font-bold">Ofertas 🔥</a>
          </div>
        )}
      </nav>

      {/* 3. HERO SLIDER */}
      <div className="relative h-[85vh] w-full bg-gray-900 overflow-hidden">
        {HERO_SLIDES.map((slide, index) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
            <img src={slide.img} alt={slide.titulo} className={`h-full w-full object-cover object-top transition-transform duration-[5s] ${index === currentSlide ? 'scale-110' : 'scale-100'}`} />
          </div>
        ))}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-24">
          <div className="max-w-xl">
            <div key={currentSlide} className="animate-in slide-in-from-bottom-10 fade-in duration-700">
              <span className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-white uppercase border border-white/30 backdrop-blur-md rounded-full`}>{HERO_SLIDES[currentSlide].subtitulo}</span>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl mb-6">{HERO_SLIDES[currentSlide].titulo}</h1>
              <p className="text-lg md:text-xl text-gray-200 font-light mb-8 max-w-md border-l-2 border-white/30 pl-4">{HERO_SLIDES[currentSlide].desc}</p>
              <button className={`group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95`}>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">{HERO_SLIDES[currentSlide].boton} ➔</span>
                <div className={`absolute inset-0 bg-${HERO_SLIDES[currentSlide].color}-600 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out`}></div>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-6 md:top-1/2 md:-translate-y-1/2 md:right-12 z-30 flex md:flex-col gap-4">
          {HERO_SLIDES.map((slide, index) => (
            <button key={slide.id} onClick={() => setCurrentSlide(index)} className={`group flex items-center gap-3 transition-all duration-300 ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-50 md:translate-x-4 hover:opacity-100'}`}>
              <span className={`hidden md:block text-sm font-bold tracking-widest text-white uppercase ${index === currentSlide ? 'border-b border-white' : ''}`}>0{index + 1} - {slide.titulo.split(" ")[0]}</span>
              <div className={`h-1 md:h-0.5 w-12 md:w-8 transition-all duration-500 ${index === currentSlide ? 'bg-white scale-x-100' : 'bg-gray-500 scale-x-75 group-hover:bg-gray-300'}`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. OFERTAS FLASH */}
      <section id="ofertas" className="bg-rose-600 py-4 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-white">
          <div className="flex items-center gap-3"><span className="text-3xl animate-bounce">⏰</span><div><h3 className="font-black text-xl leading-none uppercase italic tracking-wider">Oferta Relámpago</h3><p className="text-xs text-rose-100 font-medium">Solo por 24 horas</p></div></div>
          <div className="flex gap-4 font-mono font-bold text-2xl">
            <div className="bg-black/30 rounded p-2 min-w-[60px] text-center backdrop-blur-sm">04<span className="text-xs block font-sans font-normal opacity-70">Hrs</span></div>
            <div className="bg-black/30 rounded p-2 min-w-[60px] text-center backdrop-blur-sm">12<span className="text-xs block font-sans font-normal opacity-70">Min</span></div>
            <div className="bg-black/30 rounded p-2 min-w-[60px] text-center backdrop-blur-sm animate-pulse">45<span className="text-xs block font-sans font-normal opacity-70">Seg</span></div>
          </div>
          <button className="bg-white text-rose-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-black hover:text-white transition-colors shadow-lg uppercase tracking-wide hidden md:block">Ver Descuentos</button>
        </div>
      </section>

      {/* 5. CATEGORÍAS (BENTO GRID - 2 COLUMNAS EN MÓVIL) */}
      <section id="categorias" className="py-20 mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-2">
          <div><span className="text-rose-600 font-bold tracking-widest text-xs uppercase">Explora</span><h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">Nuestras Colecciones</h2></div>
          <p className="text-gray-500 max-w-xs text-sm mt-4 md:mt-0">Diseños pensados para cada momento de tu día.</p>
        </div>
        {/* CAMBIO: grid-cols-2 en vez de 1 para móvil */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 h-auto md:h-[600px]">
          {CATEGORIAS.map((cat) => (
            <Link 
              href={cat.link} 
              key={cat.id} 
              className={`group relative overflow-hidden rounded-3xl cursor-pointer ${cat.spanCol} ${cat.spanRow}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10"></div>
              <img src={cat.img} className="h-full w-full object-cover transition duration-[1.5s] ease-out group-hover:scale-110" alt={cat.nombre} />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-8">
                <span className="translate-y-4 opacity-0 text-[10px] md:text-xs font-bold text-rose-300 uppercase tracking-widest transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{cat.subtitulo}</span>
                <div className="flex items-center justify-between mt-1 md:mt-2">
                  <h3 className="text-lg md:text-3xl font-black text-white leading-none">{cat.nombre}</h3>
                  <div className="hidden md:flex h-10 w-10 rounded-full bg-white/20 backdrop-blur items-center justify-center text-white opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-white group-hover:text-black">➜</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LISTADO DE PRODUCTOS (2 COLUMNAS EN MÓVIL) */}
      <main id="coleccion" className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        <div className="flex items-end justify-between mb-8 md:mb-12 border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2"><span className="animate-pulse h-3 w-3 rounded-full bg-rose-600"></span><span className="text-rose-600 font-bold uppercase tracking-widest text-xs">Catálogo Oficial</span></div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">Lo Más Deseado</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando tus prendas...</p>
          </div>
        ) : (
          <>
            {/* CAMBIO: grid-cols-2 gap-3 para móvil */}
            <div className="grid grid-cols-2 gap-3 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {productosReales.slice(0, cantidadVisible).map((producto: any) => (
                <div key={producto._id} className="group relative bg-white flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 shadow-sm md:shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                    
                    {producto.etiqueta && (
                      <span className={`absolute right-2 top-2 z-20 rounded-md px-1.5 py-0.5 text-[8px] md:text-[10px] md:px-2 md:py-1 font-bold text-white uppercase tracking-wide shadow-sm ${producto.etiqueta.includes('Oferta') ? 'bg-red-600 animate-pulse' : 'bg-black'}`}>
                        {producto.etiqueta}
                      </span>
                    )}

                    {producto.imagen && (
                      <img 
                        src={urlFor(producto.imagen).width(600).url()} 
                        alt={producto.nombre} 
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                      />
                    )}

                    {/* Botón rápido - Solo visible en desktop hover */}
                    <div className="hidden md:block absolute bottom-4 left-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <button onClick={() => comprarPorWhatsApp(producto)} className="w-full rounded-xl bg-white/90 backdrop-blur-md py-3 text-sm font-bold text-black shadow-lg hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/></svg>
                        Lo quiero ya
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 md:mt-5 px-1 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{producto.categoria}</p>
                    </div>
                    {/* Título más pequeño en móvil */}
                    <h3 onClick={() => comprarPorWhatsApp(producto)} className="text-sm md:text-lg font-bold text-gray-900 leading-tight group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-2">{producto.nombre}</h3>
                    
                    <div className="mt-1 md:mt-2 flex items-center gap-2 md:gap-3 flex-wrap">
                      <span className="text-lg md:text-2xl font-black text-gray-900">S/ {producto.precio}</span>
                      {producto.antes && <span className="text-xs md:text-sm text-gray-400 line-through">S/ {producto.antes}</span>}
                    </div>

                    {/* Botón comprar móvil */}
                    <button onClick={() => comprarPorWhatsApp(producto)} className="md:hidden mt-2 w-full bg-black text-white text-xs font-bold py-2 rounded-lg">
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cantidadVisible < productosReales.length && (
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setCantidadVisible(cantidadVisible + 8)}
                  className="px-8 py-3 bg-white border border-gray-300 text-gray-900 font-bold rounded-full hover:bg-black hover:text-white transition-colors shadow-sm uppercase tracking-wide text-xs"
                >
                  Cargar más productos (+8)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* 7. TESTIMONIOS */}
      <section className="bg-rose-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <span className="text-rose-600 font-bold tracking-widest text-xs uppercase">Love Stories</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">Lo que dicen de nosotras</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIOS.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100 hover:shadow-xl transition-shadow duration-300 relative">
                <div className="absolute top-4 right-6 text-6xl text-rose-100 font-serif leading-none">”</div>
                <div className="flex gap-1 mb-4 text-yellow-400">{[...Array(5)].map((_, i) => (<span key={i} className={i < item.estrellas ? "opacity-100" : "opacity-30"}>★</span>))}</div>
                <p className="text-gray-600 italic mb-6 relative z-10">"{item.texto}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-sm">{item.nombre.charAt(0)}</div>
                  <div><h4 className="font-bold text-sm text-gray-900">{item.nombre}</h4><p className="text-xs text-gray-400">{item.ciudad}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-black text-gray-300 pt-20 pb-10 text-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-gray-800 pb-12">
            <div className="md:col-span-4">
              <h4 className="text-white font-black text-3xl mb-6 tracking-tighter">D'Carito<span className="text-rose-600">.PE</span></h4>
              <p className="mb-6 text-gray-400 leading-relaxed">Redefiniendo la lencería en Perú.</p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-rose-600 border border-gray-800">📷</a>
                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-blue-600 border border-gray-800">👍</a>
              </div>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Tienda</h4>
              <ul className="space-y-4"><li><a href="#coleccion">Lo Nuevo</a></li><li><a href="#ofertas">Ofertas Flash</a></li></ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Ayuda</h4>
              <ul className="space-y-4"><li><a href="#">Seguimiento</a></li><li><a href="#">Guía de Tallas</a></li></ul>
            </div>
            <div className="md:col-span-4 bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h4 className="text-white font-bold mb-2">Únete al Club</h4>
              <p className="text-xs text-gray-400 mb-4">Recibe ofertas exclusivas.</p>
              <div className="flex gap-2"><input type="email" placeholder="Correo..." className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-xs" /><button className="bg-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-rose-700 text-xs uppercase">Suscribir</button></div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} D'Carito Perú.</div>
            <div className="flex items-center gap-3"><span className="text-[10px] text-gray-500 font-bold uppercase">Pagos:</span><div className="h-8 px-3 rounded bg-white flex items-center justify-center font-bold text-gray-900 text-xs">Yape</div><div className="h-8 px-3 rounded bg-white flex items-center justify-center font-bold text-gray-900 text-xs">Plin</div></div>
          </div>
        </div>
      </footer>

      {/* 9. BOTÓN WHATSAPP */}
      <a href={`https://wa.me/${NUMERO_WHATSAPP}?text=Hola%20D'Carito,%20consulta.`} target="_blank" className="fixed bottom-6 right-6 z-50 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-16 w-16 drop-shadow-2xl" />
      </a>
    </div>
  );
}