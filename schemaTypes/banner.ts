import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Banner Principal (Slider)',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título Grande',
      type: 'string',
      description: 'Ej: CONFORT REAL',
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo Pequeño',
      type: 'string',
      description: 'Ej: Nueva Colección 2025',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción Corta',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen de Fondo (Horizontal)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'boton',
      title: 'Texto del Botón',
      type: 'string',
      initialValue: 'Ver Colección',
    }),
    defineField({
      name: 'color',
      title: 'Color del Botón',
      type: 'string',
      options: {
        list: [
          { title: 'Rosa (Marca)', value: 'rose' },
          { title: 'Morado', value: 'purple' },
          { title: 'Esmeralda', value: 'emerald' },
          { title: 'Negro', value: 'black' },
        ],
      },
      initialValue: 'rose',
    }),
  ],
})