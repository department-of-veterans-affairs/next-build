import React from 'react'
import clsx from 'clsx'
import { TextWithImage, TextWithImageProps } from '../textWithImage'
import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'
import { MediaImage } from '@/templates/common/mediaImage'

type TextWithImageAndMapProps = Omit<TextWithImageProps, 'image'> & {
  imageProps: FormattedMediaImage
  facilityId: string
}

/**
 * This wrapper encapsulates special layout CSS necessary for the image and static map
 * widget to not break the flex layout. Both the CSS being applied in the widget and the
 * parent layout CSS have to work together to not break things, so we're putting that
 * tight coupling into a single component.
 *
 * More details about the CSS:
 * The old CSS for the image and static map widget used in production is pretty hacky.
 * The image and map elements in this widget have a "facility-img" class that applies a
 * minimum width, so our column needs to be able to grow to contain it. Previously, this
 * was achieved in a hacky way by setting the image column's display property to
 * `inline-table`. A more flexbox-friendly approach would be to set `flex-grow` to 1 and
 * `flex-basis` to `fit-content`, but we don't have a VADS utility class for
 * `flex-basis`. Ideally, there would be no minimum width on the image at all.
 */
export const TextWithImageAndMap = ({
  children,
  facilityId,
  imageProps,
  imageClassName = '',
  ...otherProps
}: TextWithImageAndMapProps) => (
  <TextWithImage
    image={
      <>
        <MediaImage {...imageProps} imageStyle="3_2_medium_thumbnail" />
        <div data-widget-type="facility-map" data-facility={facilityId}>
          {/* TODO: Create Facility Map component for display here */}
        </div>
      </>
    }
    imageClassName={imageClassName}
    {...otherProps}
  >
    {children}
  </TextWithImage>
)
