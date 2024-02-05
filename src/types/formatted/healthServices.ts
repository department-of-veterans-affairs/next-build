export interface HealthService {
  name: string
  vetCenterTypeOfCare: string | null
  vetCenterFriendlyName: string | null
  alsoKnownAs: string | null
  vetCenterComConditions: string | null
  commonlyTreatedCondition: string | null
  vetCenterServiceDescription: string | null
  description: string | null
  body: string | null
}

export type HealthServices = HealthService[]
