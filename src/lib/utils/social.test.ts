import { iconNameFromUrl } from './social'

describe('iconNameFromUrl', () => {
  test('returns correct icon for social media URLs', () => {
    expect(iconNameFromUrl('https://www.facebook.com/veteransbenefits')).toBe(
      'facebook'
    )
    expect(iconNameFromUrl('https://twitter.com/VeteransBenefits')).toBe('x')
    expect(iconNameFromUrl('https://x.com/VeteransBenefits')).toBe('x')
    expect(iconNameFromUrl('https://instagram.com/VeteransBenefits')).toBe(
      'instagram'
    )
    expect(
      iconNameFromUrl('https://www.govdelivery.com/veteransbenefits')
    ).toBe('mail')
    expect(
      iconNameFromUrl('https://www.flickr.com/photos/veteransbenefits')
    ).toBe('flickr')
    expect(iconNameFromUrl('https://www.youtube.com/veteransbenefits')).toBe(
      'youtube'
    )
  })

  test('returns null for unrecognized URLs', () => {
    expect(iconNameFromUrl('https://www.example.com')).toBe(null)
    expect(iconNameFromUrl('https://www.linkedin.com/company/example')).toBe(
      null
    )
    expect(iconNameFromUrl('https://www.pinterest.com/example')).toBe(null)
  })

  test('works with different URL formats', () => {
    // Test URLs without www
    expect(iconNameFromUrl('https://facebook.com/page')).toBe('facebook')
    expect(iconNameFromUrl('https://twitter.com/user')).toBe('x')

    // Test URLs with subpaths
    expect(iconNameFromUrl('https://www.youtube.com/channel/UC123456')).toBe(
      'youtube'
    )
    expect(iconNameFromUrl('https://www.flickr.com/photos/user/albums')).toBe(
      'flickr'
    )

    // Test URLs with query parameters
    expect(iconNameFromUrl('https://www.facebook.com/page?ref=search')).toBe(
      'facebook'
    )
    expect(
      iconNameFromUrl('https://www.govdelivery.com/signup?topic=news')
    ).toBe('mail')
  })
})
