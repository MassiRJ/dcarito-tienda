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
    defineField({
      name: 'precio',
      title: 'Precio (S/)',
      type: 'number',
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