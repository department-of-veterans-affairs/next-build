import { WysiwygField } from '../wysiwyg'
import type { FeaturedContent as FeaturedContentType } from '@/types/formatted/featuredContent'
import { ParagraphComponent } from '@/types/formatted/paragraph'
import { kebabCase } from 'lodash'

export function CCFeaturedContent({
  bodyClassName,
  className,
  featuredContent,
  headlineClassName,
}: {
  // className overrids
  bodyClassName?: string
  className?: string
  headlineClassName?: string
  // content to process
  featuredContent: ParagraphComponent<FeaturedContentType>
}) {
  const { title, description, link } = featuredContent
  const baseId = kebabCase(title).slice(0, 20)
  return (
    <va-summary-box
      class={className || undefined}
      data-testid={`featured-content-${baseId}`}
    >
      <h2
        slot="headline"
        className={headlineClassName || undefined}
        id={`summary-box-${baseId}`}
        data-testid={`featured-content-${baseId}-headline`}
      >
        {title}
      </h2>
      <div
        className={bodyClassName || undefined}
        data-testid={`featured-content-${baseId}-body`}
      >
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
