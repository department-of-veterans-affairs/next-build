import { HeadingElement as FormattedHeadingElement } from './formatted-type'

export const HeadingElement = ({
  headingLevel,
  slot = '',
  children,
}: FormattedHeadingElement) => {
  const HeadingElement = headingLevel
  return (
    <HeadingElement
      slot={slot}
      dangerouslySetInnerHTML={{ __html: children }}
    ></HeadingElement>
  )
}
