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
import { FaqPanel } from './FaqPanel'
import { ConnectWithUs } from './ConnectWithUs'
import { hashReference } from '@/lib/utils/hashReference'
import { BenefitCategories } from './BenefitCategories'

const mockBaseProps: CampaignLandingPageProps = {
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
  faq: {
    show: true,
    cta: {
      url: 'https://example.com/faq-cta',
      label: 'faq CTA',
    } as Button,
    faqs: [
      {
        type: 'paragraph--q_a',
        question: 'How can I attend an event?',
        answers: [
          {
            type: 'paragraph--wysiwyg',
            id: 'abc123',
            html: '<p>Some html</p>',
          },
        ],
        id: 'e7f9fe15-c607-444c-a7cc-72319973d088',
      },
    ],
    reusable: {
      questions: [
        {
          question: 'Reusable container question',
          answers: [
            {
              type: 'paragraph--rich_text_char_limit_1000',
              id: '',
              html: '<p>reusable question html</p>',
            },
          ],
          type: 'node--q_a',
          id: '',
        },
      ],
      type: 'paragraph--q_a_group',
      id: '',
      entityId: 184606,
      intro: null,
      header: 'Reusable container header',
      displayAccordion: true,
      html: '<p>Reusable container answer</p>\n',
    },
  },
  connectWithUs: {
    organizationTitle: 'Veterans Affairs',
    emailLink: {
      href: 'https://public.govdelivery.com/accounts/USVA/subscriber/new/',
      title: 'Veterans Affairs Email Updates',
    },
    socialLinks: {
      twitter: 'DeptVetAffairs',
      facebook: 'VeteransAffairs',
      youtube: 'DeptVetAffairs',
      instagram: 'deptvetaffairs',
      linkedin: 'company/department-of-veterans-affairs',
    },
  },
  benefitCategories: [
    {
      title: 'Health care',
      path: '/health-care',
      titleIcon: 'health-care',
      teaserText: 'Manage your health care and benefits online.',
    },
    {
      title: 'Disability',
      path: '/disability',
      titleIcon: 'disability',
      teaserText:
        'File for disability compensation for conditions related to your military service.',
    },
  ],
} as CampaignLandingPageProps

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
    await render(<CampaignLandingPage {...mockBaseProps} />)

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument()
    expect(screen.getByTestId('why-this-matters')).toBeInTheDocument()
    expect(screen.getByTestId('what-you-can-do')).toBeInTheDocument()
    expect(screen.getByTestId('video-panel')).toBeInTheDocument()
    expect(screen.getByTestId('spotlight-panel')).toBeInTheDocument()
    expect(screen.getByTestId('stories-panel')).toBeInTheDocument()
    expect(screen.getByTestId('resources-panel')).toBeInTheDocument()
    expect(screen.getByTestId('events-panel')).toBeInTheDocument()
    expect(screen.getByTestId('faq-panel')).toBeInTheDocument()
    expect(screen.getByTestId('connect-with-us')).toBeInTheDocument()
    expect(screen.getByTestId('benefit-categories')).toBeInTheDocument()
  })

  test('CampaignLandingPage component renders with no axe violations', async () => {
    const { container } = await render(
      <CampaignLandingPage {...mockBaseProps} />
    )

    const axeResults = await axe(container, {
      rules: {
        // It's only empty because it isn't evaluating the `<va-link>` element inside it.
        'empty-heading': { enabled: false },
      },
    })
    expect(axeResults).toHaveNoViolations()
  })
})

