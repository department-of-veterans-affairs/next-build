import Image from '@/components/image'

export type MediaImageProps = {
  image?: any
  imageStyle?: string
  className?: string | ''
  url: string
  width?: number
  height?: number
  alt?: string
  title?: string
  styles?: any
}
// Different from the ImageProps that are imported in image/index.tsx

export const MediaImageComponent = ({
  image,
  imageStyle = 'full',
  className,
}: MediaImageProps) => {
  if (!image) return null

  const { url, alt, title, width, height, styles } = image

  const imageStyles = {
    url: styles[imageStyle]?.href,
    height: styles[imageStyle]?.meta?.height,
    width: styles[imageStyle]?.meta?.width,
  }

  return (
    <Image
      src={imageStyles.url || url}
      alt={alt || ''}
      title={title || ''}
      width={imageStyles.width || width}
      height={imageStyles.height || height}
      className={className}
    />
  )
}
