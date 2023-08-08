import { useState, useEffect } from 'react'
import Image from '../image'
import { MediaImageType } from '@/types/index'

export const MediaImage = (props: MediaImageType) => {
  const image = props[0] ?? props ?? null
  const [showImage, setShowImages] = useState(true)
  const [imageSrc, setImageSrc] = useState(null)
  // assign 2_1_large as default image cropping
  const cropImage = props?.imageStyle ?? '2_1_large'

  useEffect(() => {
    if (image.link) {
      setImageSrc(image.link[cropImage])
      setShowImages(true)
    }
    if (!image) {
      setShowImages(false)
      return null
    }
  }, [image, cropImage])

  // TODO: meta.linkParams no longer has height and width values
  const imagePath = {
    href: imageSrc ? imageSrc.href : image.url,
    height: imageSrc ? imageSrc.meta?.linkParams?.height : image.height, // fallback height
    width: imageSrc ? imageSrc.meta?.linkParams?.width : image.width, // fallback width
  }

  return (
    <>
      {showImage && (
        <Image
          id={image.id}
          alt={image.alt}
          src={imagePath.href}
          width={image.width}
          height={image.height}
          title={image.title}
          className={props?.className}
        />
      )}
    </>
  )
}
