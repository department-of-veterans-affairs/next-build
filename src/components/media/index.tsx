import Image from '@/components/image'
import { DrupalMedia } from 'next-drupal'
import { absoluteURL } from '@/utils/utils'

interface ImageProps {
  url: string
  width?: string
  height?: string
  alt?: string
  title?: string
  styles?: object
}

interface MediaProps {
  image: DrupalMedia
}

export function formatImage(file: MediaProps): ImageProps {
  if (!file) return null
  return {
    url: absoluteURL(file.image?.uri?.url),
    styles: file.image?.links || 'full_content_width',
    alt: file.image?.resourceIdObjMeta?.alt,
    title: file.image?.resourceIdObjMeta?.title,
    width: file.image?.resourceIdObjMeta?.width,
    height: file.image?.resourceIdObjMeta?.height,
  }
}

export const MediaImageComponent = ({ image, imageStyle }) => {
  if (!image) return null

  const { styles, url, alt, title, width, height } = formatImage(image)

  const imageStyles = {
    url: styles[imageStyle]?.href,
    height: styles[imageStyle]?.meta?.height,
    width: styles[imageStyle]?.meta?.width,
  }

  return (
    <Image
      src={imageStyles?.url || url}
      alt={alt || ''}
      title={title || ''}
      width={imageStyles?.width || width}
      height={imageStyles?.height || height}
    />
  )
}
