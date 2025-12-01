import { MediaImage } from '@/components/mediaDocument/formatted-type'

export interface NewsSpotlightData {
  image: MediaImage
  headline: string
  link: {
    url: string
    text: string
  }
  promoText: string
}
