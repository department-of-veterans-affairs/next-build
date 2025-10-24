import { formatter, params } from './query'
import { ParagraphMedia } from '@/types/drupal/paragraph'
import mockData from './mock.json'

describe('Media formatter', () => {
  it('should format valid media data correctly', () => {
    const result = formatter(mockData as unknown as ParagraphMedia)

    expect(result).toEqual({
      type: 'paragraph--media',
      id: 'bc5d91c0-ae80-4b24-a942-e2c3688bbe8d',
      entityId: 183009,
      image: {
        url: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/2025-10/my-image.png',
        alt: 'Rating sandwiches',
        title: '',
      },
      allowClicksOnThisImage: true,
    })
  })

  it('should return null when field_media is missing', () => {
    const entity = {
      type: 'paragraph--media',
      id: 'test-id',
      drupal_internal__id: 123,
      field_allow_clicks_on_this_image: false,
    } as unknown as ParagraphMedia

    const result = formatter(entity)
    expect(result).toBeNull()
  })

  it('should return null when field_media.image is missing', () => {
    const entity = {
      type: 'paragraph--media',
      id: 'test-id',
      drupal_internal__id: 123,
      field_media: {
        type: 'media--image',
        id: 'media-id',
      },
      field_allow_clicks_on_this_image: false,
    } as unknown as ParagraphMedia

    const result = formatter(entity)
    expect(result).toBeNull()
  })

  it('should handle false allowClicksOnThisImage', () => {
    const entity = {
      ...mockData,
      field_allow_clicks_on_this_image: false,
    } as unknown as ParagraphMedia

    const result = formatter(entity)

    expect(result?.allowClicksOnThisImage).toBe(false)
  })
})
