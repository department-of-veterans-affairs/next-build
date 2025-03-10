import * as React from 'react'
import { useState } from 'react'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import dynamic from 'next/dynamic'
import {
  RESOURCE_TYPES,
  PARAGRAPH_RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'

// Dynamically import ReactJson to avoid SSR issues
const DynamicReactJson = dynamic(
  () => import('react-json-view').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="vads-u-padding--2 vads-u-color--gray">
        Loading JSON viewer...
      </div>
    ),
  }
)

/**
 * This is a simple page used to return serialized but unformatted data for use
 * in our mocks. Ideally I would like it to become an interactive query explorer.
 */

/**
 * Simple JSON syntax highlighter component
 */
const SyntaxHighlightedJson: React.FC<{ data: unknown }> = ({ data }) => {
  const jsonString = JSON.stringify(data, null, 2)

  // Basic syntax highlighting with improved regex
  const highlightedJson = jsonString
    // Property names (keys) - only color the quotes and preserve the exact key name
    .replace(
      /(")(.*?)":/g,
      '<span class="vads-u-color--primary">$1</span>$2<span class="vads-u-color--primary">"</span>:'
    )
    // String values
    .replace(/: "([^"]+)"/g, ': <span class="vads-u-color--green">"$1"</span>')
    // Booleans and null
    .replace(
      /: (true|false|null)\b/g,
      ': <span class="vads-u-color--secondary">$1</span>'
    )
    // Numbers
    .replace(/: (\d+)/g, ': <span class="vads-u-color--gold">$1</span>')

  return (
    <pre
      className="usa-code-sample vads-u-margin-top--2"
      style={{
        backgroundColor: 'white',
        maxHeight: 'none',
        height: 'auto',
        padding: '1rem',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        fontFamily: 'Monaco, monospace',
        border: '1px solid #d6d7d9',
        borderRadius: '4px',
      }}
    >
      <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
    </pre>
  )
}

interface Filter {
  field: string
  operator: string
  value: string
}

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
  availableRelationships: string[]
  viewMode: 'tree' | 'raw'
  filters: Filter[]
}

const AVAILABLE_RESOURCE_TYPES = {
  ...RESOURCE_TYPES,
  ...PARAGRAPH_RESOURCE_TYPES,
}

