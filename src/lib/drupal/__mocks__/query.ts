/**
 * Jest mock module for @/lib/drupal/query
 *
 * This module provides Jest mock functions for:
 * - fetchSingleResourceCollectionPage
 * - fetchAndConcatAllResourceCollectionPages
 * - getMenu
 * - fetchSingleEntityOrPreview
 *
 * It also provides these helper functions for setting various mock functions:
 * - setSingleEntityMock
 * - setResourceCollectionMock
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const fetchSingleResourceCollectionPage = jest.fn()

type ResourceCollectionMock = jest.Mock | ((...args: any[]) => any)

const collectionResourceMocks = new Map<string, ResourceCollectionMock>()

/**
 * The default mock implementation for the fetchAndConcatAllResourceCollectionPages
 * function will call a specific mock function based on the node type. Use this function
 * to set the mock function that all requests for a specific node type will be routed to.
 */
export function setResourceCollectionMock(
  nodeType: string,
  mock: ResourceCollectionMock
) {
  collectionResourceMocks.set(nodeType, mock)
}

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

type SingleEntityMock = jest.Mock | ((...args: any[]) => any)

const singleEntityMocks = new Map<string, SingleEntityMock>()

/**
 * The default mock implementation for the fetchSingleEntityOrPreview function will call
 * a specific mock function based on the node type. Use this function to set the mock
 * function that all requests for a specific node type will be routed to.
 */
export function setSingleEntityMock(nodeType: string, mock: SingleEntityMock) {
  singleEntityMocks.set(nodeType, mock)
}

export const fetchSingleEntityOrPreview = jest.fn(
  (opts: any, type: string, ...args: any[]) => {
    if (singleEntityMocks.has(type)) {
      return singleEntityMocks.get(type)?.(opts, type, ...args)
    }
    throw new Error(`No mock found for node type: ${type}`)
  }
)

export const getMenu = jest.fn(() => ({
  items: [],
  tree: [],
}))
