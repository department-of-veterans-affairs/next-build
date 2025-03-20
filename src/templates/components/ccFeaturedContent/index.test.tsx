import { FeaturedContent as FormattedFeatureContent } from '@/types/formatted/featuredContent'
import { CCFeaturedContent } from './index'
import { render, screen } from '@testing-library/react'
import { FeaturedContent } from '@/templates/common/featuredContent'
jest.mock('@/lib/analytics/recordEvent')
let featuredContentData: FormattedFeatureContent
let baseId: string
describe('FeaturedContent with valid data', () => {
  beforeEach(() => {
    // reset data
    featuredContentData = {
      id: 'some id',
      title: 'some title',
      type: 'paragraph--featured_content',
      description: '<p>description</p>',
      link: {
        id: '123',
        url: 'https://www.va.gov',
        label: 'Learn more',
      },
    }
    baseId = 'some-title'
  })
  it('should render the <CCFeaturedContent> with valid data', () => {
    render(<CCFeaturedContent featuredContent={featuredContentData} />)
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByTestId('123')).toBeInTheDocument()
  })
  it('should render the <CCFeaturedContent> with a class on the va-summary-box', () => {
    render(
      <CCFeaturedContent
        featuredContent={featuredContentData}
        className="vads-u-margin-bottom--3"
      />
    )
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByTestId('123')).toBeInTheDocument()
    expect(
      screen.getByTestId(`featured-content-${baseId}-headline`)
    ).toBeTruthy()
    expect(screen.getByTestId(`featured-content-${baseId}`)).toHaveClass(
      'vads-u-margin-bottom--3'
    )
  })
  it('should not render the link if there is no link data', () => {
    delete featuredContentData.link
    render(<CCFeaturedContent featuredContent={featuredContentData} />)
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.queryByTestId('123')).toBeFalsy()
  })
  it('should not render the link if there is no label for the link', () => {
    delete featuredContentData.link.label
    render(<CCFeaturedContent featuredContent={featuredContentData} />)
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.queryByTestId('123')).toBeFalsy()
  })
  it('should not render the link if there is no url for the link', () => {
    delete featuredContentData.link.url
    render(<CCFeaturedContent featuredContent={featuredContentData} />)
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.queryByTestId('123')).toBeFalsy()
  })
})
