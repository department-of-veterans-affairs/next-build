import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function FeaturedContent({
  title,
  description,
  link,
}: ParagraphComponent<FormattedFeaturedContent>) {
  return (
    <div className="vads-u-border--1px featured-content-list-item vads-u-flex--fill vads-u-padding-bottom--2 vads-u-padding-x--1p5 vads-u-margin-y--0 medium-screen:vads-u-margin-bottom--2">
      {title && (
        <>
          <h3 className="vads-u-margin-bottom--2">{title}</h3>
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
          className="vads-u-display--block vads-u-padding-top--1"
          href={link.url}
          text={link.label}
          active={true}
          data-testid="featured-content-link"
        />
      )}
    </div>
  )
}
