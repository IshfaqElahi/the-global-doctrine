import { defineField, defineType } from 'sanity'

export const magazineIssue = defineType({
  name: 'magazineIssue',
  title: 'Magazine Issue',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main title of the issue (e.g., The Global Doctrine)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issue',
      title: 'Issue Number',
      type: 'string',
      description: 'e.g., 1st Edition, Issue 14',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Display Date',
      type: 'string',
      description: 'e.g., March 2026, Spring 2026',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: '📐 Recommended size: 800×1067px (3:4 portrait — standard magazine cover). Minimum width: 600px. Use high-resolution JPG or WebP. This appears in the Magazine section on the homepage.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Describe the cover for accessibility.',
        },
      ],
    }),
    defineField({
      name: 'pdfFile',
      title: 'Magazine PDF',
      description: 'Upload the full PDF version of this issue.',
      type: 'file',
      options: { accept: '.pdf' },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'issue', media: 'coverImage' },
  },
})