import { MediaImage } from '@/types/formatted/media'

export type StaffProfile = {
  id: string
  name: string
  thumbnail?: MediaImage
  linkToBio?: boolean
  path?: string | null
  description?: string
  phone?: string
  email?: string
}
