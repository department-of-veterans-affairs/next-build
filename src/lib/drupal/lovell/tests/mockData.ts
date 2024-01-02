import { LOVELL } from '../constants'
import { slugToPath } from '@/lib/utils/slug'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const lovellFederalSlug = [
  LOVELL.federal.pathSegment,
  'stories',
  'story-1',
]

export const lovellTricareSlug = [
  LOVELL.tricare.pathSegment,
  'stories',
  'story-1',
]

export const lovellVaSlug = [LOVELL.va.pathSegment, 'stories', 'story-1']

export const otherSlug = ['some-other-health-care', 'stories', 'story-1']

export const lovellFederalResource = {
  path: slugToPath(lovellFederalSlug),
  administration: LOVELL.federal.administration,
}

export const lovellTricareResource = {
  path: slugToPath(lovellTricareSlug),
  administration: LOVELL.tricare.administration,
}

export const lovellVaResource = {
  path: slugToPath(lovellVaSlug),
  administration: LOVELL.va.administration,
}

export const otherResource = {
  path: slugToPath(otherSlug),
  administration: {
    id: 123,
    name: 'Some Other health care',
  },
}

export const newsStoryPartialResource = {
  id: 'some-unique-id',
  type: RESOURCE_TYPES.STORY,
  published: true,
  title: 'Title',
  breadcrumbs: [
    { title: 'Home', uri: '/', options: [] },
    { title: 'News', uri: '/news', options: [] },
  ],
  image: {
    alt: 'alt-text',
    id: 'id',
    title: 'title',
    url: 'image/src',
    width: 100,
    height: 100,
    link: {
      '2_1_large': {
        href: 'image/src',
        meta: {
          linkParams: {
            width: 100,
            height: 100,
          },
        },
      },
    },
  },
  caption: 'caption',
  author: {
    title: 'Author Name',
  },
  introText: 'intro-text',
  bodyContent: 'story-body',
  date: '2020-01-01',
  socialLinks: {
    title: 'Social Network',
    path: 'path/to/social',
  },
  listing: 'listing',
  entityId: 12345,
  metatags: null,
  lastUpdated: '2023-08-16T15:20:36+00:00',
}

export const lovellSidenavData = {
  rootPath: '/lovell-federal-health-care-va/stories/',
  data: {
    name: 'Lovell Federal health care - TRICARE',
    description: null,
    links: [
      {
        description: null,
        expanded: false,
        label: 'Lovell Federal health care',
        links: [
          {
            description: null,
            expanded: false,
            label: 'SERVICES AND LOCATIONS',
            links: [
              {
                description: null,
                expanded: false,
                label: 'Health services',
                links: [
                  {
                    description: null,
                    expanded: false,
                    label: 'Returning service member care',
                    links: [],
                    url: {
                      path: '/lovell-federal-health-care-tricare/health-services/returning-service-member-care',
                    },
                    lovellSection: 'tricare',
                  },
                ],
                url: {
                  path: '/lovell-federal-health-care-va/health-services',
                },
                lovellSection: 'va',
              },
              {
                description: null,
                expanded: false,
                label: 'Health services',
                links: [],
                url: {
                  path: '/lovell-federal-health-care-tricare/health-services',
                },
                lovellSection: 'tricare',
              },
              {
                description: null,
                expanded: false,
                label: 'Locations',
                links: [
                  {
                    description: null,
                    expanded: false,
                    label: 'Captain James A. Lovell Federal Health Care Center',
                    links: [],
                    url: {
                      path: '/lovell-federal-health-care-va/locations/captain-james-a-lovell-federal-health-care-center',
                    },
                    lovellSection: 'va',
                  },
                ],
                url: { path: '/lovell-federal-health-care-va/locations' },
                lovellSection: 'va',
              },
              {
                description: 'TRICARE locations',
                expanded: false,
                label: 'Locations',
                links: [
                  {
                    description: null,
                    expanded: false,
                    label: 'Captain James A. Lovell Federal Health Care Center',
                    links: [],
                    url: {
                      path: '/lovell-federal-health-care-tricare/locations/captain-james-a-lovell-federal-health-care-center',
                    },
                    lovellSection: 'tricare',
                  },
                ],
                url: {
                  path: '/lovell-federal-health-care-tricare/locations',
                },
                lovellSection: 'tricare',
              },
            ],
            url: { path: '' },
            lovellSection: 'both',
          },
          {
            description: null,
            expanded: false,
            label: 'NEWS AND EVENTS',
            links: [
              {
                description: null,
                expanded: false,
                label: 'Events',
                links: [],
                url: { path: '/lovell-federal-health-care-va/events' },
                lovellSection: 'va',
              },
              {
                description: null,
                expanded: false,
                label: 'Events',
                links: [],
                url: { path: '/lovell-federal-health-care-tricare/events' },
                lovellSection: 'tricare',
              },
            ],
            url: { path: '' },
            lovellSection: 'both',
          },
        ],
        url: { path: '/lovell-federal-health-care' },
        lovellSection: 'both',
      },
    ],
  },
}
