import { NodeVhaFacilityNonclinicalService } from '@/types/drupal/node'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import mockBillingAndInsuranceServicesJson from './mock.billingAndInsurance.json'
import mockMedicalRecordsServicesJson from './mock.medicalRecords.json'
import mockRegisterForCareServicesJson from './mock.registerForCare.json'

/**
 * Mock services data for billing and insurance
 */
export const mockBillingAndInsuranceServices =
  mockBillingAndInsuranceServicesJson as NodeVhaFacilityNonclinicalService[]

/**
 * Mock services data for medical records
 */
export const mockMedicalRecordsServices =
  mockMedicalRecordsServicesJson as NodeVhaFacilityNonclinicalService[]

/**
 * Mock services data for register for care
 */
export const mockRegisterForCareServices =
  mockRegisterForCareServicesJson as NodeVhaFacilityNonclinicalService[]

/**
 * Extracts facility IDs from mock services data.
 * Used to create mock facilities for the two-stage query pattern.
 */
function extractFacilityIds(
  services: NodeVhaFacilityNonclinicalService[]
): string[] {
  const ids = new Set<string>()
  services.forEach((service) => {
    if (service.field_facility_location?.id) {
      ids.add(service.field_facility_location.id)
    }
  })
  return Array.from(ids)
}

/**
 * Creates mock facilities based on the facility IDs found in the services.
 * This supports the two-stage query pattern where facilities are fetched first.
 */
function createMockFacilities(services: NodeVhaFacilityNonclinicalService[]) {
  const facilityIds = extractFacilityIds(services)
  return facilityIds.map((id) => ({
    type: 'node--health_care_local_facility',
    id,
    // Minimal facility object - only id is needed for the query
  }))
}

/**
 * Sets up mocks for the two-stage query pattern.
 * Mocks fetchAndConcatAllResourceCollectionPages to handle both facility and service queries.
 *
 * @param defaultServices - The default services array to use for mocking
 * @returns Object containing mockFetchAndConcatAllResourceCollectionPages, mockServicesQuery, and a reset function
 */
function createTwoStageQueryMock(
  defaultServices: NodeVhaFacilityNonclinicalService[]
) {
  const facilities = createMockFacilities(defaultServices)

  // Create a mock function for services that can be overridden in tests
  const mockServicesQuery = jest.fn(() => Promise.resolve(defaultServices))

  const mockFetchAndConcatAllResourceCollectionPages = jest.fn(
    async (resourceType: string) => {
      // First call: facilities query
      if (resourceType === RESOURCE_TYPES.VAMC_FACILITY) {
        return Promise.resolve({
          data: facilities,
          totalItems: facilities.length,
          totalPages: 1,
        })
      }
      // Second call: services query
      if (resourceType === RESOURCE_TYPES.VHA_FACILITY_NONCLINICAL_SERVICE) {
        const services = await mockServicesQuery()
        return Promise.resolve({
          data: services,
          totalItems: services.length,
          totalPages: 1,
        })
      }
      // Default fallback
      return Promise.resolve({
        data: [],
        totalItems: 0,
        totalPages: 0,
      })
    }
  )

  // Reset function to restore default services
  const reset = () => {
    mockServicesQuery.mockResolvedValue(defaultServices)
  }

  return {
    mockFetchAndConcatAllResourceCollectionPages,
    mockServicesQuery,
    reset,
  }
}

/**
 * Creates a mock function for fetchAndConcatAllResourceCollectionPages specifically for billing and insurance.
 * Handles the two-stage query pattern (facilities → services).
 */
export function createBillingAndInsuranceServiceQueryMocks() {
  return createTwoStageQueryMock(mockBillingAndInsuranceServices)
}

/**
 * Creates a mock function for fetchAndConcatAllResourceCollectionPages specifically for medical records.
 * Handles the two-stage query pattern (facilities → services).
 */
export function createMedicalRecordsServiceQueryMocks() {
  return createTwoStageQueryMock(mockMedicalRecordsServices)
}

/**
 * Creates a mock function for fetchAndConcatAllResourceCollectionPages specifically for register for care.
 * Handles the two-stage query pattern (facilities → services).
 */
export function createRegisterForCareServiceQueryMocks() {
  return createTwoStageQueryMock(mockRegisterForCareServices)
}
