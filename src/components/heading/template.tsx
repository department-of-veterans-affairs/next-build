import { HeadingElement as FormattedHeadingElement } from './formatted-type'

// extend the FormattedHeadingElement and the html heading element attributes for jsx
type HeadingElementProps = FormattedHeadingElement &
  React.HTMLAttributes<HTMLHeadingElement>

export const HeadingElement = ({
  headingLevel,
  children,
  ...attributes
}: HeadingElementProps) => {
  const HeadingElement = headingLevel
  return (
    <HeadingElement
      {...attributes}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}
