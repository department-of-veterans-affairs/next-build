import { ImageComponent } from '../image'
import { MediaImageType } from '@/types/index'

export const MediaImageComponent = ({
  id,
  url,
  alt,
  title,
  width,
  height,
  link,
  className,
  imageStyle,
}: MediaImageType) => {
  if (!link) return null

  const image = {
    url: link[imageStyle]?.href,
    height: link[imageStyle]?.meta?.linkParams?.height,
    width: link[imageStyle]?.meta?.linkParams?.width,
  }

  return (
    <ImageComponent
      id={id}
      alt={alt}
      title={title}
      className={className}
      src={image?.url || url}
      width={image?.width || width}
      height={image?.height || height}
    />
  )
}
