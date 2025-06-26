import { SidebarData } from '@/products/staffProfile/formatted-type'

export const buildStaffProfileSidebarData = (
  title: string,
  fieldOfficePath: string
): SidebarData => {
  const formattedTitle = title.replace(/&quot;/g, '"')
  const leadershipPath = '/about-us/leadership'

  return {
    depth: 5,
    link: {
      label: formattedTitle,
      url: { path: '/' },
      links: [],
    },
    parent: {
      label: 'Leadership',
      links: [],
      url: { path: `${fieldOfficePath}${leadershipPath}` },
    },
  }
}
