import { WysiwygField } from '../wysiwyg'
import type { FeaturedContent as FeaturedContentType } from '@/types/formatted/featuredContent'
import { ParagraphComponent } from '@/types/formatted/paragraph'
import { kebabCase } from 'lodash'

export function CCFeaturedContent({
  className,
  featuredContent,
  headingLevel = 'h3',
}: {
  className?: string
  featuredContent: ParagraphComponent<FeaturedContentType>
  headingLevel?: 'h2' | 'h3' | 'h4'
}) {
  const { title, description, link } = featuredContent
  const baseId = kebabCase(title).slice(0, 20)
  const propsForHeader = {
    slot: 'headline',
    id: `summary-box-${baseId}`,
    'data-testid': `featured-content-${baseId}-headline`,
  }
  return (
    <va-summary-box
      class={className || undefined}
      data-testid={`featured-content-${baseId}`}
    >
      {headingLevel === 'h2' ? <h2 {...propsForHeader}>{title}</h2> : null}
      {headingLevel === 'h3' ? <h3 {...propsForHeader}>{title}</h3> : null}
      {headingLevel === 'h4' ? <h4 {...propsForHeader}>{title}</h4> : null}
      <div data-testid={`featured-content-${baseId}-body`}>
        <WysiwygField html={description} />
        {link?.url && link?.label ? (
          <va-link
            href={link.url}
            text={link.label}
            id={link.id || undefined}
            data-testid={link.id || 'featured-content-link'}
          />
        ) : null}
      </div>
    </va-summary-box>
  )
}
