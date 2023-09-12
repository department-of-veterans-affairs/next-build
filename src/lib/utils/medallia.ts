type KampyleOnsiteSdk = Window &
  typeof globalThis & {
    KAMPYLE_ONSITE_SDK: {
      loadForm: (number) => boolean
      showForm: (number) => boolean
    }
    vaSurvey: string
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
