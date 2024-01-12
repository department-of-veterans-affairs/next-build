// // FUTURE USE
// // vamc-ehr.json should eventually include formatted data.
// // At the least, it should contain formatted facilities.
// export type VamcEhrFacility = {
//   title: string
//   vhaId: string
//   vamcFacilityName: string
//   vamcSystemName: string
//   ehr: 'vista' | 'cerner' | 'cerner_staged'
// }
// // Maybe addtionally, it should categorize the
// // facilities and offload this piece from vets-website code as well.
// export type VamcEhr = {
//   ehrDataByVhaId: {
//     vhaId: VamcEhrFacility,
//   },
//   cernerFacilities: VamcEhrFacility[],
//   vistaFacilities: VamcEhrFacility[],
// }

export type VamcEhrGraphQLEntity = {
  title: string
  fieldFacilityLocatorApiId: string
  fieldRegionPage: {
    entity: {
      title: string
      fieldVamcEhrSystem: 'vista' | 'cerner' | 'cerner_staged'
    }
  }
}

export type VamcEhrGraphQLMimic = {
  data: {
    nodeQuery: {
      count: number
      entities: VamcEhrGraphQLEntity[]
    }
  }
}
