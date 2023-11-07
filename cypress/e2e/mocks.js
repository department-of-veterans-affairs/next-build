// mock for cypress tests
export const features = {
  data: {
    type: 'feature_toggles',
    features: [
      { name: 'facilityLocatorShowCommunityCares', value: true },
      { name: 'profile_show_profile_2.0', value: false },
      { name: 'vaOnlineScheduling', value: true },
      { name: 'vaOnlineSchedulingCancel', value: true },
      { name: 'vaOnlineSchedulingRequests', value: true },
      { name: 'vaOnlineSchedulingCommunityCare', value: true },
      { name: 'vaOnlineSchedulingDirect', value: true },
      { name: 'vaOnlineSchedulingPast', value: true },
      { name: 'vaOnlineSchedulingExpressCare', value: true },
      { name: 'vaOnlineSchedulingExpressCareNew', value: true },
      { name: 'vaOnlineSchedulingFlatFacilityPage', value: true },
      { name: 'vaOnlineSchedulingProviderSelection', value: true },
      { name: 'vaOnlineSchedulingCheetah', value: true },
      { name: 'vaOnlineSchedulingHomepageRefresh', value: true },
      { name: 'vaOnlineSchedulingUnenrolledVaccine', value: true },
      { name: 'vaOnlineSchedulingVAOSServiceCCAppointments', value: false },
      { name: 'vaOnlineSchedulingVAOSServiceVAAppointments', value: false },
      { name: 'vaOnlineSchedulingVAOSServiceRequests', value: false },
      { name: 'edu_section_103', value: true },
      { name: 'vaViewDependentsAccess', value: false },
      { name: 'gibctEybBottomSheet', value: true },
    ],
  },
}

export const vamcEhr = {
  data: {
    nodeQuery: {
      count: 172,
      entities: [
        {
          title: 'Captain James A. Lovell Federal Health Care Center',
          fieldFacilityLocatorApiId: 'tricare_556',
          fieldRegionPage: {
            entity: {
              title: 'Lovell Federal health care - TRICARE',
              fieldVamcEhrSystem: 'vista',
            },
          },
        },
      ],
    },
  },
}
