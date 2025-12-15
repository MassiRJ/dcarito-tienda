'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Importamos la carpeta que acabas de crear
import {schemaTypes} from './schemaTypes'

// ⚠️ REEMPLAZA ESTO CON TU ID (Míralo en sanity.io/manage)
// Debe ser algo como 'k2l4m5n6' (letras y números)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'aijggl0d'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes, // Aquí conectamos tus productos
  },
  plugins: [
    structureTool(),
    visionTool(),
  ],
})