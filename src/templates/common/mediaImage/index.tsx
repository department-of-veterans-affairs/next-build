import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'
import Image from 'next/image'

export const MediaImage = (
  props: FormattedMediaImage & {
    imageStyle?: string
    className?: string
    style?: {
      [key: string]: string
    }
  }
) => {
  return (
    <Image
      id={props.id}
      alt={props.alt}
      src={props.links?.[props.imageStyle]?.href}
      width={props.width}
      height={props.height}
      title={props.title}
      className={props.className}
      style={props.style}
    />
  )
}
