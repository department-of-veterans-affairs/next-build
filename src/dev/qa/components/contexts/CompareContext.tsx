/**
 * CompareContext - Provides static comparison data and callbacks
 *
 * Contains values that don't change during a comparison session:
 * - Environment labels (env1Label, env2Label)
 * - Callbacks for accepting/unaccepting differences
 * - Callback for adding comments
 */

import * as React from 'react'

export interface CompareContextValue {
  env1Label: string
  env2Label: string
  onAcceptDifference?: (nodeId: string, differenceIndex: number) => void
  onUnacceptDifference?: (nodeId: string, differenceIndex: number) => void
  onAddComment?: (nodeId: string, comment: string) => void
}

const CompareContext = React.createContext<CompareContextValue | undefined>(
  undefined
)

export interface CompareProviderProps {
  children: React.ReactNode
  value: CompareContextValue
}

export const CompareProvider: React.FC<CompareProviderProps> = ({
  children,
  value,
}) => {
  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  )
}

export const useCompare = (): CompareContextValue => {
  const context = React.useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider')
  }
  return context
}
