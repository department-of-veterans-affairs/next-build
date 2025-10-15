/**
 * @jest-environment node
 */

import { ParagraphDownloadableFile } from '@/types/drupal/paragraph'
import { formatter, params } from './query'
import mockDocument from './mock.document.json'
import mockImage from './mock.image.json'
import mockVideo from './mock.video.json'

describe('downloadableFile query', () => {
  describe('params', () => {
    test('includes required media fields', () => {
      const queryParams = params()
      const queryString = decodeURIComponent(queryParams.getQueryString())
      expect(queryString).toContain(
        'include=field_media,field_media.field_document,field_media.image'
      )
    })
  })

  describe('formatter', () => {
    test('formats document media correctly', () => {
      // The expectation of Drupal internal ids being strings messes up the type checking
      const mockData = mockDocument as unknown as ParagraphDownloadableFile
      const result = formatter(mockData)

      expect(result).toEqual({
        id: '8aa653ac-3389-403c-9912-e17388d0866c',
        entityId: 133031,
        title:
          'Learn more about the continuum of mental health and recovery services we offer and where care is available with this brochure',
        type: 'paragraph--downloadable_file',
        mediaType: 'document',
        url: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/2023-06/STX%20VA%20MH%20service%20overview%2006%2021%202023.pdf',
        extension: 'PDF',
      })
    })

    test('formats image media correctly', () => {
      // The expectation of Drupal internal ids being strings messes up the type checking
      const mockData = mockImage as unknown as ParagraphDownloadableFile
      const result = formatter(mockData)

      expect(result).toEqual({
        id: 'b6c225c4-ab04-4426-8d72-3811e8c8a5ad',
        entityId: 61724,
        title: 'Northport campus map',
        type: 'paragraph--downloadable_file',
        mediaType: 'image',
        url: 'https://dsva-vagov-staging-cms-files.s3.us-gov-west-1.amazonaws.com/2024-04/VA%20Northport%20Campus%20Map.png',
        extension: 'PNG',
      })
    })

    test('formats video media correctly', () => {
      // The expectation of Drupal internal ids being strings messes up the type checking
      const mockData = mockVideo as unknown as ParagraphDownloadableFile
      const result = formatter(mockData)

      expect(result).toEqual({
        id: '47b72d66-1c84-45b3-8752-14c5ff6ebe37',
        entityId: 133493,
        title:
          'What to expect when seeking emergency mental health care at South Texas Veterans Health Care System',
        type: 'paragraph--downloadable_file',
        mediaType: 'video',
        url: 'https://www.youtube.com/watch?v=VRndki6r_KM',
        extension: null,
      })
    })

    describe('edge cases', () => {
      test('handles missing field_media', () => {
        const mockData = {
          ...mockDocument,
          field_media: null,
        } as unknown as ParagraphDownloadableFile

        expect(formatter(mockData)).toBeNull()
      })

      test('handles missing field_title', () => {
        const mockData = {
          ...mockDocument,
          field_title: null,
        } as unknown as ParagraphDownloadableFile

        const result = formatter(mockData)
        expect(result.title).toBeNull()
      })

      test('handles missing drupal_internal__id', () => {
        const mockData = {
          ...mockDocument,
          drupal_internal__id: undefined,
        } as unknown as ParagraphDownloadableFile

        const result = formatter(mockData)
        expect(result.entityId).toBeNull()
      })
    })
  })
})
