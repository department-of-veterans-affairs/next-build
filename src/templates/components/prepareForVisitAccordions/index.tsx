import { Accordion } from '@/templates/components/accordion'
import { AccordionItem as FormattedAccordionItem } from '@/types/formatted/accordion'

type PrepareForVisitAccordions = {
  visitItems: FormattedAccordionItem[]
}

export const PrepareForVisitAccordions = ({ visitItems }) => {
  if (visitItems.length === 0) return null
  return (
    <>
      <h2
        id="prepare-for-your-visit"
        className="vads-u-margin-top--0 vads-u-font-size--lg mobile-lg:vads-u-font-size--xl vads-u-margin-bottom--2"
      >
        Prepare for your visit
      </h2>
      <p>Select a topic to learn more.</p>
      <div className="vads-u-margin-bottom--3">
        <Accordion id={'prepare-for-your-visit'} bordered items={visitItems} />
      </div>
    </>
  )
}
