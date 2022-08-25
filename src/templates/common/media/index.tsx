import { ImageComponent } from '../image'
import { MediaImageType } from '@/types/index'

export const MediaImageComponent = (props: MediaImageType) => {
  const { id, title, alt, link } = props[0] ?? props

  return (
    <>
      <ImageComponent
        id={id}
        alt={alt}
        className={props.className}
        src={link[props.imageStyle]?.href}
        height={link[props.imageStyle]?.meta.linkParams?.height}
        width={link[props.imageStyle]?.meta.linkParams?.width}
      />
      <span>{title}</span>
    </>
  )
}
