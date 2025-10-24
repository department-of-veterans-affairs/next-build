import { StaffProfile } from '@/components/staffProfile/formatted-type'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type StaffProfileParagraph = PublishedParagraph &
  Pick<
    StaffProfile,
    | 'firstName'
    | 'lastName'
    | 'suffix'
    | 'emailAddress'
    | 'phoneNumber'
    | 'description'
    | 'introText'
    | 'body'
    | 'media'
    | 'completeBiographyCreate'
    | 'photoAllowHiresDownload'
    | 'vamcTitle'
  >
