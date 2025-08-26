import { render, screen } from '@testing-library/react'
import { PreviewCrumb, UnpublishedBanner } from './template'

const resource = {
  published: false,
  moderationState: 'draft',
  entityPath:
    '/oklahoma-city-health-care/stories/el-reno-high-school-continues-78-year-tradition-of-giving-gifts-to-veterans',
  entityId: '500',
}

describe('Preview renders with accurate data', () => {
  test('renders PreviewCrumb component', () => {
    render(<PreviewCrumb entityId={resource.entityId} />)

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/node/500/edit`
    )
  })

  test('UnpublishedBanner renders with draft content', () => {
    render(<UnpublishedBanner resource={resource} />)

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/node/500/edit`
    )
  })

  test('UnpublishedBanner renders with archived content', () => {
    const modResource = {
      ...resource,
      moderationState: 'archived',
    }
    render(<UnpublishedBanner resource={modResource} />)

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/node/500/edit`
    )
  })

  test('UnpublishedBanner does not render with a published revision', () => {
    const modResource = {
      ...resource,
      published: true,
    }
    render(<UnpublishedBanner resource={modResource} />)

    expect(
      screen.queryByText('You are viewing a draft revision')
    ).not.toBeInTheDocument()
  })
})
