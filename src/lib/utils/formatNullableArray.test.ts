/**
 * @jest-environment node
 */

import { formatNullableArray } from './formatNullableArray'

describe('formatArray', () => {
  test('returns null when input is null', () => {
    expect(formatNullableArray(null, (x) => x)).toBeNull()
  })

  test('returns null when input is undefined', () => {
    expect(formatNullableArray(undefined, (x) => x)).toBeNull()
  })

  test('returns null when filtered result is empty', () => {
    expect(formatNullableArray([1, 2, 3], () => null)).toBeNull()
  })

  test('filters out null values and returns array', () => {
    const result = formatNullableArray([1, 2, 3], (x) => (x === 2 ? null : x))
    expect(result).toEqual([1, 3])
  })

  test('returns null when all items format to null', () => {
    const result = formatNullableArray([1, 2, 3], () => null)
    expect(result).toBeNull()
  })

  test('returns formatted array when all items format successfully', () => {
    const result = formatNullableArray([1, 2, 3], (x) => x * 2)
    expect(result).toEqual([2, 4, 6])
  })
})
