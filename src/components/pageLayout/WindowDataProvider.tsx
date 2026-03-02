'use client'

import { useEffect } from 'react'
import { FooterLink } from '@/components/footer/formatted-type'
import { MegaMenuSection } from '@/components/header/formatted-type'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  VetsGov?: {
    headerFooter?: {
      footerData?: FooterLink[]
      megaMenuData?: MegaMenuSection[]
    }
  }
}
declare const window: customWindow

interface WindowDataProviderProps {
  footerData: FooterLink[]
  megaMenuData: MegaMenuSection[]
}

/**
 * Client component that initializes window.VetsGov for vets-website widgets.
 * Extracted from PageLayout to allow PageLayout to be a server component.
 */
export function WindowDataProvider({
  footerData,
  megaMenuData,
}: WindowDataProviderProps) {
  useEffect(() => {
    // Place header & footer data on window object for vets-website widgets
    window.VetsGov = {}
    window.VetsGov.headerFooter = {
      footerData,
      megaMenuData,
    }
  }, [footerData, megaMenuData])

  return null
}
