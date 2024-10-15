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

const medalliaSurveys = {
  urls: {
    '/search': {
      production: SURVEY_NUMBERS.SEARCH_PROD,
      staging: SURVEY_NUMBERS.SEARCH_STAGING,
    },
    '/contact-us/virtual-agent': {
      production: SURVEY_NUMBERS.CONTACT_US_VIRTUAL_AGENT_PROD,
      staging: SURVEY_NUMBERS.CONTACT_US_VIRTUAL_AGENT_STAGING,
    },
    '/school-administrators': {
      production: SURVEY_NUMBERS.SCHOOL_ADMINISTRATORS_PROD,
      staging: SURVEY_NUMBERS.SCHOOL_ADMINISTRATORS_STAGING,
    },
  },
  urlsWithSubPaths: {
    '/health-care': {
      production: SURVEY_NUMBERS.HEALTH_CARE_PROD,
      staging: SURVEY_NUMBERS.HEALTH_CARE_STAGING,
    },
    '/my-health/medical-records/summaries-and-notes/visit-summary': {
      production: SURVEY_NUMBERS.VISIT_SUMMARY_PROD,
      staging: SURVEY_NUMBERS.VISIT_SUMMARY_STAGING,
    },
    '/resources': {
      production: SURVEY_NUMBERS.DEFAULT_PROD_SURVEY,
      staging: SURVEY_NUMBERS.DEFAULT_STAGING_SURVEY,
    },
  },
};

export function getSurveyNumber(url: string, isProduction = false): number {
  const defaultSurvey = isProduction ?
    SURVEY_NUMBERS.DEFAULT_PROD_SURVEY :
    SURVEY_NUMBERS.DEFAULT_STAGING_SURVEY

  const buildEnv = isProduction ? 'production' : 'staging'

  if (typeof url !== 'string' || url === null) {
    return defaultSurvey
  }

  // Check for exact path match
  if (url in medalliaSurveys.urls) {
    const surveyInfo = medalliaSurveys.urls[url]

    return (
      surveyInfo[buildEnv] ||
      defaultSurvey
    )
  }

  // Check for subpath match
  for (const [subpath, surveyInfo] of Object.entries(
    medalliaSurveys.urlsWithSubPaths,
  )) {
    if (url.startsWith(subpath)) {
      return (
        surveyInfo[buildEnv] ||
        defaultSurvey
      )
    }
  }

  return defaultSurvey
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
