import { HeadingElement as FormattedHeadingElement } from '@/types/formatted/headingElement'

export const HeadingElement = ({
  headingLevel,
  slot = '',
  children,
}: FormattedHeadingElement) => {
  const HeadingElement = headingLevel
  return (
    <HeadingElement
      data-next-component="templates/common/heading"
      slot={slot}
      dangerouslySetInnerHTML={{ __html: children }}
    ></HeadingElement>
  )
}
