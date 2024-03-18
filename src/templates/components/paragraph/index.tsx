import { FormattedParagraph } from '@/data/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { AccordionItem } from '@/templates/components/accordion'
import { AccordionItem as FormattedAccordionItem } from '@/types/formatted/accordion'
import { Alert } from '@/templates/components/alert'
import { Alert as FormattedAlert } from '@/types/formatted/alert'
import { AlertSingle } from '@/templates/components/alertSingle'
import { AlertSingle as FormattedAlertSingle } from '@/types/formatted/alert'
import { AudienceTopics } from '@/templates/components/audienceTopics'
import { AudienceTopics as FormattedAudienceTopics } from '@/types/formatted/audienceTopics'
import { Button } from '@/templates/common/button'
import { Button as FormattedButton } from '@/types/formatted/button'
import {
  CollapsiblePanel,
  CollapsiblePanelItem,
} from '@/templates/components/collapsiblePanel'
import {
  CollapsiblePanel as FormattedCollapsiblePanel,
  CollapsiblePanelItem as FormattedCollapsiblePanelItem,
} from '@/types/formatted/collapsiblePanel'
import { ContactInfo, EmailContact } from '@/templates/components/contactInfo'
import {
  ContactInfo as FormattedContactInfo,
  EmailContact as FormattedEmailContact,
} from '@/types/formatted/contactInfo'
import { ExpandableText } from '@/templates/components/expandableText'
import { ExpandableText as FormattedExpandableText } from '@/types/formatted/expandableText'
import { FeaturedContent } from '@/templates/common/featuredContent'
import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'
import { LinkTeaser } from '@/templates/components/linkTeaser'
import { LinkTeaser as FormattedLinkTeaser } from '@/types/formatted/linkTeaser'
import { NumberCallout } from '@/templates/components/numberCallout'
import { NumberCallout as FormattedNumberCallout } from '@/types/formatted/numberCallout'
import { PhoneContact } from '@/templates/components/contactInfo'
import { QaSection } from '@/templates/components/qaSection'
import { QaSection as FormattedQaSection } from '@/types/formatted/qaSection'
import { QaGroup as FormattedQaGroup } from '@/types/formatted/qaGroup'
import { PhoneContact as FormattedPhoneContact } from '@/types/formatted/contactInfo'
import { ReactWidget } from '@/templates/components/reactWidget'
import { ReactWidget as FormattedReactWidget } from '@/types/formatted/reactWidget'
import { Table } from '@/templates/components/table'
import { Table as FormattedTable } from '@/types/formatted/table'
import { Wysiwyg } from '@/templates/components/wysiwyg'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'

export const Paragraph = (paragraph: FormattedParagraph) => {
  switch (paragraph.type) {
    case PARAGRAPH_RESOURCE_TYPES.ACCORDION_ITEM:
      return <AccordionItem {...(paragraph as FormattedAccordionItem)} />

    case PARAGRAPH_RESOURCE_TYPES.ALERT:
      return <Alert {...(paragraph as FormattedAlert)} />

    case PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE:
      return <AlertSingle {...(paragraph as FormattedAlertSingle)} />

    case PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS:
      return <AudienceTopics {...(paragraph as FormattedAudienceTopics)} />

    case PARAGRAPH_RESOURCE_TYPES.BUTTON:
      return <Button {...(paragraph as FormattedButton)} />

    case PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL:
      return <CollapsiblePanel {...(paragraph as FormattedCollapsiblePanel)} />

    case PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL_ITEM:
      return (
        <CollapsiblePanelItem
          {...(paragraph as FormattedCollapsiblePanelItem)}
        />
      )

    case PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION:
      return <ContactInfo {...(paragraph as FormattedContactInfo)} />

    case PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT:
      return <EmailContact {...(paragraph as FormattedEmailContact)} />

    case PARAGRAPH_RESOURCE_TYPES.EXPANDABLE_TEXT:
      return <ExpandableText {...(paragraph as FormattedExpandableText)} />

    case PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT:
      return <FeaturedContent {...(paragraph as FormattedFeaturedContent)} />

    case PARAGRAPH_RESOURCE_TYPES.LINK_TEASER:
      return <LinkTeaser {...(paragraph as FormattedLinkTeaser)} />

    case PARAGRAPH_RESOURCE_TYPES.NUMBER_CALLOUT:
      return <NumberCallout {...(paragraph as FormattedNumberCallout)} />

    case PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT:
      return <PhoneContact {...(paragraph as FormattedPhoneContact)} />

    case PARAGRAPH_RESOURCE_TYPES.REACT_WIDGET:
      return <ReactWidget {...(paragraph as FormattedReactWidget)} />

    case PARAGRAPH_RESOURCE_TYPES.TABLE:
      return <Table {...(paragraph as FormattedTable)} />

    case PARAGRAPH_RESOURCE_TYPES.QA_GROUP:
      return <QaSection {...(paragraph as FormattedQaGroup)} />

    case PARAGRAPH_RESOURCE_TYPES.QA_SECTION:
      return <QaSection {...(paragraph as FormattedQaSection)} />

    case PARAGRAPH_RESOURCE_TYPES.WYSIWYG:
    case PARAGRAPH_RESOURCE_TYPES.RICH_TEXT_CHAR_LIMIT_1000:
      return <Wysiwyg {...(paragraph as FormattedWysiwyg)} />

    default:
      return null
  }
}
