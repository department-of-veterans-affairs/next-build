import { ImageComponent } from '../image'

export type MediaImageProps = {
  id: string
  url: string
  width?: number
  height?: number
  alt?: string
  title?: string
  styles?: string
  imageStyle?: string
  className?: string | ''
  loader?: () => void
}
// Different from the ImageProps that are imported in image/index.tsx

export const MediaImageComponent = ({
  id,
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
    height: styles[imageStyle]?.meta?.linkParams?.height,
    width: styles[imageStyle]?.meta?.linkParams?.width,
  }

  return (
    <ImageComponent
      id={id}
      src={imageStyles?.url || url}
      alt={alt || ''}
      title={title || ''}
      width={imageStyles.width || width}
      height={imageStyles.height || height}
      className={className}
    />
  )
}
