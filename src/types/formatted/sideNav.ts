// These SideNav types are what the vets-website widget expects
export type SideNavData = {
  name: string
  description: string
  links: SideNavItem[]
}

export type SideNavItem = {
  description: string
  expanded: boolean
  label: string
  links: SideNavItem[]
  url: { path: string }
  lovellSection?: string
}

export type SideNavMenu = {
  rootPath: string
  data: SideNavData
}
