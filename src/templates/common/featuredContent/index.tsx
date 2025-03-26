import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function FeaturedContent({
  title,
  description,
  link,
}: ParagraphComponent<FormattedFeaturedContent>) {
  return (
    <va-card class="vads-u-flex--fill vads-u-margin-bottom--2 vads-u-margin-right--0 medium-screen:vads-u-margin-x--0p5 spotlight-card hydrated">
      {title && (
        <>
          <h3 className="vads-u-margin-top--0">{title}</h3>
        </>
      )}
      {description && (
        <div
          id={`featured-content-description${title}`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {link && link.url && (
        <va-link
          class="hydrated"
          href={link.url}
          text={link.label}
          active={true}
          data-testid="featured-content-link"
        />
      )}
    </va-card>
  )
}
