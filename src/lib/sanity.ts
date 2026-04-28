import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'vk54bhae', 
  dataset: 'production',
  useCdn: true, // Makes the website load ultra-fast
  apiVersion: '2026-04-28', 
})

const builder = imageUrlBuilder(client)

// Tell TypeScript to stop worrying about the 'any' type here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source)