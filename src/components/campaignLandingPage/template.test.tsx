import React from 'react'
import { render, screen } from '@testing-library/react'
import { CampaignLandingPage, CampaignLandingPageProps } from './template'
import { axe } from '@/test-utils'
import { HeroBanner } from './HeroBanner'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'

import { defineCustomElements } from '@department-of-veterans-affairs/web-components/loader'
import { WhyThisMatters } from './WhyThisMatters'
import {
  MediaImage,
  MediaImageLinks,
  MediaVideo,
} from '@/components/mediaDocument/formatted-type'
import { FieldLink } from '@/types/drupal/field_type'
import { Button } from '../button/formatted-type'
import { VideoPanel } from './VideoPanel'
import { LinkTeaser } from '../linkTeaser/formatted-type'
import { LinkTeaserWithImage } from '../linkTeaserWithImage/formatted-type'
import { StoriesPanel } from './StoriesPanel'
import { cleanup } from '@testing-library/react'
import { MediaDocumentExternal } from '../mediaDocumentExternal/formatted-type'
import { ResourcesPanel } from './ResourcesPanel'
import { Event } from '../event/formatted-type'
import { EventsPanel } from './EventsPanel'

const mockBaseProps: Partial<CampaignLandingPageProps> = {
  title: 'Testing title',
  hero: {
    blurb: 'This is the test hero blurb',
    image: {
      alt: '',
      links: {
        '1_1_square_large': {
          href: 'https://example.com/hero-image.png',
        } as unknown as MediaImageLinks,
      },
    } as unknown as MediaImage,
  },
  cta: {
    primary: {
      label: 'primary cta label',
      href: '#primary-cta',
    },
    secondary: {
      label: 'secondary cta label',
      href: '#secondary-cta',
    },
  },
  whyThisMatters: 'test why it matters',
  audience: [{ name: 'audience 1' }, { name: 'audience 2' }],
  socialLinks: [
    {
      icon: 'social-icon-1',
      href: '/social-href-1',
      text: 'social text 1',
    },
    {
      icon: 'social-icon-2',
      href: '/social-href-2',
      text: 'social text 2',
    },
  ],
  whatYouCanDo: {
    header: 'WhatYouCanDo header',
    intro: 'WhatYouCanDo intro',
    promos: [
      {
        link: {
          field_link: {
            url: '?promo-1',
            title: 'Promo 1 link',
          } as FieldLink,
          field_link_summary: 'Summary of field link 1',
        } as ParagraphLinkTeaser,
        image: {
          alt: '',
          links: {
            '3_2_medium_thumbnail': {
              href: 'https://example.com/promo-1-image.png',
            } as unknown as MediaImageLinks,
          },
        } as unknown as MediaImage,
      },
    ],
  },
  video: {
    show: true,
    header: 'video header',
    media: {
      field_media_video_embed_field: 'https://example.com/video',
      name: 'some video',
      field_duration: 70,
      field_publication_date: '2025-11-03',
    } as MediaVideo,
    button: {
      url: 'https://example.com/button-url',
      label: 'Video button',
    } as Button,
  },
  spotlight: {
    show: true,
    header: 'spotlight header',
    intro: 'spotlight intro',
    cta: {
      url: 'https://example.com/spotlight-cta-url',
      label: 'spotlight CTA',
    } as Button,
    teasers: [
      {
        uri: '?teaser-1',
        title: 'Teaser 1 link',
        summary: 'Summary for teaser 1',
      } as LinkTeaser,
      {
        uri: '?teaser-2',
        title: 'Teaser 2 link',
        summary: 'Summary for teaser 2',
      } as LinkTeaser,
    ],
  },
  stories: {
    show: true,
    header: 'stories header',
    intro: 'stories intro',
    cta: {
      url: '?stories-1',
      label: 'the stories header',
    },
    teasers: [
      {
        teaser: {
          uri: '?stories-teaser-1',
          title: 'Stories easer 1 link',
          summary: 'Summary for stories teaser 1',
        } as LinkTeaser,
        image: {
          alt: '',
          links: {
            '3_2_medium_thumbnail': {
              href: 'https://example.com/stories-teaser-1-image.png',
            } as unknown as MediaImageLinks,
          },
        } as unknown as MediaImage,
      } as LinkTeaserWithImage,
    ],
  },
  resources: {
    show: true,
    header: 'resources header',
    intro: 'resources intro',
    cta: {
      url: 'https://example.com/resources-cta',
      label: 'resources CTA',
    } as Button,
    documents: [
      {
        name: 'resources document name',
        description: 'resources document description',
        url: 'https://example.com/resource-document.pdf',
        fileName: 'resource-document.pdf',
      } as MediaDocumentExternal,
    ],
  },
  events: {
    show: true,
    header: 'events header',
    events: [
      {
        title: 'event name',
        description: 'event description',
        facilityLocation: {
          title: 'facility title',
          path: {
            alias: '?location-link',
          },
        },
        locationHumanReadable: 'human-readable-location',
        link: {
          url: '?cta-link',
        },
        eventCTA: 'event CTA label',
        urlOfOnlineEvent: {
          url: '?online-link',
        },
      } as unknown as Event,
    ],
  },
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return <img {...props} />
  },
}))

