import React from 'react'
import clsx from 'clsx'
import { TextWithImage, TextWithImageProps } from '../textWithImage'
import { ImageAndStaticMap } from '../imageAndStaticMap'
import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'

type TextWithImageAndMapProps = Omit<TextWithImageProps, 'image'> & {
  imageProps: FormattedMediaImage
  facilityId: string
}

/**
 * The old CSS for the `ImageAndStaticMap` component used in production is pretty hacky.
 * Because the `ImageAndStaticMap` elements have a "facility-img" class that applies a
 * minimum width, our column needs to be able to grow to contain it. This was being
 * achieved in a hacky way by setting the image column's display property to
 * `inline-table`, whereas a more flexbox-friendly way would be to set the `flex-grow`
 * to 1 and the `flex-basis` to `fit-content`. We don't have a VADS utility class for
 * `flex-basis`. An even better way would be to not have a minimum width on the image.
 */
export const TextWithImageAndMap = ({
  children,
  facilityId,
  imageProps,
  imageClassName = '',
  ...otherProps
}: TextWithImageAndMapProps) => (
  <TextWithImage
    image={<ImageAndStaticMap image={imageProps} facilityId={facilityId} />}
    imageClassName={clsx(imageClassName, 'inline-table-helper')}
    {...otherProps}
  >
    {children}
  </TextWithImage>
)
