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
  path: {
    alias: slugToPath(lovellFederalSlug),
    pid: null,
    langcode: null,
  },
  administration: LOVELL.federal.administration,
}

export const lovellTricareResource = {
  path: {
    alias: slugToPath(lovellTricareSlug),
    pid: null,
    langcode: null,
  },
  administration: LOVELL.tricare.administration,
}

export const lovellVaResource = {
  path: {
    alias: slugToPath(lovellVaSlug),
    pid: null,
    langcode: null,
  },
  administration: LOVELL.va.administration,
}

export const otherResource = {
  path: {
    alias: slugToPath(otherSlug),
    pid: null,
    langcode: null,
  },
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
    src: 'image/src',
    alt: 'alt-text',
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
  },
  listing: 'listing',
  entityId: 12345,
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
                    fieldMenuSection: 'tricare',
                  },
                ],
                url: {
                  path: '/lovell-federal-health-care-va/health-services',
                },
                fieldMenuSection: 'va',
              },
              {
                description: null,
                expanded: false,
                label: 'Health services',
                links: [],
                url: {
                  path: '/lovell-federal-health-care-tricare/health-services',
                },
                fieldMenuSection: 'tricare',
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
                    fieldMenuSection: 'va',
                  },
                ],
                url: { path: '/lovell-federal-health-care-va/locations' },
                fieldMenuSection: 'va',
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
                    fieldMenuSection: 'tricare',
                  },
                ],
                url: {
                  path: '/lovell-federal-health-care-tricare/locations',
                },
                fieldMenuSection: 'tricare',
              },
            ],
            url: { path: '' },
            fieldMenuSection: 'both',
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
                fieldMenuSection: 'va',
              },
              {
                description: null,
                expanded: false,
                label: 'Events',
                links: [],
                url: { path: '/lovell-federal-health-care-tricare/events' },
                fieldMenuSection: 'tricare',
              },
            ],
            url: { path: '' },
            fieldMenuSection: 'both',
          },
        ],
        url: { path: '/lovell-federal-health-care' },
        fieldMenuSection: 'both',
      },
    ],
  },
}
