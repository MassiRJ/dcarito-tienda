import { createClient } from '@sanity/client';

// --- CONFIGURACIÓN ---
const client = createClient({
  projectId: 'aijggl0d', // 1. Pon tu Project ID (el que está en sanity.config.ts)
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skbj3eYAdaJ3t2nzJtbFIXi5CA22tdiHElkXlXYYLNWEnO0CWa6CD9FExE0bWC7V7EeEUYEoMgFGDKFk0bvxETARarVnxC42GrPSQzvSQ4YkrqD97kJtsB8b5gaTmmNXMzXMUalChEGcgIFQPwUdpFMHMGSOmzKtlZusdD1WcUDzpR578mXJ', // 2. PEGA AQUÍ EL TOKEN sky...
});

// --- DATOS FICTICIOS (20 PRODUCTOS) ---
const PRODUCTOS = [
  { nombre: "Brasier Encaje Floral", precio: 89, cat: "Brasieres" },
  { nombre: "Push Up Invisible", precio: 95, cat: "Brasieres" },
  { nombre: "Bralette Negro Sexy", precio: 70, cat: "Brasieres" },
  { nombre: "Brasier Deportivo Soft", precio: 65, cat: "Brasieres" },
  { nombre: "Strapless Beige", precio: 85, cat: "Brasieres" },
  { nombre: "Panty Hilo Algodón", precio: 25, cat: "Calzones" },
  { nombre: "Bikini Encaje Rojo", precio: 30, cat: "Calzones" },
  { nombre: "Pack x3 Cacheteros", precio: 60, cat: "Calzones" },
  { nombre: "Panty Control Abdomen", precio: 45, cat: "Calzones" },
  { nombre: "Tanga Invisible Seamless", precio: 20, cat: "Calzones" },
  { nombre: "Body Reductor Colombiano", precio: 150, cat: "Fajas" },
  { nombre: "Cinturilla Avispa", precio: 120, cat: "Fajas" },
  { nombre: "Faja Short Levanta Cola", precio: 140, cat: "Fajas" },
  { nombre: "Chaleco Látex Deportivo", precio: 130, cat: "Fajas" },
  { nombre: "Faja Post Quirúrgica", precio: 180, cat: "Fajas" },
  { nombre: "Pijama Satín Champagne", precio: 95, cat: "Pijamas" },
  { nombre: "Bata de Seda Negra", precio: 110, cat: "Pijamas" },
  { nombre: "Conjunto Short Algodón", precio: 65, cat: "Pijamas" },
  { nombre: "Pijama Enterizo Polar", precio: 80, cat: "Pijamas" },
  { nombre: "Camisón Romántico", precio: 75, cat: "Pijamas" }
];

async function subirProductos() {
  console.log(`🚀 Cargando ${PRODUCTOS.length} productos (Solo Texto)...`);

  for (const prod of PRODUCTOS) {
    try {
      const doc = {
        _type: 'producto',
        nombre: prod.nombre,
        slug: { 
          _type: 'slug', 
          current: prod.nombre.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
        },
        precio: prod.precio,
        categoria: prod.cat,
        descripcion: `Descripción exclusiva para ${prod.nombre}. Material premium.`,
        etiqueta: Math.random() > 0.7 ? "Nuevo" : null,
        // NO SUBIMOS IMAGEN PARA EVITAR EL BLOQUEO DEL PROXY 808
      };

      await client.create(doc);
      console.log(`✅ ÉXITO: ${prod.nombre} creado.`);
      
    } catch (error) {
      console.error(`❌ ERROR:`, error.message);
    }
  }
  console.log("🏁 ¡Terminado! Ahora ve a tu página y recarga.");
}

subirProductos();