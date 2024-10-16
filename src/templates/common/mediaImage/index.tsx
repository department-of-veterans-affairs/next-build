import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'
import Image from 'next/image'

const IMAGE_STYLE_DIMENSIONS = {
  '1_1_square_medium_thumbnail': {
    width: 240,
    height: 240,
  },
  '2_1_large': {
    width: 1024,
    height: 512,
  },
  '2_1_medium_thumbnail': {
    width: 480,
    height: 240,
  },
  '2_3_medium_thumbnail': {
    width: 320,
    height: 480,
  },
  '3_2_medium_thumbnail': {
    width: 480,
    height: 320,
  },
  '7_2_medium_thumbnail': {
    width: 1050,
    height: 300,
  },
  large: {
    width: 480,
    height: 480,
  },
}

const calcImageStyleHeight = (
  baseImageHeight: number,
  baseImageWidth: number,
  imageStyle: string
) =>
  IMAGE_STYLE_DIMENSIONS[imageStyle] || {
    width: baseImageWidth,
    height: baseImageHeight,
  }

export const MediaImage = (
  props: FormattedMediaImage & {
    imageStyle?: string
    className?: string
    style?: {
      [key: string]: string
    }
  }
) => {
  const { width, height } = calcImageStyleHeight(
    props.width,
    props.height,
    props.imageStyle
  )

  return (
    <Image
      data-next-component="templates/common/mediaImage"
      id={props.id}
      alt={props.alt}
      src={props.links?.[props.imageStyle]?.href}
      width={width}
      height={height}
      title={props.title}
      className={props.className}
      style={props.style}
    />
  )
}
