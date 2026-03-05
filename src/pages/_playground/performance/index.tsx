import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { PAGE_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import type { PerformanceScoreRow } from '@/pages/api/performance/scores'

// Blank value maps to "Home page" (no node type for homepage)
const contentTypeOptions: { value: string; label: string }[] = [
  { value: '', label: 'Home page' },
  ...[...PAGE_RESOURCE_TYPES].sort().map((v) => ({ value: v, label: v })),
]

const ALL_FILTER = '__all__'

const isDevMode = (): boolean => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development'
  }
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost')
  )
}

const COLUMNS = [
  'Content type',
  'URL',
  'Avg mobile score',
  'Avg desktop score',
  'Version number',
  'Test date',
] as const

interface ContentTypeOption {
  value: string
  label: string
}

interface EditableCellProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  isSelect?: boolean
  options?: ContentTypeOption[]
  placeholder?: string
}

const EditableCell = React.memo<EditableCellProps>(
  ({ value, onChange, onBlur, isSelect, options, placeholder }) => {
    const [localValue, setLocalValue] = useState(value)

    useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const newVal = e.target.value
      setLocalValue(newVal)
      onChange(newVal)
    }

    const handleBlur = () => {
      onBlur?.()
    }

    if (isSelect && options) {
      return (
        <select
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #d6d7d9',
            borderRadius: '4px',
            fontFamily: 'inherit',
            fontSize: '14px',
          }}
        >
          {options.map((opt) => (
            <option key={opt.value || '__blank__'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '6px 8px',
          border: '1px solid #d6d7d9',
          borderRadius: '4px',
          fontFamily: 'inherit',
          fontSize: '14px',
        }}
      />
    )
  }
)

EditableCell.displayName = 'EditableCell'

