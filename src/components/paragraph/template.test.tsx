import { render } from '@testing-library/react'
import { Paragraph } from '@/components/paragraph/template'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { FormattedParagraph } from '@/lib/drupal/queries'

// Define the paragraph types we're testing - testid matches the type prop
const PARAGRAPH_TEST_CASES = [
  PARAGRAPH_RESOURCE_TYPES.ACCORDION_ITEM,
  PARAGRAPH_RESOURCE_TYPES.ALERT,
  PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE,
  PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS,
  PARAGRAPH_RESOURCE_TYPES.BUTTON,
  PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL,
  PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL_ITEM,
  PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION,
  PARAGRAPH_RESOURCE_TYPES.DOWNLOADABLE_FILE,
  PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT,
  PARAGRAPH_RESOURCE_TYPES.EXPANDABLE_TEXT,
  PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT,
  PARAGRAPH_RESOURCE_TYPES.LINK_TEASER,
  PARAGRAPH_RESOURCE_TYPES.LIST_OF_LINK_TEASERS,
  PARAGRAPH_RESOURCE_TYPES.MEDIA,
  PARAGRAPH_RESOURCE_TYPES.NUMBER_CALLOUT,
  PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT,
  PARAGRAPH_RESOURCE_TYPES.PROCESS_LIST,
  PARAGRAPH_RESOURCE_TYPES.REACT_WIDGET,
  PARAGRAPH_RESOURCE_TYPES.SPANISH_TRANSLATION_SUMMARY,
  PARAGRAPH_RESOURCE_TYPES.STAFF_PROFILE,
  PARAGRAPH_RESOURCE_TYPES.TABLE,
  PARAGRAPH_RESOURCE_TYPES.QA,
  PARAGRAPH_RESOURCE_TYPES.QA_GROUP,
  PARAGRAPH_RESOURCE_TYPES.QA_SECTION,
  PARAGRAPH_RESOURCE_TYPES.WYSIWYG,
  PARAGRAPH_RESOURCE_TYPES.RICH_TEXT_CHAR_LIMIT_1000,
]

const mockDiv = (testId: string) => <div data-testid={testId}>{testId}</div>

jest.mock('@/components/accordion/template', () => ({
  AccordionItem: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.ACCORDION_ITEM)
  ),
}))

jest.mock('@/components/alert/template', () => ({
  Alert: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.ALERT)),
}))

jest.mock('@/components/alertSingle/template', () => ({
  AlertSingle: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.ALERT_SINGLE)),
}))

jest.mock('@/components/audienceTopics/template', () => ({
  AudienceTopics: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.AUDIENCE_TOPICS)
  ),
}))

jest.mock('@/components/button/template', () => ({
  Button: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.BUTTON)),
}))

jest.mock('@/components/collapsiblePanel/template', () => ({
  CollapsiblePanel: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL)
  ),
  CollapsiblePanelItem: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.COLLAPSIBLE_PANEL_ITEM)
  ),
}))

jest.mock('@/components/contactInfo/template', () => ({
  ContactInfo: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.CONTACT_INFORMATION)
  ),
  EmailContact: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT)),
  PhoneContact: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT)),
}))

jest.mock('@/components/downloadableFile/template', () => ({
  DownloadableFile: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.DOWNLOADABLE_FILE)
  ),
}))

jest.mock('@/components/expandableText/template', () => ({
  ExpandableText: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.EXPANDABLE_TEXT)
  ),
}))

jest.mock('@/components/featuredContent/template', () => ({
  FeaturedContent: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.FEATURED_CONTENT)
  ),
}))

jest.mock('@/components/linkTeaser/template', () => ({
  LinkTeaser: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.LINK_TEASER)),
}))

jest.mock('@/components/listOfLinkTeasers/template', () => ({
  ListOfLinkTeasers: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.LIST_OF_LINK_TEASERS)
  ),
}))

jest.mock('@/components/media/template', () => ({
  Media: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.MEDIA)),
}))

jest.mock('@/components/numberCallout/template', () => ({
  NumberCallout: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.NUMBER_CALLOUT)
  ),
}))

jest.mock('@/components/processList/template', () => ({
  ProcessList: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.PROCESS_LIST)),
}))

jest.mock('@/components/reactWidget/template', () => ({
  ReactWidget: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.REACT_WIDGET)),
}))

jest.mock('@/components/spanishTranslationSummary/template', () => ({
  SpanishTranslationSummary: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.SPANISH_TRANSLATION_SUMMARY)
  ),
}))

jest.mock('@/components/staffProfileParagraph/template', () => ({
  StaffProfileParagraph: jest.fn(() =>
    mockDiv(PARAGRAPH_RESOURCE_TYPES.STAFF_PROFILE)
  ),
}))

jest.mock('@/components/table/template', () => ({
  Table: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.TABLE)),
}))

jest.mock('@/components/qaParagraph/template', () => ({
  QaParagraph: jest.fn(() => mockDiv(PARAGRAPH_RESOURCE_TYPES.QA)),
}))

jest.mock('@/components/qaSection/template', () => ({
  QaSection: jest.fn(() => (
    // To simplify the test code, just print two of these since either one of these
    // paragraph types will render a QaSection component
    <>
      {mockDiv(PARAGRAPH_RESOURCE_TYPES.QA_SECTION)}
      {mockDiv(PARAGRAPH_RESOURCE_TYPES.QA_GROUP)}
    </>
  )),
}))

jest.mock('@/components/wysiwyg/template', () => ({
  Wysiwyg: jest.fn(() => (
    // To simplify the test code, just print two of these since either one of these
    // paragraph types will render a Wysiwyg component
    <>
      {mockDiv(PARAGRAPH_RESOURCE_TYPES.WYSIWYG)}
      {mockDiv(PARAGRAPH_RESOURCE_TYPES.RICH_TEXT_CHAR_LIMIT_1000)}
    </>
  )),
}))

describe('Paragraph Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.each(PARAGRAPH_TEST_CASES)('renders correct component for %s', (type) => {
    const props = {
      type,
      id: 'test-id',
    } as unknown as FormattedParagraph

    const { getByTestId } = render(<Paragraph {...props} />)
    expect(getByTestId(type)).toBeInTheDocument()
  })

  it('renders null for unknown type', () => {
    const props = {
      type: 'paragraph--unknown-type',
      id: 'test-id',
    } as unknown as FormattedParagraph

    const { container } = render(<Paragraph {...props} />)
    expect(container.firstChild).toBeNull()
  })
})
