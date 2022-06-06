import { render, screen } from '@testing-library/react'
import { fireEvent, getByRole } from '@testing-library/dom'
import * as recordEvent from '@/utils/recordEvent'
import { Paragraph } from '@/components/paragraph'
import { ParagraphLinkTeaser } from '@/types/paragraph'

describe('<LinkTeaser> component renders without field_spokes', () => {
  const MOCK_PARAGRAPH: ParagraphLinkTeaser = {
    id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
    type: 'paragraph--link_teaser',
    created: '2020-10-16T20:09:53+00:00',
    parent_id: '8475',
    parent_type: 'paragraph',
    parent_field_name: 'field_va_paragraphs',
    field_link: {
      uri: '/health-care/eligibility/',
      title: 'Health Care Benefits Eligibility',
      options: null,
    },
    field_link_summary: 'Find out if you can get VA health care benefits.',
    drupal_internal__id: 123,
    drupal_internal__revision_id: 1,
    langcode: 'en',
    status: true,
  }

  test('and click event sends correct params to recordEvent', () => {
    const { container } = render(
      <Paragraph
        paragraph={MOCK_PARAGRAPH}
        boldTitle={true}
        sectionHeader="This is the section header"
      />
    )
    const spyRecordEvent = jest.spyOn(recordEvent, 'recordEvent')
    const liEl = container.querySelector('li')

    fireEvent.click(liEl)
    expect(spyRecordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 'Health%20Care%20Benefits%20Eligibility',
      'links-list-section-header': 'This%20is%20the%20section%20header',
    })
  })

  test('and without boldTitle', () => {
    const { container } = render(
      <Paragraph
        paragraph={MOCK_PARAGRAPH}
        boldTitle={false}
        sectionHeader=""
      />
    )

    const h3El = container.getElementsByClassName(
      'va-nav-linkslist-title vads-u-font-size--h4'
    )

    expect(h3El.length).toBe(1)
    expect(
      screen.queryByText(/Health Care Benefits Eligibility/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Find out if you can get VA health care benefits./)
    ).toBeInTheDocument()
  })

  test('and with boldTitle and title', () => {
    const { container } = render(
      <Paragraph paragraph={MOCK_PARAGRAPH} boldTitle={true} sectionHeader="" />
    )
    const aEl = container.querySelector('a')

    expect(aEl).toHaveAttribute('href', '/health-care/eligibility/')
    expect(
      screen.queryByText(/Health Care Benefits Eligibility/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Find out if you can get VA health care benefits./)
    ).toBeInTheDocument()
  })

  test('and with boldTitle and without title', () => {
    MOCK_PARAGRAPH.field_link.title = ''
    const { container } = render(
      <Paragraph paragraph={MOCK_PARAGRAPH} boldTitle={true} sectionHeader="" />
    )
    const aEl = container.querySelector('a')

    expect(aEl).toHaveAttribute('href', '/health-care/eligibility/')
    expect(
      screen.queryByText(/Health Care Benefits Eligibility/)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Find out if you can get VA health care benefits./)
    ).toBeInTheDocument()
  })
})

describe('<LinkTeaser> component renders with field_spokes', () => {
  const MOCK_PARAGRAPH: ParagraphLinkTeaser = {
    id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
    type: 'paragraph--link_teaser',
    created: '2020-10-16T20:09:53+00:00',
    parent_id: '8475',
    parent_type: 'paragraph',
    parent_field_name: 'field_spokes',
    field_link: {
      uri: '/health-care/eligibility/',
      title: 'Health Care Benefits Eligibility',
      options: null,
    },
    field_link_summary: 'Find out if you can get VA health care benefits.',
    drupal_internal__id: 123,
    drupal_internal__revision_id: 1,
    langcode: 'en',
    status: true,
  }

  test('and click event sends correct params to recordEvent', () => {
    const { container } = render(
      <Paragraph
        paragraph={MOCK_PARAGRAPH}
        boldTitle={false}
        sectionHeader="This is the section header"
      />
    )
    const spyRecordEvent = jest.spyOn(recordEvent, 'recordEvent')
    const liEl = container.querySelector('li')

    fireEvent.click(liEl)
    expect(spyRecordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 'Health%20Care%20Benefits%20Eligibility',
      'links-list-section-header': 'This%20is%20the%20section%20header',
    })
  })

  test('and without boldTitle', () => {
    const { container } = render(
      <Paragraph
        paragraph={MOCK_PARAGRAPH}
        boldTitle={false}
        sectionHeader=""
      />
    )
    const aEl = container.querySelector('a')
    const spanEl = container.querySelector('span')
    const imageEl = container.querySelector('img')

    expect(aEl).toHaveAttribute('href', '/health-care/eligibility/')
    expect(spanEl).toHaveAttribute('class', 'hub-page-link-list__header')
    expect(imageEl).toHaveAttribute(
      'src',
      'data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2715%27%20height=%2715%27/%3e'
    )
    expect(
      screen.queryByText(/Health Care Benefits Eligibility/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Find out if you can get VA health care benefits./)
    ).toBeInTheDocument()
  })

  test('and with boldTitle', () => {
    const { container } = render(
      <Paragraph paragraph={MOCK_PARAGRAPH} boldTitle={true} sectionHeader="" />
    )
    const aEl = container.querySelector('a')
    const spanEl = container.querySelector('span')
    const imageEl = container.querySelector('img')

    expect(aEl).toHaveAttribute('href', '/health-care/eligibility/')
    expect(spanEl).toHaveAttribute('class', 'hub-page-link-list__header')
    expect(imageEl).toHaveAttribute(
      'src',
      'data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2715%27%20height=%2715%27/%3e'
    )
    expect(
      screen.queryByText(/Health Care Benefits Eligibility/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Find out if you can get VA health care benefits./)
    ).toBeInTheDocument()
  })

  test('and without boldTitle and without title', () => {
    MOCK_PARAGRAPH.field_link.title = ''
    const { container } = render(
      <Paragraph
        paragraph={MOCK_PARAGRAPH}
        boldTitle={false}
        sectionHeader=""
      />
    )
    const aEl = container.querySelector('a')
    const spanEl = container.querySelector('span')
    const imageEl = container.querySelector('img')

    expect(aEl).toHaveAttribute('href', '/health-care/eligibility/')
    expect(spanEl).not.toBeInTheDocument()
    expect(imageEl).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Health Care Benefits Eligibility/)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Find out if you can get VA health care benefits./)
    ).toBeInTheDocument()
  })
})

describe('LinkTeaser with invalid data', () => {
  test('does not render <LinkTeaser> component when uri is not present', () => {
    const MOCK_PARAGRAPH: ParagraphLinkTeaser = {
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      type: 'paragraph--link_teaser',
      field_link_summary: 'Find out if you can get VA health care benefits.',
      field_link: {
        uri: null,
        title: 'Health Care Benefits Eligibility',
        options: null,
      },
      drupal_internal__id: 123,
      drupal_internal__revision_id: 1,
      langcode: 'en',
      status: true,
    }
    const { container } = render(
      <Paragraph
        paragraph={MOCK_PARAGRAPH}
        boldTitle={false}
        sectionHeader=""
      />
    )
    const liEl = container.querySelector('li')

    expect(liEl).not.toBeInTheDocument()
  })
})
