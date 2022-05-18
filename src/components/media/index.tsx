import Image from '@/components/image'
import { DrupalFile, DrupalMedia } from 'next-drupal'
import { absoluteURL } from '@/utils/utils'
import { privateEncrypt } from 'crypto'

interface ImageProps {
  url: string
  width?: string
  height?: string
  alt?: string
  title?: string
  styles?: object
}

interface MediaProps {
  media: DrupalMedia
  imageStyle: string
}

export function formatImage(file: DrupalMedia): ImageProps {
  return {
    url: absoluteURL(file?.image?.uri?.url),
    styles: file?.image?.links,
    alt: file?.image?.resourceIdObjMeta?.alt,
    title: file?.image?.resourceIdObjMeta?.title,
    width: file?.image?.resourceIdObjMeta?.width,
    height: file?.image?.resourceIdObjMeta?.height,
  }
}

export const MediaImage = ({ media, imageStyle }: MediaProps) => {
  if (!media) return null
  const { styles, url, alt, title, width, height } = formatImage(media)

  if (!imageStyle) imageStyle = 'full_content_width'
  const imageStyles = {
    url: styles[imageStyle]?.href,
    height: styles[imageStyle]?.meta?.height,
    width: styles[imageStyle]?.meta?.width,
  }

  return (
    <Image
      src={imageStyles ? imageStyles.url : url}
      alt={alt}
      title={title}
      width={imageStyles ? imageStyles.width : width}
      height={imageStyles ? imageStyles.height : height}
    />
  )
}
