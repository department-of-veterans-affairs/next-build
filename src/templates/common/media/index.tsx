import { useState, useEffect } from 'react'
import Image from '../image'
import { MediaImageType } from '@/types/index'

export const MediaImageComponent = (props: MediaImageType) => {
  const images = props[0] ?? props
  const [showImage, setShowImages] = useState(false)

  useEffect(() => {
    if (!images) {
      setShowImages(false)
      return null
    }
    return () => {
      setShowImages(true)
    }
  }, [images])

  const style = {
    href: images?.link ? images?.link[props?.imageStyle]?.href : images?.url,
    height: images?.link
      ? images?.link[props?.imageStyle]?.meta?.linkParams?.height
      : images.height, // fallback height
    width: images.link
      ? images?.link[props?.imageStyle]?.meta?.linkParams?.width
      : images?.width, // fallback width
  }

  return (
    <>
      {showImage && (
        <Image
          id={images?.id}
          alt={images?.alt}
          src={style?.href || images?.url}
          width={style?.width || images?.width}
          height={style?.height || images?.height}
          className={props?.className}
        />
      )}
    </>
  )
}
