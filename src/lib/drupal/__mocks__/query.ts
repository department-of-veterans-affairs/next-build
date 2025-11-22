/**
 * Jest mock module for @/lib/drupal/query
 *
 * This module provides Jest mock functions for:
 * - fetchSingleResourceCollectionPage
 * - fetchAndConcatAllResourceCollectionPages
 * - getMenu
 * - fetchSingleEntityOrPreview
 *
 * It also re-exports the original:
 * - entityBaseFields
 *
 * Usage in tests:
 *   jest.mock('@/lib/drupal/query')
 *   import { fetchSingleEntityOrPreview } from '@/lib/drupal/query'
 *   fetchSingleEntityOrPreview.mockResolvedValue(mockData)
 */

const originalModule = jest.requireActual('@/lib/drupal/query')

export const fetchSingleResourceCollectionPage = jest.fn()

// Re-export the original entityBaseFields
export const { entityBaseFields } = originalModule

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResourceCollectionMock = jest.Mock | ((...args: any[]) => any)

const collectionResourceMocks = new Map<string, ResourceCollectionMock>()

/**
 * The default mock implementation for the fetchAndConcatAllResourceCollectionPages
 * function will call a specific mock function based on the node type. You can provide a
 * custom mock function for a specific node type by calling this function.
 */
export function setResourceCollectionMock(
  nodeType: string,
  mock: ResourceCollectionMock
) {
  collectionResourceMocks.set(nodeType, mock)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchAndConcatAllResourceCollectionPages = jest.fn(
  (nodeType: string, ...args: any[]) => {
    if (collectionResourceMocks.has(nodeType)) {
      return (
        collectionResourceMocks.get(nodeType)?.(nodeType, ...args) ?? {
          data: [],
        }
      )
    }
    throw new Error(`No mock found for node type: ${nodeType}`)
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SingleEntityMock = jest.Mock | ((...args: any[]) => any)

const singleEntityMocks = new Map<string, SingleEntityMock>()

/**
 * The default mock implementation for the fetchSingleEntityOrPreview function will call
 * a specific mock function based on the node type. You can provide a default mock
 * mock function by calling this function.
 */
export function setSingleEntityMock(nodeType: string, mock: SingleEntityMock) {
  singleEntityMocks.set(nodeType, mock)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchSingleEntityOrPreview = jest.fn(
  (opts: any, type: string, ...args: any[]) => {
    if (singleEntityMocks.has(type)) {
      return singleEntityMocks.get(type)?.(opts, type, ...args)
    }
    throw new Error(`No mock found for node type: ${type}`)
  }
)

export const getMenu = jest.fn()
