import { useState, useEffect } from 'react'
import Image from '../image'
import { MediaImageType } from '@/types/index'

export const MediaImageComponent = (props: MediaImageType) => {
  const image = props[0] ?? props ?? null
  const [showImage, setShowImages] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  // assign 2_1_large as default image cropping
  const cropImage = image?.imageStyle ?? '2_1_large'

  useEffect(() => {
    if (!image) {
      setShowImages(false)
      return null
    }
    return () => {
      if (image.link) {
        setImageSrc(image.link[cropImage])
      }
      setShowImages(true)
    }
  }, [image, cropImage])

  const imagePath = {
    href: imageSrc ? imageSrc?.href : image?.url,
    height: imageSrc ? imageSrc?.meta?.linkParams?.height : image.height, // fallback height
    width: imageSrc ? imageSrc?.meta?.linkParams?.width : image?.width, // fallback width
  }

  return (
    <>
      {showImage && (
        <>
          <Image
            id={image?.id}
            alt={image?.alt}
            src={imagePath?.href || image?.url}
            width={imagePath?.width || image?.width}
            height={imagePath?.height || image?.height}
            className={props?.className}
          />
          <div>{image.title}</div>
        </>
      )}
    </>
  )
}
