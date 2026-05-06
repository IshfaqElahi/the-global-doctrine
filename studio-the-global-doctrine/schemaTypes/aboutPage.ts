export default {
  name: 'aboutPage',
  title: 'About Page Sections',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'e.g., "Who We Are" or "Editorial Policy"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'section',
      title: 'Section Identifier',
      type: 'string',
      description: 'Select which URL this content belongs to.',
      options: {
        list: [
          { title: 'Who We Are', value: 'who-we-are' },
          { title: 'Editorial Policy', value: 'policy' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The main text content for this section.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'section',
    },
    prepare({ title, subtitle }: { title: string, subtitle: string }) {
      return {
        title: title,
        subtitle: `Section: ${subtitle === 'who-we-are' ? 'Who We Are' : 'Editorial Policy'}`
      }
    }
  },
}