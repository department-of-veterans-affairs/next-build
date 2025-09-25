import { NodeRegionalHealthCareServiceDes } from '@/types/drupal/node'
import { FieldFormattedText } from '@/types/drupal/field_type'

/**
 * Creates a minimal mock NodeRegionalHealthCareServiceDes object for unit testing.
 * Only includes the fields that are actually used by formatHealthService.
 */
export function createMockServiceDes(
  overrides: {
    id?: string
    title?: string
    typeOfCare?: string
    alsoKnownAs?: string
    commonlyTreatedCondition?: string
    description?: string
    tricareDescription?: string
    bodyContent?: string
    locations?: Array<{
      id: string
      title: string
      path: string
      isMainLocation?: boolean
      facilityClassification?: string
      isMobile?: boolean
    }>
  } = {}
): NodeRegionalHealthCareServiceDes {
  const {
    id = '12345',
    title = 'Test Health Service',
    typeOfCare = 'Primary care',
    alsoKnownAs = 'Test Service',
    commonlyTreatedCondition = 'Test condition',
    description = 'Test service description',
    tricareDescription = 'Test Tricare description',
    bodyContent = '<p>Test body content</p>',
    locations = [],
  } = overrides

  const mockDescription: FieldFormattedText = {
    value: description,
    format: 'rich_text',
    processed: description,
  }

  const mockBody: FieldFormattedText = {
    value: bodyContent,
    format: 'rich_text_limited',
    processed: bodyContent,
  }

  return {
    type: 'node--regional_health_care_service_des',
    id: `test-${id}`,
    drupal_internal__nid: parseInt(id),
    drupal_internal__vid: 1,
    langcode: 'en',
    revision_timestamp: '2024-01-01T00:00:00+00:00',
    status: true,
    title: 'Mock Service',
    created: '2024-01-01T00:00:00+00:00',
    changed: '2024-01-01T00:00:00+00:00',
    promote: false,
    sticky: false,
    default_langcode: true,
    revision_translation_affected: true,
    breadcrumbs: [],
    moderation_state: 'published',
    expiration_date: null,
    warning_date: null,
    metatag: [],
    path: {
      alias: `/test-service-${id}`,
      pid: 1,
      langcode: 'en',
    },
    content_translation_source: 'und',
    content_translation_outdated: false,
    field_body: mockBody,
    field_enforce_unique_combo: false,
    field_last_saved_by_an_editor: '2024-01-01T00:00:00+00:00',
    links: {
      self: {
        href: `https://example.com/jsonapi/node/regional_health_care_service_des/test-${id}`,
      },
    },
    resourceIdObjMeta: {
      drupal_internal__target_id: parseInt(id),
    },
    node_type: {
      type: 'node_type--node_type',
      id: 'test-node-type',
      resourceIdObjMeta: {
        drupal_internal__target_id: 'regional_health_care_service_des',
      },
    },
    revision_uid: {
      type: 'user--user',
      id: 'test-user',
      resourceIdObjMeta: {
        drupal_internal__target_id: 1,
      },
    },
    uid: {
      type: 'user--user',
      id: 'test-user',
      resourceIdObjMeta: {
        drupal_internal__target_id: 1,
      },
    },
    field_local_health_care_service_: locations.map((location, index) => ({
      type: 'node--health_care_local_health_service',
      id: `local-${location.id}`,
      drupal_internal__nid: parseInt(location.id),
      drupal_internal__vid: 1,
      langcode: 'en',
      revision_timestamp: '2024-01-01T00:00:00+00:00',
      status: true,
      title: location.title,
      created: '2024-01-01T00:00:00+00:00',
      changed: '2024-01-01T00:00:00+00:00',
      promote: false,
      sticky: false,
      default_langcode: true,
      revision_translation_affected: true,
      breadcrumbs: [],
      moderation_state: 'published',
      expiration_date: null,
      warning_date: null,
      metatag: [],
      path: {
        alias: location.path,
        pid: 1,
        langcode: 'en',
      },
      content_translation_source: 'und',
      content_translation_outdated: false,
      field_appointments_help_text: null,
      field_enforce_unique_combo: false,
      field_hservice_appt_intro_select: 'custom_intro_text',
      field_hservice_appt_leadin: 'Contact us to schedule an appointment.',
      field_last_saved_by_an_editor: '2024-01-01T00:00:00+00:00',
      field_online_scheduling_availabl: '0',
      field_referral_required: '0',
      field_walk_ins_accepted: '0',
      field_facility_service_loc_help: null,
      field_hservices_lead_in_default: null,
      links: {
        self: {
          href: `https://example.com/jsonapi/node/health_care_local_health_service/local-${location.id}`,
        },
      },
      resourceIdObjMeta: {
        drupal_internal__target_id: parseInt(location.id),
      },
      node_type: {
        type: 'node_type--node_type',
        id: 'test-local-service-type',
        resourceIdObjMeta: {
          drupal_internal__target_id: 'health_care_local_health_service',
        },
      },
      revision_uid: {
        type: 'user--user',
        id: 'test-user',
        resourceIdObjMeta: {
          drupal_internal__target_id: 1,
        },
      },
      uid: {
        type: 'user--user',
        id: 'test-user',
        resourceIdObjMeta: {
          drupal_internal__target_id: 1,
        },
      },
      field_administration: {
        type: 'taxonomy_term--administration',
        id: 'test-admin',
        drupal_internal__tid: 1,
        drupal_internal__revision_id: 1,
        langcode: 'en',
        revision_created: '2024-01-01T00:00:00+00:00',
        status: true,
        name: 'Test Administration',
        description: null,
        weight: 0,
        changed: '2024-01-01T00:00:00+00:00',
        default_langcode: true,
        revision_translation_affected: true,
        breadcrumbs: [],
        moderation_state: null,
        metatag: [],
        path: {
          alias: '/test-admin',
          pid: 1,
          langcode: 'en',
        },
        content_translation_source: 'und',
        content_translation_outdated: false,
        content_translation_created: null,
        field_description: null,
        links: {
          self: {
            href: 'https://example.com/jsonapi/taxonomy_term/administration/test-admin',
          },
        },
        resourceIdObjMeta: {
          drupal_internal__target_id: 1,
        },
        vid: {
          type: 'taxonomy_vocabulary--taxonomy_vocabulary',
          id: 'test-vocab',
          resourceIdObjMeta: {
            drupal_internal__target_id: 'administration',
          },
        },
        revision_user: {
          type: 'user--user',
          id: 'test-user',
          resourceIdObjMeta: {
            drupal_internal__target_id: 1,
          },
        },
        parent: [],
        content_translation_uid: null,
        field_product: {
          type: 'taxonomy_term--products',
          id: 'test-product',
          resourceIdObjMeta: {
            drupal_internal__target_id: 1,
          },
        },
        relationshipNames: [
          'vid',
          'revision_user',
          'parent',
          'content_translation_uid',
          'field_product',
        ],
      },
      field_facility_location: null,
      field_phone_numbers_paragraph: [],
      field_regional_health_service: null,
      field_service_location: [],
      relationshipNames: [
        'node_type',
        'revision_uid',
        'uid',
        'field_administration',
        'field_facility_location',
        'field_phone_numbers_paragraph',
        'field_regional_health_service',
        'field_service_location',
      ],
    })),
    field_region_page: null,
    field_other_categories: [],
    field_alert_single: null,
    field_buttons: [],
    field_contact_information: null,
    field_intro_text_limited_html: {
      value: '',
      format: 'rich_text',
      processed: '',
    },
    field_primary_category: null,
    field_related_information: [],
    field_tags: null,
    field_related_benefit_hubs: [],
    field_service_name_and_descripti: {
      type: 'taxonomy_term--health_care_service_taxonomy',
      id: `taxonomy-${id}`,
      drupal_internal__tid: parseInt(id),
      drupal_internal__revision_id: 1,
      langcode: 'en',
      revision_created: '2024-01-01T00:00:00+00:00',
      status: true,
      name: title,
      description: mockDescription,
      weight: 0,
      changed: '2024-01-01T00:00:00+00:00',
      default_langcode: true,
      revision_translation_affected: true,
      breadcrumbs: [],
      moderation_state: 'published',
      metatag: [],
      path: {
        alias: `/health-care/${title.toLowerCase().replace(/\s+/g, '-')}`,
        pid: 1,
        langcode: 'en',
      },
      content_translation_source: 'und',
      content_translation_outdated: false,
      content_translation_created: null,
      field_also_known_as: alsoKnownAs,
      field_commonly_treated_condition: commonlyTreatedCondition,
      field_enforce_unique_combo_servi: false,
      field_facility_service_descripti: null,
      field_facility_service_header: null,
      field_health_service_api_id: title.toLowerCase().replace(/\s+/g, '-'),
      field_online_self_service: null,
      field_regional_service_descripti: null,
      field_regional_service_header: null,
      field_service_type_of_care: typeOfCare,
      field_show_for_vamc_facilities: true,
      field_show_for_vba_facilities: false,
      field_show_for_vet_centers: true,
      field_tricare_description: tricareDescription,
      field_tricare_specific_service: false,
      field_vba_com_conditions: null,
      field_vba_friendly_name: null,
      field_vba_service_descrip: null,
      field_vba_type_of_care: null,
      field_vet_center_com_conditions: null,
      field_vet_center_friendly_name: null,
      field_vet_center_required_servic: true,
      field_vet_center_service_descrip: description,
      field_vet_center_type_of_care: 'referral',
      field_vha_healthservice_stopcode: null,
      links: {
        self: {
          href: `https://example.com/jsonapi/taxonomy_term/health_care_service_taxonomy/taxonomy-${id}`,
        },
      },
      resourceIdObjMeta: {
        drupal_internal__target_id: parseInt(id),
      },
      vid: {
        type: 'taxonomy_vocabulary--taxonomy_vocabulary',
        id: 'test-vocab',
        resourceIdObjMeta: {
          drupal_internal__target_id: 'health_care_service_taxonomy',
        },
      },
      revision_user: {
        type: 'user--user',
        id: 'test-user',
        resourceIdObjMeta: {
          drupal_internal__target_id: 1,
        },
      },
      parent: [],
      content_translation_uid: null,
      field_owner: {
        type: 'taxonomy_term--administration',
        id: 'test-admin',
        resourceIdObjMeta: {
          drupal_internal__target_id: 1,
        },
      },
      field_vba_service_regions: [],
      relationshipNames: [
        'vid',
        'revision_user',
        'parent',
        'content_translation_uid',
        'field_owner',
        'field_vba_service_regions',
      ],
    },
    relationshipNames: [
      'node_type',
      'revision_uid',
      'uid',
      'field_local_health_care_service_',
      'field_region_page',
      'field_service_name_and_descripti',
    ],
  }
}

/**
 * Helper function to create multiple mock services for testing grouping
 */
export function createMockServicesForGrouping(): NodeRegionalHealthCareServiceDes[] {
  return [
    createMockServiceDes({
      id: '1',
      title: 'Primary Care Service',
      typeOfCare: 'Primary care',
      description: 'Primary care description',
    }),
    createMockServiceDes({
      id: '2',
      title: 'Mental Health Service',
      typeOfCare: 'Mental health care',
      description: 'Mental health description',
    }),
    createMockServiceDes({
      id: '3',
      title: 'Specialty Service',
      typeOfCare: 'Specialty care',
      description: 'Specialty care description',
    }),
    createMockServiceDes({
      id: '4',
      title: 'Social Service',
      typeOfCare: 'Social programs and services',
      description: 'Social service description',
    }),
    createMockServiceDes({
      id: '5',
      title: 'Other Service',
      typeOfCare: 'Other services',
      description: 'Other service description',
    }),
  ]
}
