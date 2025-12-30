import * as React from 'react'
import { useState } from 'react'
import styles from './ExportComparisons.module.css'

export interface ExportComparisonsProps {
  hasComparisons: boolean
}

export const ExportComparisons: React.FC<ExportComparisonsProps> = ({
  hasComparisons,
}) => {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/qa/export-comparisons')

      if (!response.ok) {
        throw new Error('Failed to export comparisons')
      }

      const data = await response.json()

      // Generate filename with full timestamp
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const filename = `qa-comparisons-${year}-${month}-${day}-${hours}-${minutes}-${seconds}.json`

      // Create blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting comparisons:', error)
      alert('Failed to export comparisons. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={`usa-button ${styles.exportButton}`}
      onClick={handleExport}
      disabled={!hasComparisons || loading}
      title={
        !hasComparisons
          ? 'No comparisons to export'
          : 'Export all comparisons as JSON'
      }
    >
      <va-icon icon="download" size={3} />
      {loading ? 'Exporting...' : 'Export All Comparisons'}
    </button>
  )
}
