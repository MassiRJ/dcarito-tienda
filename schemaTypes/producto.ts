import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'producto',
  title: 'Mis Productos',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre del Producto',
      type: 'string',
    }),
    // --- CAMPO NUEVO: SLUG (Para el link) ---
    defineField({
      name: 'slug',
      title: 'Link Personalizado (Slug)',
      type: 'slug',
      options: {
        source: 'nombre', // Se genera automático basado en el nombre
        maxLength: 96,
      },
    }),
    defineField({
      name: 'precio',
      title: 'Precio (S/)',
      type: 'number',
    }),
    defineField({
      name: 'antes',
      title: 'Precio Antes (Opcional)',
      type: 'number',
    }),
    // --- CAMPO NUEVO: DESCRIPCIÓN ---
    defineField({
      name: 'descripcion',
      title: 'Descripción Detallada',
      type: 'text', // Texto largo
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Brasieres', value: 'Brasieres' },
          { title: 'Calzones', value: 'Calzones' },
          { title: 'Fajas', value: 'Fajas' },
          { title: 'Pijamas', value: 'Pijamas' },
        ],
      },
    }),
    defineField({
      name: 'imagen',
      title: 'Foto Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'etiqueta',
      title: 'Etiqueta (Ej: Oferta, Nuevo)',
      type: 'string',
    }),
  ],
})