describe('CampaignLandingPage->HeroBanner', () => {
  test('shows page title', () => {
    render(<HeroBanner {...mockBaseProps} />)

    expect(screen.getByText(mockBaseProps.title)).toBeInTheDocument()
  })

  test('shows blurb', () => {
    render(<HeroBanner {...mockBaseProps} />)

    expect(screen.getByText(mockBaseProps.hero.blurb)).toBeInTheDocument()
  })

  test('shows primary cta link', () => {
    render(<HeroBanner {...mockBaseProps} />)

    const link = screen.getByTestId('primary-cta')

    expect(link.localName).toBe('va-link-action')
    expect(link.href).toBe(mockBaseProps.cta.primary.href)
    expect(link.text).toBe(mockBaseProps.cta.primary.label)
  })

  test('shows hero image with 1:1 aspect ratio', () => {
    render(<HeroBanner {...mockBaseProps} />)

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
  test('shows why it matters', () => {
    render(<WhyThisMatters {...mockBaseProps} />)

    expect(screen.getByText(mockBaseProps.whyThisMatters)).toBeInTheDocument()
  })

  test('show secondary cta', () => {
    render(<WhyThisMatters {...mockBaseProps} />)

    const link = screen.getByTestId('secondary-cta')

    expect(link.localName).toBe('va-link-action')
    expect(link.href).toBe(mockBaseProps.cta.secondary.href)
    expect(link.text).toBe(mockBaseProps.cta.secondary.label)
  })

  test('shows audiences', () => {
    render(<WhyThisMatters {...mockBaseProps} />)

    mockBaseProps.audience.map(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })
})

describe('CampaignLandingPage->VideoPanel', () => {
  it('shows video header', () => {
    render(<VideoPanel {...mockBaseProps} />)

    expect(screen.getByText('video header')).toBeInTheDocument()
  })

  it('shows correct publication date', () => {
    render(<VideoPanel {...mockBaseProps} />)

    expect(screen.getByText(/November 3, 2025/)).toBeInTheDocument()
  })

  it('shows correct duration label', () => {
    render(<VideoPanel {...mockBaseProps} />)

    expect(screen.getByText(/1:10 minutes/)).toBeInTheDocument()
  })

  it('shows cta button', () => {
    render(<VideoPanel {...mockBaseProps} />)

    const ctaRoot = screen.getByTestId('video-cta')
    expect(ctaRoot).toBeInTheDocument()

    expect(ctaRoot.href).toBe('https://example.com/button-url')
    expect(ctaRoot.text).toBe('Video button')
  })
})

describe('CampaignLandingPage->StoriesPanel', () => {
  test('shows header', () => {
    render(<StoriesPanel {...mockBaseProps} />)

    expect(screen.getByText('stories header')).toBeInTheDocument()
  })

  test('shows intro', () => {
    render(<StoriesPanel {...mockBaseProps} />)

    expect(screen.getByText('stories intro')).toBeInTheDocument()
  })

  test('shows teaser summary', () => {
    render(<StoriesPanel {...mockBaseProps} />)

    expect(screen.getByText('Summary for stories teaser 1')).toBeInTheDocument()
  })

  test('shows teaser link', () => {
    render(<StoriesPanel {...mockBaseProps} />)

    const link = screen.getByTestId('stories-teaser-link')

    expect(link.href).toBe('?stories-teaser-1')
    expect(link.text).toBe('Stories easer 1 link')
  })

  test('shows teaser image', () => {
    render(<StoriesPanel {...mockBaseProps} />)

    const img = screen.getByTestId('stories-teaser-image')
    expect(img.src).toBe('https://example.com/stories-teaser-1-image.png')
  })

  test('does not render when stories.show = false', async () => {
    await render(<StoriesPanel {...mockBaseProps} />)

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

    await render(<StoriesPanel {...mockWithStoriesHidden} />)

    // now that we know it renders with show:true, let's make sure it didn't with show:false
    expect(screen.queryByTestId('stories-panel')).not.toBeInTheDocument()
  })
})

describe('CampaignLandingPage->ResourcesPanel', () => {
  test('shows header', () => {
    render(<ResourcesPanel {...mockBaseProps} />)

    expect(screen.getByText('resources header')).toBeInTheDocument()
  })

  test('shows intro', () => {
    render(<ResourcesPanel {...mockBaseProps} />)

    expect(screen.getByText('resources intro')).toBeInTheDocument()
  })

  test('shows CTA', () => {
    render(<ResourcesPanel {...mockBaseProps} />)

    const cta = screen.getByTestId('resources-cta')

    expect(cta).toBeInTheDocument()
    expect(cta.href).toBe('https://example.com/resources-cta')
    expect(cta.text).toBe('resources CTA')
  })

  test('shows resource document', () => {
    render(<ResourcesPanel {...mockBaseProps} />)

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
    await render(<ResourcesPanel {...mockBaseProps} />)
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

    await render(<ResourcesPanel {...mockWithResourcesHidden} />)

    // now that we know it renders with show:true, let's make sure it didn't with show:false
    expect(screen.queryByTestId('resources-panel')).not.toBeInTheDocument()
  })
})

describe('CampaignLandingPage->EventsPanel', () => {
  test('shows header', () => {
    render(<EventsPanel {...mockBaseProps} />)
    expect(screen.getByText('events header')).toBeInTheDocument()
  })

  test('event has name and description', () => {
    render(<EventsPanel {...mockBaseProps} />)
    expect(screen.getByText('event description')).toBeInTheDocument()
  })

  test('event has correct links', () => {
    render(<EventsPanel {...mockBaseProps} />)
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

    await render(<EventsPanel {...altMock} />)

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

    await render(<EventsPanel {...altMock} />)

    // link should be gone
    expect(screen.queryByTestId('event-header-link')).not.toBeInTheDocument()

    // but the header should still render
    expect(screen.getByTestId('event-header')).toHaveTextContent('event name')
  })

  test('does not render when events.show = false', async () => {
    await render(<EventsPanel {...mockBaseProps} />)
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

    await render(<EventsPanel {...mockWithResourcesHidden} />)

    // now that we know it renders with show:true, let's make sure it didn't with show:false
    expect(screen.queryByTestId('events-panel')).not.toBeInTheDocument()
  })
})

describe('CampaignLandingPage->FaqPanel', () => {
  test('displays correct header and content', () => {
    render(<FaqPanel {...mockBaseProps} />)
    expect(screen.getByText('Reusable container header')).toBeInTheDocument()
    expect(screen.getByText('Reusable container answer')).toBeInTheDocument()
  })

  test('displays correct default header when not specified', async () => {
    const mockWithoutReusableHeader = {
      ...mockBaseProps,
      faq: {
        ...mockBaseProps.faq,
        reusable: {
          ...mockBaseProps.faq.reusable,
          header: null,
        },
      },
    }

    await render(<FaqPanel {...mockWithoutReusableHeader} />)

    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument()
  })

  test('renders FAQ accordion items with correct attributes', () => {
    render(<FaqPanel {...mockBaseProps} />)
    const questionText = 'How can I attend an event?'
    const accordionItem = screen
      .getByTestId('faq-panel')
      .querySelector(
        `va-accordion-item[id="${hashReference(questionText, 60)}"]`
      )

    expect(accordionItem).toBeInTheDocument()
    expect(accordionItem.getAttribute('data-faq-entity-id')).toBe(
      'e7f9fe15-c607-444c-a7cc-72319973d088'
    )
  })

  test('renders reusable question accordion items when displayAccordion is true', () => {
    render(<FaqPanel {...mockBaseProps} />)
    const questionText = 'Reusable container question'
    const accordionItem = screen
      .getByTestId('faq-panel')
      .querySelector(
        `va-accordion-item[id="${hashReference(questionText, 60)}"]`
      )

    expect(accordionItem).toBeInTheDocument()
  })

  test('displays CTA button', () => {
    render(<FaqPanel {...mockBaseProps} />)
    const cta = screen.getByTestId('faq-panel').querySelector('va-link-action')

    expect(cta).toBeInTheDocument()
    expect(cta.href).toBe('https://example.com/faq-cta')
    expect(cta.text).toBe('faq CTA')
  })

  test('does not render when faq.show = false', async () => {
    await render(<FaqPanel {...mockBaseProps} />)
    expect(screen.getByTestId('faq-panel')).toBeInTheDocument()
    await cleanup()

    const mockWithFaqHidden = {
      ...mockBaseProps,
      faq: {
        ...mockBaseProps.faq,
        show: false,
      },
    }

    await render(<FaqPanel {...mockWithFaqHidden} />)

    expect(screen.queryByTestId('faq-panel')).not.toBeInTheDocument()
  })

  test('renders reusable questions as plain elements when displayAccordion is false', async () => {
    const mockWithoutAccordion = {
      ...mockBaseProps,
      faq: {
        ...mockBaseProps.faq,
        reusable: {
          ...mockBaseProps.faq.reusable,
          displayAccordion: false,
        },
      },
    }

    await render(<FaqPanel {...mockWithoutAccordion} />)

    // Should NOT render reusable question as va-accordion-item
    const reusableQuestionText = 'Reusable container question'
    const reusableAccordionItem = screen
      .getByTestId('faq-panel')
      .querySelector(
        `va-accordion-item[id="${hashReference(reusableQuestionText, 60)}"]`
      )

    expect(reusableAccordionItem).not.toBeInTheDocument()

    // Regular FAQ should still be an accordion item
    const regularFaqQuestionText = 'How can I attend an event?'
    const regularFaqItem = screen
      .getByTestId('faq-panel')
      .querySelector(
        `va-accordion-item[id="${hashReference(regularFaqQuestionText, 60)}"]`
      )

    expect(regularFaqItem).toBeInTheDocument()

    // Reusable content should still be rendered as plain elements
    expect(screen.getByText('Reusable container question')).toBeInTheDocument()
    expect(screen.getByText('reusable question html')).toBeInTheDocument()
  })
})

describe('CampaignLandingPage->ConnectWithUs', () => {
  test('shows section header', () => {
    render(<ConnectWithUs {...mockBaseProps} />)

    expect(screen.getByText('Connect with us')).toBeInTheDocument()
    expect(
      screen.getByText('Get updates from Veterans Affairs')
    ).toBeInTheDocument()
  })

  test('renders all social links and icons', () => {
    render(<ConnectWithUs {...mockBaseProps} />)

    const container = screen.getByTestId('connect-with-us')

    // Check for va-icon elements (6 total: mail + 5 social)
    const icons = container.querySelectorAll('va-icon')
    expect(icons.length).toBe(6)

    // Check for va-link elements (6 total: email + 5 social)
    const links = container.querySelectorAll('va-link')
    expect(links.length).toBe(6)

    // Check that links have expected href values
    const hrefs = Array.from(links).map(
      (link) => (link as HTMLAnchorElement).href
    )
    expect(hrefs).toContain(
      'https://public.govdelivery.com/accounts/USVA/subscriber/new/'
    )
    expect(hrefs).toContain('https://www.twitter.com/DeptVetAffairs')
    expect(hrefs).toContain('https://www.facebook.com/VeteransAffairs')
    expect(hrefs).toContain('https://www.youtube.com/DeptVetAffairs')
    expect(hrefs).toContain(
      'https://www.linkedin.com/company/department-of-veterans-affairs'
    )
    expect(hrefs).toContain('https://www.instagram.com/deptvetaffairs')

    // Check that links have expected text values
    const texts = Array.from(links).map(
      (link) => (link as HTMLAnchorElement).text
    )
    expect(texts).toContain('Veterans Affairs Email Updates')
    expect(texts).toContain('Veterans Affairs X (formerly Twitter)')
    expect(texts).toContain('Veterans Affairs Facebook')
    expect(texts).toContain('Veterans Affairs YouTube')
    expect(texts).toContain('Veterans Affairs LinkedIn')
    expect(texts).toContain('Veterans Affairs Instagram')
  })

  test('does not render when connectWithUs is null', async () => {
    const mockWithoutConnectWithUs = {
      ...mockBaseProps,
      connectWithUs: null,
    }

    await render(<ConnectWithUs {...mockWithoutConnectWithUs} />)

    expect(screen.queryByTestId('connect-with-us')).not.toBeInTheDocument()
  })

  test('does not render when organizationTitle is empty', async () => {
    const mockWithEmptyTitle = {
      ...mockBaseProps,
      connectWithUs: {
        ...mockBaseProps.connectWithUs,
        organizationTitle: '',
      },
    }

    await render(<ConnectWithUs {...mockWithEmptyTitle} />)

    expect(screen.queryByTestId('connect-with-us')).not.toBeInTheDocument()
  })

  test('does not render email link when emailLink is null', async () => {
    const mockWithoutEmailLink = {
      ...mockBaseProps,
      connectWithUs: {
        ...mockBaseProps.connectWithUs,
        emailLink: null,
      },
    }

    await render(<ConnectWithUs {...mockWithoutEmailLink} />)

    const container = screen.getByTestId('connect-with-us')
    // Should have 5 icons (social only) instead of 6
    const icons = container.querySelectorAll('va-icon')
    expect(icons.length).toBe(5)

    // Should have 5 links (social only) instead of 6
    const links = container.querySelectorAll('va-link')
    expect(links.length).toBe(5)
  })

  test('does not render social links when values are null', async () => {
    const mockWithoutSocialLinks = {
      ...mockBaseProps,
      connectWithUs: {
        ...mockBaseProps.connectWithUs,
        socialLinks: {
          twitter: null,
          facebook: null,
          youtube: null,
          instagram: null,
          linkedin: null,
        },
      },
    }

    await render(<ConnectWithUs {...mockWithoutSocialLinks} />)

    const container = screen.getByTestId('connect-with-us')

    // Should have only 1 icon (mail) and 1 link (email)
    const icons = container.querySelectorAll('va-icon')
    expect(icons.length).toBe(1)

    const links = container.querySelectorAll('va-link')
    expect(links.length).toBe(1)
  })
})

describe('CampaignLandingPage->BenefitCategories', () => {
  test('shows section header', () => {
    render(<BenefitCategories {...mockBaseProps} />)

    expect(screen.getByText('VA Benefits')).toBeInTheDocument()
    expect(
      screen.getByText('Learn more about related VA benefits')
    ).toBeInTheDocument()
  })

  test('renders all benefit categories with links and icons', () => {
    render(<BenefitCategories {...mockBaseProps} />)

    const container = screen.getByTestId('benefit-categories')

    // Check for va-link elements (2 benefit categories)
    const links = container.querySelectorAll('va-link')
    expect(links.length).toBe(2)

    // Check that links have expected href and text values
    const healthCareLink = Array.from(links).find(
      (link) => (link as HTMLAnchorElement).text === 'Health care'
    )
    expect(healthCareLink).toBeTruthy()
    expect((healthCareLink as HTMLAnchorElement).href).toBe('/health-care')

    const disabilityLink = Array.from(links).find(
      (link) => (link as HTMLAnchorElement).text === 'Disability'
    )
    expect(disabilityLink).toBeTruthy()
    expect((disabilityLink as HTMLAnchorElement).href).toBe('/disability')
  })

  test('shows teaser text for each benefit category', () => {
    render(<BenefitCategories {...mockBaseProps} />)

    expect(
      screen.getByText('Manage your health care and benefits online.')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'File for disability compensation for conditions related to your military service.'
      )
    ).toBeInTheDocument()
  })

  test('renders hub icons for each benefit category', () => {
    render(<BenefitCategories {...mockBaseProps} />)

    const container = screen.getByTestId('benefit-categories')
    const icons = container.querySelectorAll('va-icon')

    // Should have 2 icons (one for each benefit category)
    expect(icons.length).toBe(2)
  })

  test('renders back to top button', () => {
    render(<BenefitCategories {...mockBaseProps} />)

    const container = screen.getByTestId('benefit-categories')
    const backToTop = container.querySelector('va-back-to-top')

    expect(backToTop).toBeInTheDocument()
  })

  test('renders ContentFooter component', () => {
    render(<BenefitCategories {...mockBaseProps} />)

    expect(screen.getByTestId('content-footer')).toBeInTheDocument()
  })

  test('does not render when benefitCategories is empty', async () => {
    const mockWithNoBenefitCategories = {
      ...mockBaseProps,
      benefitCategories: [],
    }

    await render(<BenefitCategories {...mockWithNoBenefitCategories} />)

    expect(screen.queryByTestId('benefit-categories')).not.toBeInTheDocument()
  })

  test('applies correct margin classes to second item', () => {
    render(<BenefitCategories {...mockBaseProps} />)

    const container = screen.getByTestId('benefit-categories')
    const items = container.querySelectorAll(
      '.vads-l-col--12.medium-screen\\:vads-l-col--6'
    )

    expect(items.length).toBe(2)

    // First item should not have the margin-top classes
    expect(items[0].className).not.toContain('vads-u-margin-top--2')

    // Second item should have the margin-top classes
    expect(items[1].className).toContain('vads-u-margin-top--2')
    expect(items[1].className).toContain('medium-screen:vads-u-margin-top--0')
  })
})
