/**
 * @jest-environment node
 */

import { formatter, params } from '../staticPathResources'

const mockResourcesWithAdmin = [
  {
    id: '1',
    type: 'node--type',
    path: {
      alias: '/test-path-1',
      pid: 100,
      langcode: 'en',
    },
    langcode: 'en',
    status: true,
    field_administration: {
      drupal_internal__tid: 10,
      name: 'Administration 1',
    },
  },
  {
    id: '2',
    type: 'node--type',
    path: {
      alias: '/test-path-2',
      pid: 101,
      langcode: 'en',
    },
    langcode: 'en',
    status: true,
    field_administration: null,
  },
  {
    id: '3',
    type: 'node--type',
    path: {
      alias: null,
      pid: 101,
      langcode: 'en',
    },
    langcode: 'en',
    status: true,
    field_administration: null,
  },
  {
    id: '4',
    type: 'node--type',
    path: null,
    langcode: 'en',
    status: true,
    field_administration: null,
  },
]

describe('DrupalJsonApiParams configuration for static paths', () => {
  test('params function sets the correct fields and includes', () => {
    const paramsInstance = params('node--event')
    const queryString = decodeURIComponent(paramsInstance.getQueryString())

    expect(queryString).toContain('field_administration')
    expect(queryString).toContain('title')
    expect(queryString).toContain('path')
    expect(queryString).toContain('include=field_administration')
    expect(queryString).not.toContain(
      'filter[field_complete_biography_create]=1'
    )
  })
  test('params function sets the correct fields, includes, and filters for profile', () => {
    const paramsInstance = params('node--person_profile')
    const queryString = decodeURIComponent(paramsInstance.getQueryString())

    expect(queryString).toContain('field_administration')
    expect(queryString).toContain('title')
    expect(queryString).toContain('path')
    expect(queryString).toContain('include=field_administration')
    expect(queryString).toContain('filter[field_complete_biography_create]=1')
  })
})

describe('Static paths formatter', () => {
  test('formats data correctly with administration', () => {
    const formattedData = formatter(mockResourcesWithAdmin)

    expect(formattedData[0].path).toBe('/test-path-1')
    expect(formattedData[0].administration.id).toBe(10)
    expect(formattedData[0].administration.name).toBe('Administration 1')

    expect(formattedData[1].path).toBe('/test-path-2')
    expect(formattedData[1].administration.id).toBeNull()
    expect(formattedData[1].administration.name).toBeNull()
  })
  test('filters out resources without a path', () => {
    const formattedData = formatter(mockResourcesWithAdmin)

    expect(formattedData.length).toBe(2)
    expect(formattedData[0].path).toBe('/test-path-1')
    expect(formattedData[1].path).toBe('/test-path-2')
  })
})
