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
}

export function TextWithImage({
  image,
  children,
  textClassName = '',
  imageClassName = '',
  className,
  ...divProps
}: TextWithImageProps) {
  return (
    <div
      className={clsx(
        'vads-grid-row vads-grid-gap-5 vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row vads-u-margin-bottom--4 tablet:vads-u-margin-bottom--5',
        className
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

      <section
        className={clsx(
          'mobile-lg:vads-grid-col-6 tablet:vads-grid-col-4 vads-u-order--first mobile-lg:vads-u-order--initial vads-u-margin-bottom--2',
          imageClassName
        )}
      >
        {image}
      </section>
    </div>
  )
}
