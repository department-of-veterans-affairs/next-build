export type Alert = {
  alertType: string
  id: string
  title: string
  content: {
    header?: string
    text: string
  }
}
