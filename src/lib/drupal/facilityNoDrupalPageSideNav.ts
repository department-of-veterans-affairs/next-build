import { SidebarData } from '@/types/formatted/staffProfile'

export const buildSidebarData = (
  title: string,
  fieldOfficePath: string
): SidebarData => {
  const formattedTitle = title.replace(/"/g, '&quot;')
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
