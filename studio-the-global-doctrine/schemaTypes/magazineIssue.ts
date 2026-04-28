import {defineField, defineType} from 'sanity'

export const magazineIssue = defineType({
  name: 'magazineIssue',
  title: 'Magazine Issue',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main title of the issue (e.g., The Global Doctrine)',
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
      type: 'image',
      description: 'Upload the JPG or PNG cover',
      options: { hotspot: true }, 
    }),
    defineField({
      name: 'pdfFile',
      title: 'Magazine PDF',
      type: 'file',
      description: 'Upload the PDF version here',
      options: { accept: '.pdf' },
    }),
  ],
})