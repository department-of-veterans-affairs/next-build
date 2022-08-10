import Image from '@/components/image'

export type MediaImageProps = {
  url: string
  width?: number
  height?: number
  alt?: string
  title?: string
  styles?: string
  imageStyle?: string
  className?: string | ''
}
// Different from the ImageProps that are imported in image/index.tsx

export const MediaImageComponent = ({
  url,
  alt,
  title,
  width,
  height,
  styles,
  imageStyle,
  className,
}: MediaImageProps) => {
  if (!styles) return null
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
      width={imageStyles.width || width}
      height={imageStyles.height || height}
      className={className}
    />
  )
}