export default function ApiExplorer() {
  const [queryState, setQueryState] = useState<QueryState>({
    resourceType: 'node--health_care_local_facility',
    includes: [],
    pageLimit: 1,
    loading: false,
    error: null,
    data: null,
    debugInfo: {},
    availableRelationships: [],
    viewMode: 'tree',
    filters: [],
  })

  const handleResourceTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQueryState((prev) => ({ ...prev, resourceType: e.target.value }))
  }

  const handleIncludesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const includes = e.target.value.split('\n')
    setQueryState((prev) => ({ ...prev, includes }))
  }

  const handlePageLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryState((prev) => ({ ...prev, pageLimit: parseInt(e.target.value) }))
  }

  const toggleRelationship = (relationship: string) => {
    setQueryState((prev) => ({
      ...prev,
      includes: prev.includes.includes(relationship)
        ? prev.includes.filter((include) => include !== relationship)
        : [...prev.includes, relationship],
    }))
  }

  const addFilter = () => {
    setQueryState((prev) => ({
      ...prev,
      filters: [...prev.filters, { field: '', operator: '=', value: '' }],
    }))
  }

  const removeFilter = (index: number) => {
    setQueryState((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }))
  }

  const updateFilter = (index: number, field: keyof Filter, value: string) => {
    setQueryState((prev) => ({
      ...prev,
      filters: prev.filters.map((filter, i) =>
        i === index ? { ...filter, [field]: value } : filter
      ),
    }))
  }

  const executeQuery = async () => {
    setQueryState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const params = {
        resourceType: queryState.resourceType,
        includes: queryState.includes.filter((i) => i.trim()),
        pageLimit: queryState.pageLimit,
        filters: queryState.filters,
      }

      // Store the request info for debugging
      const debugInfo = {
        requestUrl: '/api/drupal-query',
        requestParams: params,
      }

      const response = await fetch('/api/drupal-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch data')
      }

      const data = await response.json()

      // Extract relationship names from the first item if available
      const relationships = data[0]?.relationshipNames
        ? (Object.values(data[0].relationshipNames) as string[]) // Pretty safe assumption
        : []

      setQueryState((prev) => ({
        ...prev,
        loading: false,
        data,
        debugInfo,
        availableRelationships: relationships,
      }))
    } catch (error) {
      console.error('API Error:', error)
      setQueryState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'An unknown error occurred',
        debugInfo: prev.debugInfo,
        availableRelationships: [],
      }))
    }
  }

  const toggleViewMode = () => {
    setQueryState((prev) => ({
      ...prev,
      viewMode: prev.viewMode === 'tree' ? 'raw' : 'tree',
    }))
  }

  return (
    <div
      className="vads-u-display--flex"
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel - Controls */}
      <div
        className="vads-u-padding--3 vads-u-width--half vads-u-flex--1"
        style={{
          height: '100%',
          overflowY: 'auto',
          borderRight: '1px solid #d6d7d9',
        }}
      >
        <h1 className="vads-u-font-size--h2 vads-u-margin-top--0">
          API Explorer
        </h1>

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
          {queryState.availableRelationships.length > 0 && (
            <div className="vads-u-margin-top--2">
              <h3 className="vads-u-font-size--h4">Available Relationships</h3>
              <p className="vads-u-margin-top--1 vads-u-margin-bottom--2 vads-u-color--gray">
                Click to add to includes:
              </p>
              <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-gap--1">
                {queryState.availableRelationships.map((relationship) => (
                  <button
                    key={relationship}
                    className={`usa-button usa-button-secondary ${
                      queryState.includes.includes(relationship)
                        ? 'vads-u-background-color--primary vads-u-color--white'
                        : ''
                    }`}
                    onClick={() => toggleRelationship(relationship)}
                  >
                    {relationship}
                  </button>
                ))}
              </div>
            </div>
          )}
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

        <div className="vads-u-margin-y--3">
          <label className="vads-u-display--block vads-u-margin-bottom--1">
            Filters
          </label>
          {queryState.filters.length > 0 && (
            <p>
              <strong>Note:</strong> Filtering by fields on a paragraph entity
              doesn&apos;t work right now.
            </p>
          )}
          {queryState.filters.map((filter, index) => (
            <div
              key={index}
              className="vads-u-display--flex vads-u-align-items--center vads-u-gap--1 vads-u-margin-bottom--2"
            >
              <input
                type="text"
                className="usa-input"
                placeholder="Field name"
                value={filter.field}
                onChange={(e) => updateFilter(index, 'field', e.target.value)}
                style={{ flex: 2 }}
              />
              <select
                className="usa-select"
                value={filter.operator}
                onChange={(e) =>
                  updateFilter(index, 'operator', e.target.value)
                }
                style={{ flex: 1 }}
              >
                <option value="=">=</option>
                <option value="<>">≠</option>
                <option value=">">&gt;</option>
                <option value=">=">&gt;=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
                <option value="IS NOT NULL">IS NOT NULL</option>
                <option value="IS NULL">IS NULL</option>
              </select>
              {filter.operator !== 'IS NOT NULL' &&
                filter.operator !== 'IS NULL' && (
                  <input
                    type="text"
                    className="usa-input"
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) =>
                      updateFilter(index, 'value', e.target.value)
                    }
                    style={{ flex: 2 }}
                  />
                )}
              <button
                className="usa-button usa-button--secondary"
                onClick={() => removeFilter(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="usa-button usa-button--outline"
            onClick={addFilter}
            type="button"
          >
            Add Filter
          </button>
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
      </div>

      {/* Right Panel - JSON Output */}
      <div
        className="vads-u-padding--3 vads-u-width--half vads-u-background-color--gray-lightest vads-u-flex--1"
        style={{
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between">
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Response
          </h2>
          {queryState.data && (
            <button
              className="usa-button usa-button-secondary"
              onClick={toggleViewMode}
            >
              {queryState.viewMode === 'tree' ? 'View Raw' : 'View Tree'}
            </button>
          )}
        </div>

        {queryState.data ? (
          queryState.viewMode === 'tree' ? (
            <div className="vads-u-margin-top--2">
              <DynamicReactJson
                src={queryState.data as object}
                theme="rjv-default"
                style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #d6d7d9',
                }}
                displayDataTypes={false}
                enableClipboard
                collapsed={2}
                name={null}
              />
            </div>
          ) : (
            <SyntaxHighlightedJson data={queryState.data} />
          )
        ) : (
          <p className="vads-u-color--gray">
            Execute a query to see the response
          </p>
        )}
      </div>
    </div>
  )
}
