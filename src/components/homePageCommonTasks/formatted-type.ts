type Link = {
  url: {
    path: string
  }
  label: string
}

export type HomePageCommonTasks = {
  searchLinks: Link[]
  popularLinks: Link[]
}
