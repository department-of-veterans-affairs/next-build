import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
jest.mock('@/lib/utils/recordEvent')
import * as recordEvent from '@/lib/utils/recordEvent'
import { LinkTeaser } from './index'
import { LinkTeaserType } from '@/types/index'

describe('<LinkTeaser> component renders without field_spokes', () => {
  const LinkTeaserCollectionProps: LinkTeaserType = {
    id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
    uri: '/health-care/eligibility/',
    title: 'Health Care Benefits Eligibility',
    options: null,
    summary:
      'Not sure if you qualify? Find out if you can get VA health care benefits.',
    parentField: 'field_va_paragraphs',
    componentParams: {
      boldTitle: false,
      sectionHeader: '',
    },
  }

  let linkTeaserParams = {
    boldTitle: false,
    sectionHeader: 'This is the section header',
  }

  test('and click event sends correct params to recordEvent', () => {
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
      />
    )
    const liEl = container.querySelector('li')

    fireEvent.click(liEl)
    expect(recordEvent.recordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 'Health%20Care%20Benefits%20Eligibility',
      'links-list-section-header': 'This%20is%20the%20section%20header',
    })
  })

  test('and without boldTitle', () => {
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
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
    linkTeaserParams = {
      boldTitle: true,
      sectionHeader: 'Health Care Benefits Eligibility',
    }
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
      />
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
    LinkTeaserCollectionProps.title = ''
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
      />
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
  const LinkTeaserCollectionProps: LinkTeaserType = {
    id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
    uri: '/health-care/eligibility/',
    title: 'Health Care Benefits Eligibility',
    options: null,
    summary:
      'Not sure if you qualify? Find out if you can get VA health care benefits.',
    parentField: 'field_spokes',
    componentParams: {
      boldTitle: false,
      sectionHeader: '',
    },
  }
  let linkTeaserParams = { boldTitle: false, sectionHeader: '' }

  test('and click event sends correct params to recordEvent', () => {
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
      />
    )
    const liEl = container.querySelector('li')
    fireEvent.click(liEl)
    expect(recordEvent.recordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 'Health%20Care%20Benefits%20Eligibility',
      'links-list-section-header': 'This%20is%20the%20section%20header',
    })
  })

  test('and without boldTitle', () => {
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
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
    linkTeaserParams = { boldTitle: true, sectionHeader: '' }

    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
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

  test('and without boldTitle and without title', () => {
    LinkTeaserCollectionProps.title = ''
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
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
  jest.restoreAllMocks()
})

describe('LinkTeaser with invalid data', () => {
  test('does render <LinkTeaser> component when uri is not present', () => {
    const LinkTeaserCollectionProps: LinkTeaserType = {
      id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
      uri: '/health-care/eligibility/',
      title: 'Health Care Benefits Eligibility',
      options: null,
      summary:
        'Not sure if you qualify? Find out if you can get VA health care benefits.',
      parentField: 'field_va_paragraphs',
      componentParams: {
        boldTitle: false,
        sectionHeader: '',
      },
    }
    const linkTeaserParams = { boldTitle: false, sectionHeader: '' }
    LinkTeaserCollectionProps.uri = null
    const { container } = render(
      <LinkTeaser
        {...LinkTeaserCollectionProps}
        componentParams={linkTeaserParams}
      />
    )
    const liEl = container.querySelector('li')
    expect(liEl).toBeInTheDocument()
  })
})
