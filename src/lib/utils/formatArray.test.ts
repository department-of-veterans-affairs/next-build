/**
 * @jest-environment node
 */

import { formatArray } from './formatArray'

describe('formatArray', () => {
  test('returns null when input is null', () => {
    expect(formatArray(null, (x) => x)).toBeNull()
  })

  test('returns null when input is undefined', () => {
    expect(formatArray(undefined, (x) => x)).toBeNull()
  })

  test('returns null when filtered result is empty', () => {
    expect(formatArray([1, 2, 3], () => null)).toBeNull()
  })

  test('filters out null values and returns array', () => {
    const result = formatArray([1, 2, 3], (x) => (x === 2 ? null : x))
    expect(result).toEqual([1, 3])
  })

  test('returns null when all items format to null', () => {
    const result = formatArray([1, 2, 3], () => null)
    expect(result).toBeNull()
  })

  test('returns formatted array when all items format successfully', () => {
    const result = formatArray([1, 2, 3], (x) => x * 2)
    expect(result).toEqual([2, 4, 6])
  })
})
