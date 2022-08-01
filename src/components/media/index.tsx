import Image from '@/components/image'

// Different from the ImageProps that are imported in image/index.tsx
export type ImageProps = {
  url: string
  width?: number
  height?: number
  alt?: string
  title?: string
  styles?: object //todo: do we need to type this more strongly?
}

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
