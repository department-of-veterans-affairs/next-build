// TypeScript stub for @department-of-veterans-affairs/component-library/dist/react-bindings
// This provides type-safe exports while avoiding React 19 compatibility issues in the actual library

import { ComponentType, FC } from 'react'

// All VA components are typed as generic React components to bypass strict checking
export const VaPromoBanner: FC<any>
export const VaBanner: FC<any>
export const VaAlert: FC<any>
export const VaAlertExpandable: FC<any>
export const VaModal: FC<any>
export const VaTextInput: FC<any>
export const VaTextarea: FC<any>
export const VaTable: FC<any>
export const VaPagination: FC<any>
export const VaDropdown: FC<any>
export const VaDropdownOption: FC<any>

// defineCustomElements function
export const defineCustomElements: () => void

// Default export (if needed)
declare const componentLibrary: {
  VaPromoBanner: FC<any>
  VaBanner: FC<any>
  VaAlert: FC<any>
  VaAlertExpandable: FC<any>
  VaModal: FC<any>
  VaTextInput: FC<any>
  VaTextarea: FC<any>
  VaTable: FC<any>
  VaPagination: FC<any>
  VaDropdown: FC<any>
  VaDropdownOption: FC<any>
  defineCustomElements: () => void
}

export default componentLibrary
