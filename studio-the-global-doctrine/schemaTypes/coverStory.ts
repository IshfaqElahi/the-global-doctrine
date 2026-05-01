import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'coverStory',
  title: 'Cover Story',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Article Slug',
      description: 'URL path for the article (e.g., rising-tensions-south-china-sea)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Excerpt',
      description: 'Short paragraph shown below the headline on the homepage.',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      options: { dateFormat: 'MMMM D, YYYY' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hero Image',
      description: '📐 Recommended size: 1600×900px. Minimum width: 1200px.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    
    // --- NEW: THE FULL ARTICLE BODY ---
    defineField({
      name: 'body',
      title: 'Article Body',
      description: 'Write the full cover story here. This content is shown when readers click "Read the cover story".',
      type: 'array',
      of: [
        { type: 'block' },
        { 
          type: 'image', 
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alternative Text', description: 'Important for SEO.' },
            { name: 'caption', type: 'string', title: 'Image Caption' }
          ]
        }
      ],
      validation: (Rule) => Rule.required(),
    }),

    // --- NEW: SEO SETTINGS ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (Optional)',
      description: 'Custom title for Google search results. If left blank, the main Headline Title is used.',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      description: 'A 150-160 character summary that appears under the blue link in Google search results.',
      type: 'text',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best Google ranking.'),
    }),
  ],
  preview: {
    select: { title: 'title', author: 'author', media: 'mainImage' },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})