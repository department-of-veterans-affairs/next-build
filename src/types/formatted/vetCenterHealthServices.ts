export interface VetCenterHealthService {
  name: string
  vetCenterTypeOfCare?: string
  vetCenterFriendlyName?: string
  alsoKnownAs?: string
  vetCenterComConditions?: string
  commonlyTreatedCondition?: string
  vetCenterServiceDescription?: string
  description?: string
  body?: string
}

export type VetCenterHealthServices = VetCenterHealthService[]
