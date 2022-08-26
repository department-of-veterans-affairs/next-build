import { useState, useEffect } from 'react'
import Image from '../image'
import { MediaImageType } from '@/types/index'

export const MediaImageComponent = (props: MediaImageType) => {
  const [showImage, setShowImages] = useState(false)
  // if props is single object return else iterate over all objects
  const { id, title, alt, link, url, width, height } = props[0]
    ? props[0]
    : props
  // default image style
  const imageStyle = props.imageStyle ?? '2_1_large'

  useEffect(() => {
    if (link) {
      setShowImages(true)
    }
    return () => {
      setShowImages(false)
    }
  }, [link])

  return (
    showImage && (
      <>
        <Image
          id={id}
          alt={alt}
          className={props.className}
          src={link ? link[imageStyle]?.href : url}
          height={link ? link[imageStyle]?.meta.linkParams?.height : width}
          width={link ? link[imageStyle]?.meta.linkParams?.width : height}
        />
        <span>{title}</span>
      </>
    )
  )
}
