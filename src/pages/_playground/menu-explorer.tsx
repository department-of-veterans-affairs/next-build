import * as React from 'react'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

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
 * Internal tool for exploring Drupal menu data
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

interface QueryState {
  menuName: string
  loading: boolean
  error: string | null
  data: unknown
  debugInfo: {
    requestUrl?: string
    requestParams?: unknown
  }
  viewMode: 'tree' | 'raw'
  useAuthentication: boolean
}

// Common menu names for quick access
const commonMenus = [
  'main',
  'footer',
  'footer-bottom-rail',
  'outreach-and-events',
  'about-va',
  'account',
  'burials-and-memorials-benef',
  'careers-employment-benefits',
  'decision-reviews-benefits-h',
  'disability-benefits-hub',
  'education-benefits-hub',
  'health-care-benefits-hub',
  'housing-assistance-benefits',
  'life-insurance-benefits-hub',
  'pension-benefits-hub',
  'records-benefits-hub',
  'root-benefits-hub',
  'family-and-caregiver-benefits',
]

// Helper functions for URL state management
const getUrlParams = () => {
  if (typeof window === 'undefined') return {}

  const urlParams = new URLSearchParams(window.location.search)
  return {
    menuName: urlParams.get('menuName'),
    viewMode: urlParams.get('viewMode'),
  }
}

const setUrlParams = (queryState: QueryState) => {
  const urlParams = new URLSearchParams()

  if (queryState.menuName) {
    urlParams.set('menuName', queryState.menuName)
  }
  if (queryState.viewMode !== 'tree') {
    urlParams.set('viewMode', queryState.viewMode)
  }

  // Update URL without page reload
  const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`
  window.history.pushState({}, '', newUrl)
}

export default function MenuExplorer() {
  const [queryState, setQueryState] = useState<QueryState>({
    menuName: '',
    loading: false,
    error: null,
    data: null,
    debugInfo: {},
    viewMode: 'tree',
    useAuthentication: false,
  })

  // Initialize state from URL parameters on first render
  useEffect(() => {
    const urlParams = getUrlParams()

    setQueryState((prev) => ({
      ...prev,
      menuName: urlParams.menuName || '',
      viewMode: (urlParams.viewMode as 'tree' | 'raw') || 'tree',
    }))
  }, []) // Only run once on mount

  // Update document title when queryState changes
  useEffect(() => {
    document.title = queryState.menuName
      ? `Menu Explorer - ${queryState.menuName}`
      : 'Menu Explorer'
  }, [queryState.menuName])

  const handleMenuNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryState((prev) => ({ ...prev, menuName: e.target.value }))
  }

  const selectCommonMenu = (menuName: string) => {
    setQueryState((prev) => ({ ...prev, menuName }))
  }

  const executeQuery = async () => {
    if (!queryState.menuName.trim()) {
      setQueryState((prev) => ({
        ...prev,
        error: 'Please enter a menu name',
      }))
      return
    }

    // Save our params to the URL query string for sharing and persistence
    setUrlParams(queryState)

    // Set loading state
    setQueryState((prev) => ({ ...prev, loading: true, error: null }))

    // Execute API call with current state values
    const params = {
      menuName: queryState.menuName,
      useAuthentication: queryState.useAuthentication,
    }

    try {
      // Store the request info for debugging
      const debugInfo = {
        requestUrl: '/api/menu-query',
        requestParams: params,
      }

      const response = await fetch('/api/menu-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch menu data')
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

  const toggleViewMode = () => {
    setQueryState((prev) => ({
      ...prev,
      viewMode: prev.viewMode === 'tree' ? 'raw' : 'tree',
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeQuery()
    }
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
          Menu Explorer
        </h1>
        <p className="vads-u-color--gray vads-u-margin-top--0">
          Enter a menu name or ID to fetch and display its structure
        </p>

        <div className="vads-u-margin-y--3">
          <label
            className="vads-u-display--block vads-u-margin-bottom--1"
            htmlFor="menuName"
          >
            Menu Name or ID
          </label>
          <input
            id="menuName"
            type="text"
            className="usa-input"
            value={queryState.menuName}
            onChange={handleMenuNameChange}
            onKeyPress={handleKeyPress}
            placeholder="e.g. main, footer, footer-bottom-rail"
          />
        </div>

        {commonMenus.length > 0 && (
          <div className="vads-u-margin-y--3">
            <h3 className="vads-u-font-size--h4">Common Menus</h3>
            <p className="vads-u-margin-top--1 vads-u-margin-bottom--2 vads-u-color--gray">
              Click to select:
            </p>
            <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-gap--1">
              {commonMenus.map((menu) => (
                <button
                  key={menu}
                  className={`usa-button usa-button-secondary ${
                    queryState.menuName === menu
                      ? 'vads-u-background-color--primary vads-u-color--white'
                      : ''
                  }`}
                  onClick={() => selectCommonMenu(menu)}
                  style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                >
                  {menu}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="vads-u-margin-y--3">
          {/* The `vads-u-position--relative` fixes not actually having USWDS classes. TODO: Use VADS components for these pages. */}
          <div className="usa-checkbox vads-u-position--relative">
            <input
              className="usa-checkbox__input"
              id="useAuthentication"
              type="checkbox"
              checked={queryState.useAuthentication}
              onChange={(e) =>
                setQueryState((prev) => ({
                  ...prev,
                  useAuthentication: e.target.checked,
                }))
              }
            />
            <label className="usa-checkbox__label" htmlFor="useAuthentication">
              Use authentication
            </label>
          </div>
        </div>

        <button
          className="usa-button"
          onClick={executeQuery}
          disabled={queryState.loading || !queryState.menuName.trim()}
        >
          {queryState.loading ? 'Loading...' : 'Fetch Menu'}
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
            Enter a menu name and click &quot;Fetch Menu&quot; to see the
            response
          </p>
        )}
      </div>
    </div>
  )
}
