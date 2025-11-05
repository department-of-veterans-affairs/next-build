import {
  normalizeEmbeddedVideoUrl,
  normalizeEmbeddedYoutubeUrl,
} from './embeddedMediaVideoUrls'

describe('normalizeEmbeddedVideoUrl', () => {
  test('returns null if passed null or undefined url', () => {
    const normalizers = [
      jest.fn((): false => false),
      jest.fn((): false => false),
      jest.fn(() => 'https://example.com/test-end'),
    ]

    expect(normalizeEmbeddedVideoUrl(null, normalizers)).toBe(null)
    expect(normalizeEmbeddedVideoUrl(undefined, normalizers)).toBe(null)
  })

  test('calls all normalizers until one return string', () => {
    const normalizers = [
      jest.fn((): false => false),
      jest.fn((): false => false),
      jest.fn(() => 'https://example.com/test-end'),
      jest.fn(() => 'https://example.com/test-no-run-1'),
      jest.fn((): false => false),
    ]
    const ranNormalizers = normalizers.slice(0, 3)
    const skippedNormalizers = normalizers.slice(3)

    const result = normalizeEmbeddedVideoUrl(
      'https://example.com/test-start',
      normalizers
    )

    ranNormalizers.forEach((fn) => expect(fn).toHaveBeenCalled())
    skippedNormalizers.forEach((fn) => expect(fn).not.toHaveBeenCalled())

    expect(result).toBe('https://example.com/test-end')
  })

  test('if none return string (all false), returns original string', () => {
    const normalizers = [
      jest.fn((): false => false),
      jest.fn((): false => false),
      jest.fn((): false => false),
      jest.fn((): false => false),
    ]

    const url = 'https://example.com/test-start'
    const result = normalizeEmbeddedVideoUrl(url, normalizers)

    expect(result).toBe(url)
  })

  test('if passed a malformed URL, returns original string', () => {
    const normalizers = [
      jest.fn((): false => false),
      jest.fn((): false => false),
      jest.fn(() => 'https://example.com/test-end'),
      jest.fn(() => 'https://example.com/test-no-run-1'),
      jest.fn((): false => false),
    ]

    const malformedUrl = ':::://///some-malformed\\string'
    const result = normalizeEmbeddedVideoUrl(malformedUrl, normalizers)

    expect(result).toBe(malformedUrl)
  })
})

describe('normalizeEmbeddedYoutubeUrl', () => {
  test('returns false if not a youtube url', () => {
    expect(
      normalizeEmbeddedYoutubeUrl(new URL('https://example.com?v=foo'))
    ).toBe(false)
  })

  test('returns false if youtube url but unable to determine video ID', () => {
    expect(
      normalizeEmbeddedYoutubeUrl(
        new URL('https://youtube.com?p=some-other-param')
      )
    ).toBe(false)
  })

  test('returns normalized url if is youtube url and video id was determined', () => {
    const videoId = 'vIdeoID6'

    const expectedUrl = `https://www.youtube.com/embed/${videoId}`

    const testUrls = [
      `https://youtube.com/watch?v=${videoId}`,
      `https://youtu.be/watch?v=${videoId}`,
      `https://youtube.com/embed/${videoId}`,
      `https://youtu.be/embed/${videoId}`,
      `https://www.youtube.com/watch?v=${videoId}`,
      `https://www.youtu.be/watch?v=${videoId}`,
      `https://www.youtube.com/embed/${videoId}`,
      `https://www.youtu.be/embed/${videoId}`,
    ]

    testUrls.forEach((url) =>
      expect(normalizeEmbeddedYoutubeUrl(new URL(url))).toBe(expectedUrl)
    )
  })

  test('preserves other search params', () => {
    const videoId = 'vIdeoID6'

    const expectedUrl = `https://www.youtube.com/embed/${videoId}`

    const makeTestResultPair = (params: string) => [
      `https://youtube.com/watch?v=${videoId}&${params}`,
      `https://www.youtube.com/embed/${videoId}?${params}`,
    ]

    const testParams = ['foo=bar', 'p=thing&bar=baz', 'a=1&b=2&c=3&d=4']

    testParams.forEach((params) => {
      const [testUrl, resultUrl] = makeTestResultPair(params)

      expect(normalizeEmbeddedYoutubeUrl(new URL(testUrl))).toBe(resultUrl)
    })
  })
})
