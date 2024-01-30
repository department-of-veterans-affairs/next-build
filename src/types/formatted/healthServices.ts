
export interface HealthService {
  name: string;
  vetCenterTypeOfCare: string;
  vetCenterFriendlyName: string | null;
  alsoKnownAs: string | null;
  vetCenterComConditions: string | null;
  commonlyTreatedCondition: string | null;
  vetCenterServiceDescription: string;
  description: string;
  body: string | null;
}

export type HealthServices = HealthService[];
