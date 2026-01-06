import {
  getTopicImagePath,
  formatFileSize,
  getFileExtension,
  getYouTubeThumbnail,
  truncateWithEllipsis,
} from './utils'

describe('getTopicImagePath', () => {
  test('should return correct path for known topic IDs', () => {
    expect(getTopicImagePath('general')).toBe(
      'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/hub-illustrations/records.png'
    )
    expect(getTopicImagePath('burials')).toBe(
      'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/hub-illustrations/burials.png'
    )
    expect(getTopicImagePath('healthcare')).toBe(
      'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/hub-illustrations/health-care.png'
    )
  })

  test('should return default records.png for unknown topic ID', () => {
    expect(getTopicImagePath('unknown')).toBe(
      'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/hub-illustrations/records.png'
    )
  })

  test('should return default records.png for undefined topic ID', () => {
    expect(getTopicImagePath(undefined)).toBe(
      'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/hub-illustrations/records.png'
    )
  })
})

describe('formatFileSize', () => {
  test('should return empty string for zero bytes', () => {
    expect(formatFileSize(0)).toBe('')
  })

  test('should format bytes less than 10000 as KB', () => {
    expect(formatFileSize(1000)).toBe('1.00KB')
    expect(formatFileSize(9999)).toBe('10.00KB')
  })

  test('should format bytes 10000 or greater as MB', () => {
    expect(formatFileSize(10000)).toBe('0.01MB')
    expect(formatFileSize(1000000)).toBe('1.00MB')
    expect(formatFileSize(2500000)).toBe('2.50MB')
  })

  test('should return empty string for undefined', () => {
    expect(formatFileSize(undefined)).toBe('')
  })
})

describe('getFileExtension', () => {
  test('should extract file extension in uppercase', () => {
    expect(getFileExtension('document.pdf')).toBe('PDF')
    expect(getFileExtension('image.jpg')).toBe('JPG')
    expect(getFileExtension('file.docx')).toBe('DOCX')
  })

  test('should handle URLs with extensions', () => {
    expect(getFileExtension('https://example.com/file.pdf')).toBe('PDF')
    expect(getFileExtension('https://example.com/path/to/image.png')).toBe(
      'PNG'
    )
  })

  test('should return empty string for files without extension', () => {
    expect(getFileExtension('filename')).toBe('')
    expect(getFileExtension('path/to/file')).toBe('')
  })

  test('should return empty string for null or undefined', () => {
    expect(getFileExtension(null)).toBe('')
    expect(getFileExtension(undefined)).toBe('')
  })
})

describe('getYouTubeThumbnail', () => {
  describe('query parameter formats (?v= or &v=)', () => {
    test('should extract video ID from standard watch URL with ?v=', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from URL with &v= (not first param)', () => {
      const url =
        'https://www.youtube.com/watch?list=PLxxx&v=dQw4w9WgXcQ&index=1'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from URL with multiple query params', () => {
      const url = 'https://www.youtube.com/watch?v=abc123&t=30s&feature=share'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe('https://img.youtube.com/vi/abc123/sddefault.jpg')
    })

    test('should extract video ID from URL without protocol', () => {
      const url = 'www.youtube.com/watch?v=dQw4w9WgXcQ'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from URL with http protocol', () => {
      const url = 'http://youtube.com/watch?v=dQw4w9WgXcQ'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })
  })

  describe('pathname formats (embed, v, youtu.be)', () => {
    test('should extract video ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from /v/ URL', () => {
      const url = 'https://www.youtube.com/v/dQw4w9WgXcQ'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from youtu.be short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from youtu.be URL with query params', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ?t=30'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from embed URL with query params', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg'
      )
    })

    test('should extract video ID from mobile youtu.be URL', () => {
      const url = 'http://youtu.be/abc123def456'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/abc123def456/sddefault.jpg'
      )
    })
  })

  describe('edge cases and invalid inputs', () => {
    test('should return null for null input', () => {
      expect(getYouTubeThumbnail(null)).toBeNull()
    })

    test('should return null for undefined input', () => {
      expect(getYouTubeThumbnail(undefined)).toBeNull()
    })

    test('should return null for empty string', () => {
      expect(getYouTubeThumbnail('')).toBeNull()
    })

    test('should return null for non-YouTube URL', () => {
      expect(getYouTubeThumbnail('https://example.com/video')).toBeNull()
      expect(getYouTubeThumbnail('https://vimeo.com/123456')).toBeNull()
    })

    test('should return null for YouTube URL without video ID', () => {
      expect(getYouTubeThumbnail('https://www.youtube.com/')).toBeNull()
      expect(getYouTubeThumbnail('https://www.youtube.com/watch')).toBeNull()
      expect(getYouTubeThumbnail('https://youtu.be/')).toBeNull()
    })

    test('should return null for malformed YouTube URL', () => {
      expect(getYouTubeThumbnail('youtube.com')).toBeNull()
      expect(getYouTubeThumbnail('not a url')).toBeNull()
    })

    test('should handle video IDs with special characters', () => {
      const url = 'https://www.youtube.com/watch?v=abc-def_123'
      const result = getYouTubeThumbnail(url)
      expect(result).toBe(
        'https://img.youtube.com/vi/abc-def_123/sddefault.jpg'
      )
    })
  })
})

describe('truncateWithEllipsis', () => {
  test('should truncate string longer than specified length', () => {
    expect(truncateWithEllipsis('Hello World', 5)).toBe('Hello...')
    expect(truncateWithEllipsis('This is a long string', 10)).toBe(
      'This is a ...'
    )
  })

  test('should not truncate string shorter than or equal to specified length', () => {
    expect(truncateWithEllipsis('Hello', 5)).toBe('Hello')
    expect(truncateWithEllipsis('Hi', 10)).toBe('Hi')
  })

  test('should handle empty string', () => {
    expect(truncateWithEllipsis('', 5)).toBe('')
  })

  test('should handle zero length', () => {
    expect(truncateWithEllipsis('Hello', 0)).toBe('...')
  })

  test('should handle negative length', () => {
    expect(truncateWithEllipsis('Hello', -5)).toBe('...')
  })
})
