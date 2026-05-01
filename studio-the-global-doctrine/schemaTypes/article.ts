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
      description: "Short summary shown on cards and in search results.",
      type: "text",
      rows: 3,
      validation: (R) => R.required().max(300),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessibility.",
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
          fields: [{ name: "alt", type: "string", title: "Alt Text" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "mainImage",
    },
  },
});