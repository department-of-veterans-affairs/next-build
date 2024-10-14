type KampyleOnsiteSdk = Window &
  typeof globalThis & {
    KAMPYLE_ONSITE_SDK: {
      loadForm: (formNumber: number) => boolean
      showForm: (formNumber: number) => boolean
    }
    vaSurvey: string
  }

const SURVEY_NUMBERS = {
  DEFAULT_STAGING_SURVEY: 11,
  DEFAULT_PROD_SURVEY: 17,
  SEARCH_PROD: 21,
  SEARCH_STAGING: 20,
  CONTACT_US_VIRTUAL_AGENT_PROD: 25,
  CONTACT_US_VIRTUAL_AGENT_STAGING: 26,
  SCHOOL_ADMINISTRATORS_PROD: 17,
  SCHOOL_ADMINISTRATORS_STAGING: 37,
  HEALTH_CARE_PROD: 17,
  HEALTH_CARE_STAGING: 41,
  VISIT_SUMMARY_PROD: 17,
  VISIT_SUMMARY_STAGING: 41,
}

const vagovstagingsurveys = {
  '/search': 20,
  '/contact-us/virtual-agent': 26,
}

const vagovprodsurveys = {
  '/search': 21,
  '/contact-us/virtual-agent': 25,
}

function trimSlash(url: string): string {
  if (url.length === 0) return
  return url.charAt(url.length - 1) === '/' ? url.slice(0, url.length - 1) : url
}

export function getSurveyNumber(url: string, isProduction = false): number {
  const pathUrl = trimSlash(url.toString())
  if (isProduction) {
    return vagovprodsurveys[pathUrl] ? vagovprodsurveys[pathUrl] : 17
  } else {
    return vagovstagingsurveys[pathUrl] ? vagovstagingsurveys[pathUrl] : 11
  }
}

export function loadForm(formNumber: number): boolean {
  const KAMPYLE_ONSITE_SDK = (window as KampyleOnsiteSdk).KAMPYLE_ONSITE_SDK
  if (KAMPYLE_ONSITE_SDK) {
    return KAMPYLE_ONSITE_SDK.loadForm(formNumber)
  }
}

export function showForm(formNumber: number): boolean {
  const KAMPYLE_ONSITE_SDK = (window as KampyleOnsiteSdk).KAMPYLE_ONSITE_SDK
  if (KAMPYLE_ONSITE_SDK) {
    return KAMPYLE_ONSITE_SDK.showForm(formNumber)
  }
}

export function onMedalliaLoaded(callback: () => void): void {
  const KAMPYLE_ONSITE_SDK = (window as KampyleOnsiteSdk).KAMPYLE_ONSITE_SDK
  if (KAMPYLE_ONSITE_SDK) {
    callback()
  } else {
    window.addEventListener('neb_OnsiteLoaded', callback)
  }
}

export function setWindowVaSurvey(value: string): void {
  ;(window as KampyleOnsiteSdk).vaSurvey = value
}