export default function PerformancePage() {
  const [rows, setRows] = useState<PerformanceScoreRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [devMode, setDevMode] = useState(false)
  const [contentTypeFilter, setContentTypeFilter] = useState<string>(ALL_FILTER)
  const [urlFilter, setUrlFilter] = useState('')
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [editingRow, setEditingRow] = useState<PerformanceScoreRow | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [newRow, setNewRow] = useState<Partial<PerformanceScoreRow>>({})

  useEffect(() => {
    setDevMode(isDevMode())
  }, [])

  const fetchRows = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/performance/scores')
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to load')
      }
      const data = await res.json()
      setRows(data)
    } catch (err) {
      setError(err?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRows()
  }, [fetchRows])

  const contentTypeCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of rows) {
      const ct = row['Content type']
      counts.set(ct, (counts.get(ct) ?? 0) + 1)
    }
    return counts
  }, [rows])

  const filteredAndSortedRows = useMemo(() => {
    let result = [...rows]

    if (contentTypeFilter !== ALL_FILTER) {
      result = result.filter((r) => r['Content type'] === contentTypeFilter)
    }
    if (urlFilter.trim()) {
      const lower = urlFilter.toLowerCase()
      result = result.filter((r) => r.URL.toLowerCase().includes(lower))
    }

    result.sort((a, b) => {
      const ctA = a['Content type']
      const ctB = b['Content type']
      if (ctA !== ctB) {
        return ctA.localeCompare(ctB)
      }
      const vA = parseInt(a['Version number'], 10) || 0
      const vB = parseInt(b['Version number'], 10) || 0
      return vA - vB
    })

    return result
  }, [rows, contentTypeFilter, urlFilter])

  const handleCellChange = useCallback(
    (rowIndex: number, field: keyof PerformanceScoreRow, value: string) => {
      if (editingRowIndex === rowIndex && editingRow) {
        setEditingRow({ ...editingRow, [field]: value })
      }
    },
    [editingRowIndex, editingRow]
  )

  const handleSaveRow = useCallback(async () => {
    if (editingRowIndex === null || !editingRow) return

    const rowToUpdate = filteredAndSortedRows[editingRowIndex]
    const actualIndex = rows.indexOf(rowToUpdate)
    if (actualIndex === -1) {
      setError('Row not found in data')
      return
    }

    try {
      const res = await fetch('/api/performance/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          row: editingRow,
          rowIndex: actualIndex,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }
      const updated = await res.json()
      setRows((prev) => {
        const next = [...prev]
        next[actualIndex] = updated
        return next
      })
      setEditingRowIndex(null)
      setEditingRow(null)
    } catch (err) {
      setError(err?.message || 'Failed to save')
    }
  }, [editingRowIndex, editingRow, rows, filteredAndSortedRows])

  const handleCancelEdit = useCallback(() => {
    setEditingRowIndex(null)
    setEditingRow(null)
  }, [])

  const handleStartEdit = useCallback(
    (index: number) => {
      setEditingRowIndex(index)
      setEditingRow({ ...filteredAndSortedRows[index] })
    },
    [filteredAndSortedRows]
  )

  const handleAddRow = useCallback(async () => {
    const fullRow: PerformanceScoreRow = {
      'Content type':
        newRow['Content type'] ?? contentTypeOptions[0]?.value ?? '',
      URL: newRow.URL ?? '',
      'Avg mobile score': newRow['Avg mobile score'] ?? '',
      'Avg desktop score': newRow['Avg desktop score'] ?? '',
      'Version number': newRow['Version number'] ?? '',
      'Test date': newRow['Test date'] ?? '',
    }

    try {
      const res = await fetch('/api/performance/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', row: fullRow }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to add')
      }
      const added = await res.json()
      setRows((prev) => [...prev, added])
      setAddingNew(false)
      setNewRow({})
    } catch (err) {
      setError(err?.message || 'Failed to add row')
    }
  }, [newRow])

  const handleCancelAdd = useCallback(() => {
    setAddingNew(false)
    setNewRow({})
  }, [])

  return (
    <div className="vads-u-padding--3">
      <h1 className="vads-u-font-size--h2 vads-u-margin-top--0">
        Performance Scores
      </h1>

      {!devMode && (
        <div className="usa-alert usa-alert--warning vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Development Mode Required</h3>
            <p>
              Changes can only be saved when viewing on your local dev server,
              because changes are written to the CSV file in version control.
            </p>
          </div>
        </div>
      )}

      <div
        className="vads-u-margin-y--3"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <label
            className="vads-u-display--block vads-u-margin-bottom--1"
            htmlFor="contentTypeFilter"
          >
            Content Type
          </label>
          <select
            id="contentTypeFilter"
            className="usa-select"
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            style={{ minWidth: '220px' }}
          >
            <option value={ALL_FILTER}>All ({rows.length})</option>
            {contentTypeOptions.map((opt) => (
              <option key={opt.value || '__blank__'} value={opt.value}>
                {opt.label} ({contentTypeCounts.get(opt.value) ?? 0})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="vads-u-display--block vads-u-margin-bottom--1"
            htmlFor="urlFilter"
          >
            URL (substring)
          </label>
          <input
            id="urlFilter"
            type="text"
            className="usa-input"
            value={urlFilter}
            onChange={(e) => setUrlFilter(e.target.value)}
            placeholder="Filter by URL..."
            style={{ minWidth: '280px' }}
          />
        </div>
      </div>

      {error && (
        <div className="usa-alert usa-alert--error vads-u-margin-y--3">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="vads-u-margin-y--3">Loading...</p>
      ) : (
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              Rows ({filteredAndSortedRows.length})
            </h2>
            <button
              type="button"
              className="usa-button"
              onClick={() => setAddingNew(true)}
              disabled={!devMode}
            >
              Add row
            </button>
          </div>

          <div
            style={{
              overflowX: 'auto',
              border: '1px solid #d6d7d9',
              borderRadius: '4px',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                  {COLUMNS.map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #d6d7d9',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                  <th
                    style={{
                      padding: '12px 16px',
                      width: '100px',
                      borderBottom: '1px solid #d6d7d9',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {addingNew && (
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    {COLUMNS.map((col) => (
                      <td
                        key={col}
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #d6d7d9',
                          verticalAlign: 'middle',
                        }}
                      >
                        {col === 'Content type' ? (
                          <EditableCell
                            value={newRow[col] ?? ''}
                            onChange={(v) =>
                              setNewRow((prev) => ({ ...prev, [col]: v }))
                            }
                            isSelect
                            options={contentTypeOptions}
                          />
                        ) : (
                          <EditableCell
                            value={
                              newRow[col as keyof PerformanceScoreRow] ?? ''
                            }
                            onChange={(v) =>
                              setNewRow((prev) => ({
                                ...prev,
                                [col]: v,
                              }))
                            }
                            placeholder={col}
                          />
                        )}
                      </td>
                    ))}
                    <td
                      style={{
                        padding: '8px',
                        borderBottom: '1px solid #d6d7d9',
                        verticalAlign: 'middle',
                      }}
                    >
                      <button
                        type="button"
                        className="usa-button usa-button--small"
                        onClick={handleAddRow}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="usa-button usa-button-secondary usa-button--small vads-u-margin-left--1"
                        onClick={handleCancelAdd}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}
                {filteredAndSortedRows.map((row, index) => {
                  const isEditing = editingRowIndex === index

                  return (
                    <tr
                      key={`${row.URL}-${row['Version number']}-${row['Content type']}-${row['Test date']}-${index}`}
                    >
                      {COLUMNS.map((col) => (
                        <td
                          key={col}
                          style={{
                            padding: '8px',
                            borderBottom: '1px solid #d6d7d9',
                            verticalAlign: 'middle',
                          }}
                        >
                          {isEditing && editingRow ? (
                            col === 'Content type' ? (
                              <EditableCell
                                value={editingRow[col]}
                                onChange={(v) =>
                                  handleCellChange(index, col, v)
                                }
                                isSelect
                                options={contentTypeOptions}
                              />
                            ) : (
                              <EditableCell
                                value={editingRow[col]}
                                onChange={(v) =>
                                  handleCellChange(index, col, v)
                                }
                              />
                            )
                          ) : (
                            <span>
                              {col === 'Content type' && row[col] === ''
                                ? 'Home page'
                                : row[col] || '—'}
                            </span>
                          )}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #d6d7d9',
                          verticalAlign: 'middle',
                        }}
                      >
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="usa-button usa-button--small"
                              onClick={handleSaveRow}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="usa-button usa-button-secondary usa-button--small vads-u-margin-left--1"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="usa-button usa-button-secondary usa-button--small"
                            onClick={() => handleStartEdit(index)}
                            disabled={!devMode}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
