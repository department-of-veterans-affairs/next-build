/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { params, formatter } from './query'
import { ParagraphStaffProfile } from '@/types/drupal/paragraph'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockData from './mock.json'
import { NodePersonProfile } from '@/types/drupal/node'

const StaffProfileParagraphMock = mockData as unknown as ParagraphStaffProfile

describe('DrupalJsonApiParams configuration', () => {
  test('params function returns DrupalJsonApiParams instance', () => {
    const queryParams = params()
    expect(queryParams).toBeInstanceOf(Object)
    expect(queryParams.getQueryString).toBeDefined()
  })
})

describe('StaffProfileParagraph formatter', () => {
  test('formats valid staff profile paragraph data correctly', () => {
    const result = formatter(StaffProfileParagraphMock)

    expect(result).toBeDefined()
    expect(result?.type).toBe('paragraph--staff_profile')
    expect(result?.id).toBe('5d77166a-ed09-400c-b858-d7798cd12f04')
    expect(result?.entityId).toBe(182998)
    expect(result?.firstName).toBe('Bob')
    expect(result?.lastName).toBe('Askey')
    expect(result?.suffix).toBe('MBA, AAS CA')
    expect(result?.emailAddress).toBeNull()
    expect(result?.description).toBeDefined()
    expect(result?.introText).toBeDefined()
    expect(result?.body).toBeDefined()
    expect(result?.media).toBeDefined()
    expect(result?.media.alt).toBe(
      'Photo of Bob Askey, Acting associate director for support services'
    )
    expect(result?.completeBiographyCreate).toBeDefined()
    expect(result?.photoAllowHiresDownload).toBeDefined()
    expect(result?.vamcTitle).toBeDefined()
  })

  test('returns null for inactive status', () => {
    const inactiveData: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      status: false,
    }

    const result = formatter(inactiveData)
    expect(result).toBeNull()
  })

  test('returns null for archived profiles', () => {
    const archivedData: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      // In the unauthenticated queries, it just won't hydrate the field_staff_profile
      // object if it's archived
      field_staff_profile: {
        id: '5d77166a-ed09-400c-b858-d7798cd12f04',
        type: 'paragraph--staff_profile',
        resourceIdObjMeta: {},
      } as unknown as NodePersonProfile,
    }
    const result = formatter(archivedData)
    expect(result).toBeNull()
  })

  test('handles missing field_staff_profile gracefully', () => {
    const dataWithoutProfile: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      field_staff_profile: null,
    } as unknown as ParagraphStaffProfile

    expect(() => formatter(dataWithoutProfile)).toThrow()
  })

  test('handles missing optional fields gracefully', () => {
    const minimalData: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      field_staff_profile: {
        ...StaffProfileParagraphMock.field_staff_profile,
        field_suffix: null,
        field_description: null,
        field_intro_text: null,
        field_body: null,
        field_media: null,
        field_complete_biography_create: null,
        field_photo_allow_hires_download: null,
      },
    }

    const result = formatter(minimalData)

    expect(result).toBeDefined()
    expect(result?.suffix).toBeNull()
    expect(result?.description).toBeNull()
    expect(result?.introText).toBeNull()
    expect(result?.body).toBeNull()
    expect(result?.media).toBeDefined()
    expect(result?.completeBiographyCreate).toBeNull()
    expect(result?.photoAllowHiresDownload).toBeNull()
  })

  test('handles missing field_office gracefully', () => {
    const dataWithoutOffice: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      field_office: null,
    }

    const result = formatter(dataWithoutOffice)

    expect(result).toBeDefined()
    expect(result?.vamcTitle).toBeNull()
  })

  test('handles missing field_telephone gracefully', () => {
    const dataWithoutTelephone: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      field_telephone: null,
    }

    const result = formatter(dataWithoutTelephone)

    expect(result).toBeDefined()
    expect(result?.phoneNumber).toBeDefined()
  })

  test('handles missing media gracefully', () => {
    const dataWithoutMedia: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      field_staff_profile: {
        ...StaffProfileParagraphMock.field_staff_profile,
        field_media: null,
      },
    }

    const result = formatter(dataWithoutMedia)

    expect(result).toBeDefined()
    expect(result?.media).toBeDefined()
    // When field_media is null, queries.formatData returns null, which is expected behavior
    expect(result?.media).toBeNull()
  })
})

describe('StaffProfileParagraph formatData integration', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        PARAGRAPH_RESOURCE_TYPES.STAFF_PROFILE,
        StaffProfileParagraphMock
      )
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    const dataWithoutAnswers: ParagraphStaffProfile = {
      ...StaffProfileParagraphMock,
      field_staff_profile: {
        ...StaffProfileParagraphMock.field_staff_profile,
        field_description: null,
        field_intro_text: null,
        field_body: null,
      },
    }

    const result = formatter(dataWithoutAnswers)

    expect(result).toBeDefined()
    expect(result?.description).toBeNull()
    expect(result?.introText).toBeNull()
    expect(result?.body).toBeNull()
  })
})
