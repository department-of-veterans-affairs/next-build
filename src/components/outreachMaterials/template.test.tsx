import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import { OutreachMaterials } from './template'
import type { OutreachMaterials as OutreachMaterialsProps } from './formatted-type'
import { MediaResourceType } from '@/types/drupal/media'

const mockProps: OutreachMaterialsProps = {
  id: 'outreach-materials-1',
  type: 'node--outreach_materials',
  published: true,
  title: 'Public outreach materials',
  introText: 'Download materials to help spread the word.',
  lastUpdated: '2020-03-11T20:37:01+00:00',
  topics: [
    { topicId: 'benefits-001', name: 'Benefits' },
    { topicId: 'health-001', name: 'Health Care' },
    { topicId: 'education-001', name: 'Education' },
  ],
  outreachAssets: [
    {
      id: 'asset-1',
      title: 'VA Benefits Brochure',
      description: 'A comprehensive guide to VA benefits',
      format: 'document',
      categories: ['benefits-001', 'health-001'],
      media: {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/brochure.pdf',
        documentFilesize: 1024000,
      },
    },
    {
      id: 'asset-2',
      title: 'VA Health Care Poster',
      description: 'Poster promoting VA health care services',
      format: 'document',
      categories: ['health-001'],
      media: {
        type: MediaResourceType.Document,
        documentUrl: 'https://example.com/poster.pdf',
        documentFilesize: 512000,
      },
    },
    {
      id: 'asset-3',
      title: 'VA Services Video',
      description: 'Video overview of VA services',
      format: 'video',
      categories: ['benefits-001', 'education-001'],
      media: {
        type: MediaResourceType.Video,
        videoEmbedUrl: 'https://www.youtube.com/embed/example123',
        videoThumbnailUrl: 'https://example.com/thumb.jpg',
      },
    },
  ],
}

describe('OutreachMaterials', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders title and intro text', async () => {
    const { container } = render(<OutreachMaterials {...mockProps} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Public outreach materials'
    )
    expect(
      screen.getByText('Download materials to help spread the word.')
    ).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('does not render intro text when null', () => {
    render(<OutreachMaterials {...mockProps} introText={null} />)

    expect(
      screen.queryByText('Download materials to help spread the word.')
    ).not.toBeInTheDocument()
    expect(
      document.getElementById('office-benefits-description')
    ).not.toBeInTheDocument()
  })

  test('renders filter form with topic and type selects', () => {
    render(<OutreachMaterials {...mockProps} />)

    expect(screen.getByLabelText('Select a topic')).toBeInTheDocument()
    expect(screen.getByLabelText('Select file type')).toBeInTheDocument()
  })

  test('renders asset cards for filtered results', () => {
    render(<OutreachMaterials {...mockProps} />)

    expect(screen.getByText('VA Benefits Brochure')).toBeInTheDocument()
    expect(screen.getByText('VA Health Care Poster')).toBeInTheDocument()
    expect(screen.getByText('VA Services Video')).toBeInTheDocument()
  })

  test('filters assets by topic when topic is selected', async () => {
    const user = userEvent.setup()
    render(<OutreachMaterials {...mockProps} />)

    const topicSelect = screen.getByLabelText('Select a topic')
    await user.selectOptions(topicSelect, 'health-001')

    expect(screen.getByText('VA Benefits Brochure')).toBeInTheDocument()
    expect(screen.getByText('VA Health Care Poster')).toBeInTheDocument()
    expect(screen.queryByText('VA Services Video')).not.toBeInTheDocument()
  })

  test('filters assets by type when type is selected', async () => {
    const user = userEvent.setup()
    render(<OutreachMaterials {...mockProps} />)

    const typeSelect = screen.getByLabelText('Select file type')
    await user.selectOptions(typeSelect, 'video')

    expect(screen.getByText('VA Services Video')).toBeInTheDocument()
    expect(screen.queryByText('VA Benefits Brochure')).not.toBeInTheDocument()
    expect(screen.queryByText('VA Health Care Poster')).not.toBeInTheDocument()
  })

  test('shows no-results message when filters match nothing', async () => {
    const user = userEvent.setup()
    render(<OutreachMaterials {...mockProps} />)

    await user.selectOptions(
      screen.getByLabelText('Select a topic'),
      'education-001'
    )
    await user.selectOptions(
      screen.getByLabelText('Select file type'),
      'document'
    )

    expect(
      screen.getByText('Select a different topic or file type')
    ).toBeInTheDocument()
    expect(screen.queryByText('VA Benefits Brochure')).not.toBeInTheDocument()
  })

  test('shows pagination when more than 10 assets', () => {
    const manyAssets = Array.from({ length: 15 }, (_, i) => ({
      id: `asset-${i}`,
      title: `Asset ${i + 1}`,
      description: `Description ${i + 1}`,
      format: 'document' as const,
      categories: ['benefits-001'],
      media: {
        type: MediaResourceType.Document as const,
        documentUrl: `https://example.com/doc-${i}.pdf`,
        documentFilesize: 1024,
      },
    }))
    render(<OutreachMaterials {...mockProps} outreachAssets={manyAssets} />)

    expect(document.getElementById('va-pager-div')).toBeInTheDocument()
    expect(screen.getByText('Asset 1')).toBeInTheDocument()
  })

  test('does not show pagination when 10 or fewer assets', () => {
    render(<OutreachMaterials {...mockProps} />)

    expect(document.getElementById('va-pager-div')).not.toBeInTheDocument()
  })

  test('passes lastUpdated to ContentFooter', () => {
    render(
      <OutreachMaterials
        {...mockProps}
        lastUpdated="2022-06-15T12:00:00+00:00"
      />
    )

    expect(screen.getByText('Last updated:')).toBeInTheDocument()
    expect(screen.getByText('June 15, 2022')).toBeInTheDocument()
  })
})
