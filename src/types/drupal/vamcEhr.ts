export type VamcEhrSystem = 'vista' | 'cerner' | 'cerner_staged'

export type VamcEhr = {
  title: string
  field_facility_locator_api_id: string
  field_region_page: {
    title: string
    field_vamc_ehr_system: VamcEhrSystem
  }
}
