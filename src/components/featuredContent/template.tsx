import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { FeaturedContent as FormattedFeaturedContent } from '@/components/featuredContent/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { slugifyString } from '@/lib/utils/slug'
import { setPTag } from '@/lib/utils/helpers'

export function FeaturedContent({
  title,
  description,
  link,
}: ParagraphComponent<FormattedFeaturedContent>) {
  return (
    <va-card class="vads-u-flex--fill vads-u-margin-bottom--2 vads-u-margin-right--0 tablet:vads-u-margin-x--0p5 spotlight-card">
      {title && (
        <>
          <h3 className="vads-u-margin-top--0">{title}</h3>
        </>
      )}
      {description && (
        <div
          id={`featured-content-description${slugifyString(title)}`}
          // Sometimes this component is being used with a non-raw html string, in those cases it should be wrapped in a <p>
          dangerouslySetInnerHTML={{ __html: setPTag(description) }}
        />
      )}
      {link && link.url && (
        <p>
          <VaLink
            href={link.url}
            text={link.label}
            active={true}
            data-testid="featured-content-link"
          />
        </p>
      )}
    </va-card>
  )
}
