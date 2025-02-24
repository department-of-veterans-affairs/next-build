import * as React from 'react'
import { useState } from 'react'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import {
  RESOURCE_TYPES,
  PARAGRAPH_RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'

/**
 * This is a simple page used to return serialized but unformatted data for use
 * in our mocks. Ideally I would like it to become an interactive query explorer.
 */

interface QueryState {
  resourceType: string
  includes: string[]
  pageLimit: number
  loading: boolean
  error: string | null
  data: unknown
  debugInfo: {
    requestUrl?: string
    requestParams?: unknown
  }
}

const AVAILABLE_RESOURCE_TYPES = {
  ...RESOURCE_TYPES,
  ...PARAGRAPH_RESOURCE_TYPES,
}

export default function ApiExplorer() {
  const [queryState, setQueryState] = useState<QueryState>({
    resourceType: 'node--health_care_local_facility',
    includes: ['field_media'],
    pageLimit: 5,
    loading: false,
    error: null,
    data: null,
    debugInfo: {},
  })

  const handleResourceTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQueryState((prev) => ({ ...prev, resourceType: e.target.value }))
  }

  const handleIncludesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const includes = e.target.value.split('\n').filter((line) => line.trim())
    setQueryState((prev) => ({ ...prev, includes }))
  }

  const handlePageLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryState((prev) => ({ ...prev, pageLimit: parseInt(e.target.value) }))
  }

  const executeQuery = async () => {
    setQueryState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const params = new DrupalJsonApiParams()
        .addInclude(queryState.includes)
        .addPageLimit(queryState.pageLimit)

      const queryParams = params.getQueryObject()

      // Store the request info for debugging
      const debugInfo = {
        requestUrl: '/api/drupal-query',
        requestParams: {
          resourceType: queryState.resourceType,
          includes: queryState.includes,
          pageLimit: queryState.pageLimit,
        },
      }

      const response = await fetch('/api/drupal-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceType: queryState.resourceType,
          includes: queryState.includes,
          pageLimit: queryState.pageLimit,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch data')
      }

      const data = await response.json()
      setQueryState((prev) => ({
        ...prev,
        loading: false,
        data,
        debugInfo,
      }))
    } catch (error) {
      console.error('API Error:', error)
      setQueryState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'An unknown error occurred',
        debugInfo: prev.debugInfo,
      }))
    }
  }

  return (
    <div className="vads-u-padding--3">
      <h1 className="vads-u-font-size--h2">API Explorer</h1>

      <div className="vads-u-margin-y--3">
        <label
          className="vads-u-display--block vads-u-margin-bottom--1"
          htmlFor="resourceType"
        >
          Resource Type
        </label>
        <select
          id="resourceType"
          className="usa-select"
          value={queryState.resourceType}
          onChange={handleResourceTypeChange}
        >
          {Object.entries(AVAILABLE_RESOURCE_TYPES).map(([key, value]) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="vads-u-margin-y--3">
        <label
          className="vads-u-display--block vads-u-margin-bottom--1"
          htmlFor="includes"
        >
          Includes (one per line)
        </label>
        <textarea
          id="includes"
          className="usa-textarea"
          value={queryState.includes.join('\n')}
          onChange={handleIncludesChange}
          rows={5}
        />
      </div>

      <div className="vads-u-margin-y--3">
        <label
          className="vads-u-display--block vads-u-margin-bottom--1"
          htmlFor="pageLimit"
        >
          Page Limit
        </label>
        <input
          id="pageLimit"
          type="number"
          className="usa-input"
          value={queryState.pageLimit}
          onChange={handlePageLimitChange}
          min={1}
          max={50}
        />
      </div>

      <button
        className="usa-button"
        onClick={executeQuery}
        disabled={queryState.loading}
      >
        {queryState.loading ? 'Loading...' : 'Execute Query'}
      </button>

      {queryState.error && (
        <div className="usa-alert usa-alert--error vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Error</h3>
            <p>{queryState.error}</p>
            <div className="vads-u-margin-top--2">
              <details>
                <summary>Debug Information</summary>
                <pre className="usa-code-sample">
                  <code>{JSON.stringify(queryState.debugInfo, null, 2)}</code>
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}

      {queryState.data && (
        <div className="vads-u-margin-y--3">
          <h2 className="vads-u-font-size--h3">Response</h2>
          <pre className="usa-code-sample">
            <code>{JSON.stringify(queryState.data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
