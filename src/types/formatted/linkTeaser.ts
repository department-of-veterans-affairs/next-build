export type LinkTeaser = {
  id: string
  title: string
  summary: string
  uri: string
  parentField: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]
  componentParams: {
    boldTitle: boolean
    sectionHeader: string
  }
}
