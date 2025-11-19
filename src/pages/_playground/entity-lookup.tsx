import * as React from 'react'
import { useState } from 'react'

interface PathInfo {
  jsonapi: {
    resourceName: string
  }
  entity: {
    uuid: string
  }
  resolved?: string
}

interface LookupState {
  resourcePath: string
  loading: boolean
  error: string | null
  notFound: boolean
  result: PathInfo | null
}

export default function EntityLookup() {
  const [state, setState] = useState<LookupState>({
    resourcePath: '',
    loading: false,
    error: null,
    notFound: false,
    result: null,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!state.resourcePath.trim()) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter a resource path',
        notFound: false,
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      notFound: false,
      result: null,
    }))

    try {
      const response = await fetch('/api/entity-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resourcePath: state.resourcePath }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 404) {
          setState((prev) => ({
            ...prev,
            loading: false,
            notFound: true,
            error: null,
          }))
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorData.error || 'Failed to lookup entity',
            notFound: false,
          }))
        }
        return
      }

      const data = await response.json()

      setState((prev) => ({
        ...prev,
        loading: false,
        result: data,
      }))
    } catch (error) {
      console.error('Lookup Error:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        notFound: false,
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, resourcePath: e.target.value }))
  }

  const buildApiExplorerUrl = () => {
    if (!state.result) return ''

    const filters = [
      {
        field: 'id',
        operator: '=',
        value: state.result.entity.uuid,
      },
    ]

    const params = new URLSearchParams({
      resourceType: state.result.jsonapi.resourceName,
      filters: encodeURIComponent(JSON.stringify(filters)),
      pageLimit: '1',
    })

    return `/_playground/api-explorer?${params.toString()}`
  }

  return (
    <div
      className="vads-u-padding--3"
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <h1 className="vads-u-font-size--h2 vads-u-margin-top--2">
        Entity Path Lookup
      </h1>
      <p className="vads-u-color--gray-medium">
        Enter a Drupal path to lookup its entity information
      </p>

      <form className="vads-u-margin-y--3" onSubmit={handleSubmit}>
        <label
          className="vads-u-display--block vads-u-margin-bottom--1"
          htmlFor="resourcePath"
        >
          Resource Path
        </label>
        <div className="vads-u-display--flex vads-u-gap--2 vads-u-align-items--flex-start">
          <input
            id="resourcePath"
            type="text"
            className="usa-input vads-u-flex--auto vads-u-margin--0"
            value={state.resourcePath}
            onChange={handleInputChange}
            placeholder="/pittsburgh-health-care"
          />
          <div>
            <button
              type="submit"
              className="usa-button vads-u-margin--0"
              disabled={state.loading}
            >
              {state.loading ? 'Looking up...' : 'Lookup'}
            </button>
          </div>
        </div>
        <p className="vads-u-margin-top--1 vads-u-color--gray vads-u-font-size--sm">
          Examples: /pittsburgh-health-care,
          /health-care/about-va-health-benefits
        </p>
      </form>

      {state.error && (
        <div className="usa-alert usa-alert--error vads-u-padding-y--0">
          <h3 className="vads-u-margin-top--0">Error</h3>
          <p>{state.error}</p>
        </div>
      )}

      {state.notFound && (
        <div className="vads-u-border--2px vads-u-margin-y--3 vads-u-padding--3">
          <h2 className="vads-u-margin-top--0">Path Not Found</h2>
          <p>
            The path <code>{state.resourcePath}</code> could not be found.
          </p>
          <p>Make sure the path exists in Drupal and is published.</p>
        </div>
      )}

      {state.result && (
        <div className="vads-u-border--2px vads-u-border-color--green vads-u-background-color--green-lightest vads-u-margin-y--3 vads-u-padding--3">
          <h2 className="vads-u-margin-top--0">Entity Found</h2>
          <dl>
            <dt className="vads-u-font-weight--bold vads-u-margin-top--2">
              Resource Type:
            </dt>
            <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
              <code className="vads-u-background-color--green-lighter vads-u-padding--0p5">
                {state.result.jsonapi.resourceName}
              </code>
            </dd>

            <dt className="vads-u-font-weight--bold vads-u-margin-top--2">
              Entity UUID:
            </dt>
            <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
              <code className="vads-u-background-color--green-lighter vads-u-padding--0p5">
                {state.result.entity.uuid}
              </code>
            </dd>

            {state.result.resolved && (
              <>
                <dt className="vads-u-font-weight--bold vads-u-margin-top--2">
                  Resolved Path:
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  <code className="vads-u-background-color--green-lighter vads-u-padding--0p5">
                    {state.result.resolved}
                  </code>
                </dd>
              </>
            )}
          </dl>

          <div className="vads-u-margin-top--3">
            <a
              href={buildApiExplorerUrl()}
              className="usa-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              View in API Explorer
            </a>
          </div>

          <details className="vads-u-margin-top--3">
            <summary className="vads-u-cursor--pointer">
              View Raw Response
            </summary>
            <pre className="usa-code-sample vads-u-margin-top--2">
              <code>{JSON.stringify(state.result, null, 2)}</code>
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
