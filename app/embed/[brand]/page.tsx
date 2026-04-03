import { getBrand } from "@/lib/brand-config"
import { EmbedClient } from "./embed-client"

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ brand: string }>
}) {
  const { brand: brandSlug } = await params
  const brand = getBrand(brandSlug)

  return (
    <EmbedClient
      assistantName={brand.assistantName}
      avatarLetter={brand.avatarLetter}
      studioName={brand.studioName}
      apiUrl={`/api/chat/${brand.slug}`}
    />
  )
}
