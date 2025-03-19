import { WysiwygField } from '../wysiwyg'
import type { FeaturedContent as FeaturedContentType } from '@/types/formatted/featuredContent'
import { kebabCase } from 'lodash'

export function FeaturedContent({
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
  featuredContent: FeaturedContentType
}) {
  const { title, description, link } = featuredContent

  return (
    <va-summary-box class={className || undefined}>
      <h2
        slot="headline"
        className={headlineClassName || undefined}
        id={`summary-box-${kebabCase(title).slice(0, 20)}`}
      >
        {title}
      </h2>
      <div className={bodyClassName || undefined}>
        <WysiwygField html={description} />
        {link ? (
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
