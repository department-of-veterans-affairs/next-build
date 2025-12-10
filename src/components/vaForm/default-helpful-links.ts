import { LinkTeaser } from '../linkTeaser/formatted-type'

export const defaultHelpfulLinks: LinkTeaser[] = [
  {
    id: 'change-direct-deposit',
    title: 'Change your direct deposit information',
    uri: '/change-direct-deposit',
    summary:
      'Find out how to update your direct deposit information online for disability compensation, pension, or education benefits.',
  },
  {
    id: 'change-address',
    title: 'Change your address',
    uri: '/change-address',
    summary:
      'Find out how to change your address and other information in your VA.gov profile for disability compensation, claims and appeals, VA health care, and other benefits.',
  },
  {
    id: 'get-military-records',
    title: 'Request your military records, including DD214',
    uri: '/records/get-military-service-records/',
    summary:
      'Submit an online request to get your DD214 or other military service records through the milConnect website.',
  },
  {
    id: 'get-va-records',
    title: 'Get your VA records and documents online',
    uri: '/records/',
    summary:
      'Learn how to access your VA records, benefit letters, and documents online.',
  },
] as LinkTeaser[] // Doesn't have all the overhead like type, parent field, options, etc.