beforeEach(() => {
  defineCustomElements()
})

describe('CampaignLandingPage with valid data', () => {
  test('CampaignLandingPage component renders all sub components', async () => {
    const { container } = await render(
      <CampaignLandingPage {...(mockBaseProps as CampaignLandingPageProps)} />
    )

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument()
    expect(screen.getByTestId('why-this-matters')).toBeInTheDocument()
    expect(screen.getByTestId('what-you-can-do')).toBeInTheDocument()
    expect(screen.getByTestId('video-panel')).toBeInTheDocument()
    expect(screen.getByTestId('spotlight-panel')).toBeInTheDocument()
    expect(screen.getByTestId('stories-panel')).toBeInTheDocument()
    expect(screen.getByTestId('resources-panel')).toBeInTheDocument()
    expect(screen.getByTestId('events-panel')).toBeInTheDocument()

    // TODO: Check that the other components rendered once they're built
  })

  test('CampaignLandingPage component renders with no axe violations', async () => {
    const { container } = await render(
      <CampaignLandingPage
        onlyRenderFinishedComponents
        {...(mockBaseProps as CampaignLandingPageProps)}
      />
    )

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
})

describe('CampaignLandingPage->HeroBanner', () => {
  beforeEach(async () => {
    await render(
      <HeroBanner {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  test('shows page title', () => {
    expect(screen.getByText(mockBaseProps.title)).toBeInTheDocument()
  })

  test('shows blurb', () => {
    expect(screen.getByText(mockBaseProps.hero.blurb)).toBeInTheDocument()
  })

  test('shows primary cta link', () => {
    const link = screen.getByTestId('primary-cta')

    expect(link.localName).toBe('va-link-action')
    expect(link.href).toBe(mockBaseProps.cta.primary.href)
    expect(link.text).toBe(mockBaseProps.cta.primary.label)
  })

  test('shows hero image with 1:1 aspect ratio', () => {
    const img = screen.getByTestId('hero-image')

    expect(img.src).toBe(
      mockBaseProps.hero.image.links['1_1_square_large'].href
    )

    // Empty alt intentional
    // See https://github.com/department-of-veterans-affairs/va.gov-cms/issues/22439
    expect(img.alt).toBe('')

    // 1:1 aspect ratio
    expect(img.style['aspect-ratio']).toBe('1/1')
    expect(img.style['object-fit']).toBe('cover')
  })
})

describe('CampaignLandingPage->WhyThisMatters', () => {
  beforeEach(async () => {
    await render(
      <WhyThisMatters {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  test('shows why it matters', () => {
    expect(screen.getByText(mockBaseProps.whyThisMatters)).toBeInTheDocument()
  })

  test('show secondary cta', () => {
    const link = screen.getByTestId('secondary-cta')

    expect(link.localName).toBe('va-link-action')
    expect(link.href).toBe(mockBaseProps.cta.secondary.href)
    expect(link.text).toBe(mockBaseProps.cta.secondary.label)
  })

  test('shows audiences', () => {
    mockBaseProps.audience.map(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })
})

describe('CampaignLandingPage->VideoPanel', () => {
  beforeEach(async () => {
    await render(
      <VideoPanel {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  it('shows video header', () => {
    expect(screen.getByText('video header')).toBeInTheDocument()
  })

  it('shows correct publication date', () => {
    expect(screen.getByText(/November 3, 2025/)).toBeInTheDocument()
  })

  it('shows correct duration label', () => {
    expect(screen.getByText(/1:10 minutes/)).toBeInTheDocument()
  })

  it('shows cta button', () => {
    const ctaRoot = screen.getByTestId('video-cta')
    expect(ctaRoot).toBeInTheDocument()

    expect(ctaRoot.href).toBe('https://example.com/button-url')
    expect(ctaRoot.text).toBe('Video button')
  })
})

describe('CampaignLandingPage->StoriesPanel', () => {
  beforeEach(async () => {
    await render(
      <StoriesPanel {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  test('shows header', () => {
    expect(screen.getByText('stories header')).toBeInTheDocument()
  })

  test('shows intro', () => {
    expect(screen.getByText('stories intro')).toBeInTheDocument()
  })

  test('shows teaser summary', () => {
    expect(screen.getByText('Summary for stories teaser 1')).toBeInTheDocument()
  })

  test('shows teaser link', () => {
    const link = screen.getByTestId('stories-teaser-link')

    expect(link.href).toBe('?stories-teaser-1')
    expect(link.text).toBe('Stories easer 1 link')
  })

  test('shows teaser image', () => {
    const img = screen.getByTestId('stories-teaser-image')
    expect(img.src).toBe('https://example.com/stories-teaser-1-image.png')
  })

  test('does not render when stories.show = false', async () => {
    // first, test the inverse to ensure this test passing isn't a fluke & isolate the reason
    expect(screen.getByTestId('stories-panel')).toBeInTheDocument()
    await cleanup()

    const mockWithStoriesHidden = {
      ...mockBaseProps,
      stories: {
        ...mockBaseProps.stories,
        show: false,
      },
    }

    await render(
      <StoriesPanel {...(mockWithStoriesHidden as CampaignLandingPageProps)} />
    )

    // now that we know it renders with show:true, let's make sure it didn't with show:false
    expect(screen.queryByTestId('stories-panel')).not.toBeInTheDocument()
  })
})

describe('CampaignLandingPage->ResourcesPanel', () => {
  beforeEach(async () => {
    await render(
      <ResourcesPanel {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  test('shows header', () => {
    expect(screen.getByText('resources header')).toBeInTheDocument()
  })

  test('shows intro', () => {
    expect(screen.getByText('resources intro')).toBeInTheDocument()
  })

  test('shows CTA', () => {
    const cta = screen.getByTestId('resources-cta')

    expect(cta).toBeInTheDocument()
    expect(cta.href).toBe('https://example.com/resources-cta')
    expect(cta.text).toBe('resources CTA')
  })

  test('shows resource document', () => {
    expect(screen.getByText('resources document name')).toBeInTheDocument()
    expect(
      screen.getByText('resources document description')
    ).toBeInTheDocument()

    const link = screen.getByTestId('resource-link')
    expect(link.getAttribute('href')).toBe(
      'https://example.com/resource-document.pdf'
    )
  })

  test('does not render when resources.show = false', async () => {
    // first, test the inverse to ensure this test passing isn't a fluke & isolate the reason
    expect(screen.getByTestId('resources-panel')).toBeInTheDocument()
    await cleanup()

    const mockWithResourcesHidden = {
      ...mockBaseProps,
      resources: {
        ...mockBaseProps.resources,
        show: false,
      },
    }

    await render(
      <StoriesPanel
        {...(mockWithResourcesHidden as CampaignLandingPageProps)}
      />
    )

    // now that we know it renders with show:true, let's make sure it didn't with show:false
    expect(screen.queryByTestId('resources-panel')).not.toBeInTheDocument()
  })
})

describe('CampaignLandingPage->EventsPanel', () => {
  beforeEach(async () => {
    await render(
      <EventsPanel {...(mockBaseProps as CampaignLandingPageProps)} />
    )
  })

  test('shows header', () => {
    expect(screen.getByText('events header')).toBeInTheDocument()
  })

  test('event has name and description', () => {
    expect(screen.getByText('event description')).toBeInTheDocument()
  })

  test('event has correct links', () => {
    const headerLink = screen.getByTestId('event-header-link')
    expect(headerLink.href).toBe('?online-link')
    expect(headerLink.text).toBe('event name')

    // event location section:
    expect(screen.getByTestId('event-location')).toBeInTheDocument()

    const locationLink = screen.getByTestId('event-location-link')
    expect(locationLink.href).toBe('?location-link')
    expect(locationLink.text).toBe('facility title')

    const ctaLink = screen.getByTestId('event-cta-link')
    expect(ctaLink.href).toBe('?cta-link')
    expect(ctaLink.text).toBe('event CTA label')

    const onlineLink = screen.getByTestId('event-online-link')
    expect(onlineLink.href).toBe('?online-link')
    expect(onlineLink.text).toBe('human-readable-location')
  })

  it('hides location section when various fields are missing', async () => {
    const altMock = {
      ...mockBaseProps,
      events: {
        ...mockBaseProps.events,
        events: mockBaseProps.events.events.map((ev) => ({
          ...ev,
          facilityLocation: null,
          locationHumanReadable: null,
          link: null,
        })),
      },
    }

    await cleanup()
    await render(<EventsPanel {...(altMock as CampaignLandingPageProps)} />)

    expect(screen.queryByTestId('event-location')).not.toBeInTheDocument()
  })

  test('shows header as plain text when no online event link', async () => {
    const altMock = {
      ...mockBaseProps,
      events: {
        ...mockBaseProps.events,
        events: mockBaseProps.events.events.map((ev) => ({
          ...ev,
          urlOfOnlineEvent: null,
        })),
      },
    }

    await cleanup()
    await render(<EventsPanel {...(altMock as CampaignLandingPageProps)} />)

    // link should be gone
    expect(screen.queryByTestId('event-header-link')).not.toBeInTheDocument()

    // but the header should still render
    expect(screen.getByTestId('event-header')).toHaveTextContent('event name')
  })

  test('does not render when events.show = false', async () => {
    // first, test the inverse to ensure this test passing isn't a fluke & isolate the reason
    expect(screen.getByTestId('events-panel')).toBeInTheDocument()
    await cleanup()

    const mockWithResourcesHidden = {
      ...mockBaseProps,
      events: {
        ...mockBaseProps.events,
        show: false,
      },
    }

    await render(
      <EventsPanel {...(mockWithResourcesHidden as CampaignLandingPageProps)} />
    )

    // now that we know it renders with show:true, let's make sure it didn't with show:false
    expect(screen.queryByTestId('events-panel')).not.toBeInTheDocument()
  })
})
