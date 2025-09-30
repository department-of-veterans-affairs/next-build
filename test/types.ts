import { SideNavMenu } from '@/types/formatted/sideNav'

// Extend window type for testing
declare global {
  interface Window {
    sideNav?: SideNavMenu
  }
}
