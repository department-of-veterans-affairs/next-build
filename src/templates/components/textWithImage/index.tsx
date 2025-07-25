import React, { ReactNode, HTMLAttributes } from 'react'
import clsx from 'clsx'

type TextWithImageProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The image content to display on the right side (desktop) or top (mobile)
   * Can be any ReactNode - image, link, or other content
   */
  image: ReactNode
  /**
   * The text content to display on the left side (desktop) or bottom (mobile)
   */
  children: ReactNode
  /**
   * Optional CSS class name for the text section
   */
  textClassName?: string
  /**
   * Optional CSS class name for the image section
   */
  imageClassName?: string
  /**
   * Optional grid gap class name
   */
  gridGap?:
    | ''
    | 'vads-grid-gap-1'
    | 'vads-grid-gap-2'
    | 'vads-grid-gap-3'
    | 'vads-grid-gap-4'
    | 'vads-grid-gap-5'
  /**
   * The old CSS for the `ImageAndStaticMap` component used in production is pretty hacky.
   * Because the `ImageAndStaticMap` elements have a "facility-img" class that applies a
   * minimum width, our column needs to be able to grow to contain it. This was being
   * achieved in a hacky way by setting the image column's display property to
   * `inline-table`, whereas a more flexbox-friendly way would be to set the `flex-grow`
   * to 1 and the `flex-basis` to `fit-content`. We don't have a VADS utility class for
   * `flex-basis`. An even better way would be to not have a minimum width on the image.
   */
  hackyImageAndStaticMapHack?: boolean
}

export function TextWithImage({
  image,
  children,
  textClassName = '',
  imageClassName = '',
  className,
  gridGap = 'vads-grid-gap-5',
  hackyImageAndStaticMapHack = false,
  ...divProps
}: TextWithImageProps) {
  return (
    <div
      className={clsx(
        'vads-grid-row vads-u-display--flex vads-u-flex-wrap--nowrap vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row vads-u-margin-bottom--4 tablet:vads-u-margin-bottom--5',
        className,
        gridGap
      )}
      {...divProps}
    >
      <section
        className={clsx(
          'mobile-lg:vads-grid-col-6 tablet:vads-grid-col-8',
          textClassName
        )}
      >
        {children}
      </section>

      <div
        className={clsx(
          'mobile-lg:vads-grid-col-6 tablet:vads-grid-col-4 vads-u-order--first mobile-lg:vads-u-order--initial vads-u-margin-bottom--2',
          imageClassName,
          hackyImageAndStaticMapHack && 'inline-table-helper'
        )}
      >
        {image}
      </div>
    </div>
  )
}
