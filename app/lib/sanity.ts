import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// ⚠️ REEMPLAZA ESTO CON TU ID REAL (El mismo que pusiste en sanity.config.ts)
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'aijggl0d'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01', // Fecha de versión (déjala así)
  useCdn: true, // Hace que cargue rápido
})

const builder = imageUrlBuilder(client)

// Esta función convierte la foto rara de Sanity en un link normal
export function urlFor(source: any) {
  return builder.image(source)
}