import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function FeaturedContent({
  title,
  description,
  link,
}: ParagraphComponent<FormattedFeaturedContent>) {
  return (
    <div
      className="feature featured-content-list-item vads-u-flex--fill vads-u-padding-y--1p5 vads-u-padding-x--1p5 vads-u-margin-bottom--0 medium-screen:vads-u-margin-bottom--2"
      data-next-component="templates/common/featuredContent"
    >
      {title && (
        <>
          <h3 className="force-small-header vads-u-margin-bottom--2">
            {title}
          </h3>
          <hr className="featured-content-hr vads-u-margin-y--1p5 vads-u-border-color--primary"></hr>
        </>
      )}
      {description && (
        <div
          id={`featured-content-description${title}`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {link && link.url && (
        <a
          className="vads-u-display--block vads-u-padding-top--1"
          href={link.url}
        >
          <span>
            {' '}
            {link.label}{' '}
            <i
              className="fa fa-chevron-right vads-facility-hub-cta-arrow"
              aria-hidden="true"
            ></i>
          </span>
        </a>
      )}
    </div>
  )
}
