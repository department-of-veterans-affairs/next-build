/**
 * UIStateContext - Provides UI interaction state
 *
 * Contains values that change frequently during user interaction:
 * - hoveredMatchKey: Currently hovered element key
 * - onHoverMatchKey: Callback to update hovered element
 * - minVisibleDepth: Minimum depth of visible elements (for scroll)
 * - expandedTextNodes: Set of text node keys that are expanded
 * - onToggleTextExpansion: Callback to toggle text expansion
 */

import * as React from 'react'

export interface UIStateContextValue {
  hoveredMatchKey: string | null
  onHoverMatchKey: (matchKey: string | null) => void
  minVisibleDepth: number
  expandedTextNodes: Set<string>
  onToggleTextExpansion: (matchKey: string) => void
}

const UIStateContext = React.createContext<UIStateContextValue | undefined>(
  undefined
)

export interface UIStateProviderProps {
  children: React.ReactNode
  value: UIStateContextValue
}

export const UIStateProvider: React.FC<UIStateProviderProps> = ({
  children,
  value,
}) => {
  return (
    <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>
  )
}

export const useUIState = (): UIStateContextValue => {
  const context = React.useContext(UIStateContext)
  if (!context) {
    throw new Error('useUIState must be used within UIStateProvider')
  }
  return context
}
