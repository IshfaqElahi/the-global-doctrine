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

    // --- THE FULL ARTICLE BODY ---
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
            { name: 'caption', type: 'string', title: 'Image Caption' },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // --- SEO SETTINGS ---
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

    // --- REFERENCES / CREDITS ---
    defineField({
      name: 'showReferences',
      title: 'Show References / Credits Section',
      description: 'Toggle ON to display a references section at the bottom of this cover story.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'references',
      title: 'References & Credits',
      description: 'Add source links, citations, and image credits. Only shown if the toggle above is ON.',
      type: 'array',
      hidden: ({ document }) => !document?.showReferences,
      of: [
        {
          type: 'object',
          title: 'Reference',
          fields: [
            defineField({
              name: 'text',
              title: 'Reference Text / Title',
              type: 'string',
              description: "The name or title of the source (e.g. 'Reuters — Cuba Energy Report 2026')",
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL / Link',
              type: 'url',
              description: 'The full URL of the source (must start with https://)',
            }),
            defineField({
              name: 'credit',
              title: 'Image / Source Credit (optional)',
              type: 'string',
              description: "e.g. 'Photo: AP Images' or 'Data: World Bank 2025'",
            }),
          ],
          preview: {
            select: { title: 'text', subtitle: 'url' },
          },
        },
      ],
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
