import { FeaturedContent } from '@/types/formatted/featuredContent'
import { slugifyString } from '@/lib/utils/slug'
import { ConditionalHeaderLevel } from '../conditionalHeaderLevel'
import { WysiwygField } from '@/templates/components/wysiwyg'

export function SummaryBox({
  title,
  description,
  link,
  headerLevel,
}: FeaturedContent & { headerLevel: number }) {
  const id = slugifyString(title)
  const dataTestId = `summary-box-${id}`
  return (
    <va-summary-box class="vads-u-margin-bottom--4">
      <ConditionalHeaderLevel
        headerLevel={headerLevel}
        passThroughId={id}
        data-testid={dataTestId}
        slot="headline"
      >
        {title}
      </ConditionalHeaderLevel>
      <WysiwygField html={description} />
      {!!link?.url && !!link.label && (
        <va-link
          data-testid={`${dataTestId}-link`}
          href={link.url}
          text={link.label}
        />
      )}
    </va-summary-box>
  )
}
