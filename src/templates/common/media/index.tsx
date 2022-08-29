import { useState, useEffect } from 'react'
import Image from '../image'
import { MediaImageType } from '@/types/index'

export const assignBy = (key) => {
  return (data, item) => {
    data[item[key]] = item
    return data
  }
}

export const MediaImageComponent = (props: MediaImageType) => {
  const imageProps = props[0] ?? props
  const optimizedData = [imageProps].reduce(assignBy('id'), {})
  const [imageStyle, setImageStyle] = useState('2_1_large')
  const [showImage, setShowImages] = useState(false)

  useEffect(() => {
    if (!props) {
      setShowImages(false)
      return null
    }
    return () => {
      setImageStyle(props?.imageStyle)
      setShowImages(true)
    }
  }, [optimizedData, props])

  const image = optimizedData[imageProps?.id]

  if (!image) {
    return null
  }

  return (
    <>
      {showImage && (
        <Image
          src={image?.link[imageStyle]?.href || props.url}
          alt={image?.alt}
          width={
            image?.link[imageStyle]?.meta?.linkParams?.width || props.width
          }
          height={
            image?.link[imageStyle]?.meta?.linkParams?.height || props.height
          }
          className={props?.className}
        />
      )}
    </>
  )
}
