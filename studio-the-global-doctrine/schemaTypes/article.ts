import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Cover Story",
          "International",
          "Europe",
          "Asia",
          "Africa",
          "Middle East",
          "Diplomacy",
          "America",
          "Economics",
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
      initialValue: () => new Date().toISOString().split("T")[0],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short summary shown on article cards and search results. Max 300 characters.",
      type: "text",
      rows: 3,
      validation: (R) => R.required().max(300),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      description: "📐 Recommended size: 1200×800px (4:3) or 1600×900px (16:9). Minimum width: 800px. Use JPG or WebP.",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Describe the image for SEO and screen readers.",
        },
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "body",
      title: "Article Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "📐 Inline images: recommended 1200×675px (16:9). Use JPG or WebP.",
            },
          ],
        },
      ],
    }),

    // ── References / Credits ──────────────────────────
    defineField({
      name: "showReferences",
      title: "Show References / Credits Section",
      description: "Toggle ON to display a references section at the bottom of this article.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "references",
      title: "References & Credits",
      description: "Add source links, citations, and image credits. Only shown if the toggle above is ON.",
      type: "array",
      hidden: ({ document }) => !document?.showReferences,
      of: [
        {
          type: "object",
          title: "Reference",
          fields: [
            {
              name: "text",
              title: "Reference Text / Title",
              type: "string",
              description: "The name or title of the source (e.g. 'Reuters — Cuba Energy Report 2026')",
              validation: (R: any) => R.required(),
            },
            {
              name: "url",
              title: "URL / Link",
              type: "url",
              description: "The full URL of the source (must start with https://)",
            },
            {
              name: "credit",
              title: "Image / Source Credit (optional)",
              type: "string",
              description: "e.g. 'Photo: AP Images' or 'Data: World Bank 2025'",
            },
          ],
          preview: {
            select: { title: "text", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "mainImage" },
  },
});