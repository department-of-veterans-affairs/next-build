import { FormattedParagraph } from '@/lib/drupal/queries'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { AccordionItem } from '@/components/accordion/template'
import { AccordionItem as FormattedAccordionItem } from '@/components/accordion/formatted-type'
import { Alert } from '@/components/alert/template'
import { Alert as FormattedAlert } from '@/components/alert/formatted-type'
import { AlertSingle } from '@/components/alertSingle/template'
import { AlertSingle as FormattedAlertSingle } from '@/components/alert/formatted-type'
import { AudienceTopics } from '@/components/audienceTopics/template'
import { AudienceTopics as FormattedAudienceTopics } from '@/components/audienceTopics/formatted-type'
import { Button } from '@/components/button/template'
import { Button as FormattedButton } from '@/components/button/formatted-type'
import {
  CollapsiblePanel,
  CollapsiblePanelItem,
} from '@/components/collapsiblePanel/template'
import {
  CollapsiblePanel as FormattedCollapsiblePanel,
  CollapsiblePanelItem as FormattedCollapsiblePanelItem,
} from '@/components/collapsiblePanel/formatted-type'
import { ContactInfo, EmailContact } from '@/components/contactInfo/template'
import {
  ContactInfo as FormattedContactInfo,
  EmailContact as FormattedEmailContact,
} from '@/components/contactInfo/formatted-type'
import { ExpandableText } from '@/components/expandableText/template'
import { ExpandableText as FormattedExpandableText } from '@/components/expandableText/formatted-type'
import { FeaturedContent } from '@/components/featuredContent/template'
import { FeaturedContent as FormattedFeaturedContent } from '@/components/featuredContent/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/template'
import { LinkTeaser as FormattedLinkTeaser } from '@/components/linkTeaser/formatted-type'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'
import { ListOfLinkTeasers as FormattedListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { NumberCallout } from '@/components/numberCallout/template'
import { NumberCallout as FormattedNumberCallout } from '@/components/numberCallout/formatted-type'
import { PhoneContact } from '@/components/contactInfo/template'
import { QaSection } from '@/components/qaSection/template'
import { QaSection as FormattedQaSection } from '@/components/qaSection/formatted-type'
import { QaGroup as FormattedQaGroup } from '@/components/qaGroup/formatted-type'
import { PhoneContact as FormattedPhoneContact } from '@/components/contactInfo/formatted-type'
import { ProcessList } from '@/components/processList/template'
import { ProcessList as FormattedProcessList } from '@/components/processList/formatted-type'
import { ReactWidget } from '@/components/reactWidget/template'
import { ReactWidget as FormattedReactWidget } from '@/components/reactWidget/formatted-type'
import { Table } from '@/components/table/template'
import { Table as FormattedTable } from '@/components/table/formatted-type'
import { Wysiwyg } from '@/components/wysiwyg/template'
import { Wysiwyg as FormattedWysiwyg } from '@/components/wysiwyg/formatted-type'

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

    case PARAGRAPH_RESOURCE_TYPES.LIST_OF_LINK_TEASERS:
      return (
        <ListOfLinkTeasers {...(paragraph as FormattedListOfLinkTeasers)} />
      )

    case PARAGRAPH_RESOURCE_TYPES.NUMBER_CALLOUT:
      return <NumberCallout {...(paragraph as FormattedNumberCallout)} />

    case PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT:
      return <PhoneContact {...(paragraph as FormattedPhoneContact)} />

    case PARAGRAPH_RESOURCE_TYPES.PROCESS_LIST:
      return <ProcessList {...(paragraph as FormattedProcessList)} />

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
