/**
 * DifferencesContext - Provides accepted differences and comments state
 *
 * Contains values that change when user accepts/unaccepts differences
 * or adds comments:
 * - acceptedDifferencesSet: Set of accepted difference keys
 * - commentsMap: Map of node IDs to comment strings
 */

import * as React from 'react'

export interface DifferencesContextValue {
  acceptedDifferencesSet: Set<string>
  commentsMap: Map<string, string>
}

const DifferencesContext = React.createContext<
  DifferencesContextValue | undefined
>(undefined)

export interface DifferencesProviderProps {
  children: React.ReactNode
  value: DifferencesContextValue
}

export const DifferencesProvider: React.FC<DifferencesProviderProps> = ({
  children,
  value,
}) => {
  return (
    <DifferencesContext.Provider value={value}>
      {children}
    </DifferencesContext.Provider>
  )
}

export const useDifferences = (): DifferencesContextValue => {
  const context = React.useContext(DifferencesContext)
  if (!context) {
    throw new Error('useDifferences must be used within DifferencesProvider')
  }
  return context
}
