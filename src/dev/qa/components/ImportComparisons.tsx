import * as React from 'react'
import { useState, useRef, useCallback } from 'react'
import type { ExportedComparisonsData } from '@/types/qa'
import styles from './ImportComparisons.module.css'

export interface ImportComparisonsProps {
  onImportSuccess: () => void
}

export const ImportComparisons: React.FC<ImportComparisonsProps> = ({
  onImportSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setLoading(true)

      try {
        // Read file
        const text = await file.text()
        const data: ExportedComparisonsData = JSON.parse(text)

        // Basic validation
        if (!data.comparisons || !Array.isArray(data.comparisons)) {
          throw new Error('Invalid file format: missing comparisons array')
        }

        // Import
        const response = await fetch('/api/qa/import-comparisons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to import comparisons')
        }

        // Success
        onImportSuccess()
      } catch (err) {
        console.error('Import error:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to import comparisons'
        )
      } finally {
        setLoading(false)
      }
    },
    [onImportSuccess]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const file = e.dataTransfer.files?.[0]
      if (file && file.type === 'application/json') {
        handleFile(file)
      } else {
        setError('Please drop a valid JSON file')
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''} ${loading ? styles.loading : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileInput}
          className={styles.fileInput}
          disabled={loading}
        />

        <va-icon icon="upload" size={4} />

        <div className={styles.text}>
          {loading ? (
            <p>Importing comparisons...</p>
          ) : (
            <>
              <p>
                <strong>Drop JSON file here</strong> or click to select
              </p>
              <p className={styles.hint}>Import comparisons from a JSON file</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <va-icon icon="error" size={3} />
          {error}
        </div>
      )}
    </div>
  )
}
