import { defineField, defineType } from "sanity";

export default defineType({
  name: "interview",
  title: "Interview",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Interview Title / Quote",
      description: "The pull quote or title shown on the card (e.g. 'Diplomacy is the art of postponing certainty')",
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
      name: "personName",
      title: "Person Name",
      description: "Full name of the interviewee (e.g. Ambassador Henrik Aaland)",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "personRole",
      title: "Person Role / Title",
      description: "Their title or position (e.g. Former UN Special Envoy)",
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
      title: "Short Excerpt",
      description: "A brief summary shown on the interview card. Max 200 characters.",
      type: "text",
      rows: 3,
      validation: (R) => R.max(200),
    }),
    defineField({
      name: "photo",
      title: "Person Photo",
      description: "📐 Recommended size: 800×1000px (4:5 portrait). Minimum width: 600px. Use JPG or WebP.",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Describe the person for accessibility.",
        },
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "body",
      title: "Interview Body",
      description: "Full interview content. Use blockquote style for the interviewee's answers.",
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
      title: "personName",
      subtitle: "title",
      media: "photo",
    },
  },
});