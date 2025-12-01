import { MediaImage } from '@/components/mediaDocument/formatted-type'

export interface NewsSpotlightData {
  image: MediaImage | null
  headline: string | null
  link: {
    url: string
    text: string
  } | null
  promoText: string | null
}
