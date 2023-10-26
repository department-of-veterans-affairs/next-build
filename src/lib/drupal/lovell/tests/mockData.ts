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
