import { ImageProps } from '@/types/index'
import Image from '@/components/image'


export type MediaImageProps = {
  image: ImageProps
  imageStyle: string
}

export const MediaImageComponent = ({ image, imageStyle }: MediaImageProps) => {
  if (!image) return null

  const { url, alt, title, width, height, styles } = image

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
