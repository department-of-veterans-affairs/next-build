import { FeaturedContent as FormattedFeaturedContent } from '@/components/featuredContent/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { slugifyString } from '@/lib/utils/slug'

export function FeaturedContent({
  title,
  description,
  link,
}: ParagraphComponent<FormattedFeaturedContent>) {
  // Sometimes this component is being used with a non-raw html string, in those cases it should be wrapped in a <p>
  const setPTag = () => {
    // Checks of empty or only whitespace characters
    if (!description || /^\s*$/.test(description)) return ''
    // Checks for any HTML tag
    if (/^\s*<[^>]+>/.test(description.trim())) {
      return description
    }
    return `<p>${description}</p>`
  }
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
          dangerouslySetInnerHTML={{ __html: setPTag() }}
        />
      )}
      {link && link.url && (
        <p>
          <va-link
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
