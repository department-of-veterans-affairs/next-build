import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Event } from '.'

export default {
  title: 'Layouts/Event',
  component: Event,
} as ComponentMeta<typeof Event>

const Template: ComponentStory<typeof Event> = (args) => <Event {...args} />

export const EventExample = Template.bind({})
EventExample.args = {
  title: 'Event Title',
  image: null,
  description:
    'Get important VA updates and hear from VAPHS leadership and representatives from VBA’s Pittsburgh Regional Office and the National Cemetery of the Alleghenies.',
  datetimeRange: [
    {
      value: '2028-12-11T15:30:00+00:00',
      end_value: '2028-12-11T16:30:00+00:00',
      duration: 60,
      rrule: null,
      rrule_index: null,
      timezone: 'America/New_York',
    },
  ],
  locationHumanReadable: 'Building 71, Learning Exchange',
  facilityLocation: {
    type: 'node--health_care_local_facility',
    id: 'e15ebe41-f7cf-4f2c-a407-3728c341220b',
    drupal_internal__nid: 175,
    drupal_internal__vid: 818989,
    langcode: 'en',
    revision_timestamp: '2023-10-27T12:00:36+00:00',
    revision_log: 'Update of Facility API data by migration.',
    status: true,
    title: 'H. John Heinz III Department of Veterans Affairs Medical Center',
    created: '2019-03-12T20:37:24+00:00',
    changed: '2023-10-27T12:00:36+00:00',
    promote: false,
    sticky: false,
    default_langcode: true,
    revision_translation_affected: true,
    breadcrumbs: [
      {
        uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/',
        title: 'Home',
        options: [],
      },
      {
        uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/pittsburgh-health-care',
        title: 'VA Pittsburgh health care',
        options: [],
      },
      {
        uri: 'internal:#',
        title: 'Services and locations',
        options: [],
      },
      {
        uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/pittsburgh-health-care/locations',
        title: 'Locations',
        options: [],
      },
      {
        uri: 'internal:#',
        title:
          'H. John Heinz III Department of Veterans Affairs Medical Center',
        options: [],
      },
    ],
    moderation_state: 'published',
    metatag: [
      {
        tag: 'meta',
        attributes: {
          name: 'title',
          content:
            'H. John Heinz III Department of Veterans Affairs Medical Center | VA Pittsburgh health care | Veterans Affairs',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'description',
          content:
            'The Pittsburgh VA H.J. Heinz campus is a medical geriatric community living and progressive care center. Services include hearing care, speech pathology, dental care, primary care, and a pharmacy.',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'keywords',
          content: 'H.J. Heinz VA medical geriatric community living center',
        },
      },
      {
        tag: 'link',
        attributes: {
          rel: 'image_src',
          href: 'https://www.va.gov/img/design/logo/va-og-image.png',
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:site_name',
          content: 'Veterans Affairs',
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:title',
          content:
            'H. John Heinz III Department of Veterans Affairs Medical Center | VA Pittsburgh health care | Veterans Affairs',
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:description',
          content:
            'Get address and hours, parking and transportation information, and health services offered at H. John Heinz III Department of Veterans Affairs Medical Center.',
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image',
          content:
            'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/3_2_medium_thumbnail/public/2019-02/HJ-heinz-ambulatory-care3_0.jpg?h=afdcd683',
        },
      },
      {
        tag: 'meta',
        attributes: {
          property: 'og:image:alt',
          content: 'Heinz campus of the VA hospital system in Pittsburgh',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:description',
          content:
            'Get address and hours, parking and transportation information, and health services offered at H. John Heinz III Department of Veterans Affairs Medical Center.',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:site',
          content: '@DeptVetAffairs',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:title',
          content:
            'H. John Heinz III Department of Veterans Affairs Medical Center | VA Pittsburgh health care | Veterans Affairs',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image',
          content:
            'http://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/sites/default/files/styles/3_2_medium_thumbnail/public/2019-02/HJ-heinz-ambulatory-care3_0.jpg?h=afdcd683',
        },
      },
      {
        tag: 'meta',
        attributes: {
          name: 'twitter:image:alt',
          content: 'Heinz campus of the VA hospital system in Pittsburgh',
        },
      },
    ],
    path: {
      alias:
        '/pittsburgh-health-care/locations/h-john-heinz-iii-department-of-veterans-affairs-medical-center',
      pid: 275,
      langcode: 'en',
    },
    content_translation_source: 'und',
    content_translation_outdated: false,
    field_address: {
      langcode: null,
      country_code: 'US',
      administrative_area: 'PA',
      locality: 'Pittsburgh',
      dependent_locality: null,
      postal_code: '15240-1005',
      address_line1: '1010 Delafield Road',
      additional_name: null,
    },
    field_description:
      'Get address and hours, parking and transportation information, and health services offered at H. John Heinz III Department of Veterans Affairs Medical Center.',
    field_facility_classification: '1',
    field_facility_locator_api_id: 'vha_646A4',
    field_geolocation: {
      value: 'POINT (-79.887699 40.495158)',
      geo_type: 'Point',
      lat: 40.495158,
      lon: -79.887699,
      left: -79.887699,
      top: 40.495158,
      right: -79.887699,
      bottom: 40.495158,
      geohash: 'dppnq5gt3sw4',
      latlon: '40.495158,-79.887699',
    },
    field_intro_text:
      'Classified as a Geriatric Center of Excellence, our H.J. Heinz III campus offers transitional care, rehabilitation, dementia and hospice care beds, an ambulatory care center, and many outpatient services. Get address and hours, parking and transportation information, and health services offered at H. John Heinz III Department of Veterans Affairs Medical Center.',
    field_last_saved_by_an_editor: '2023-08-01T12:55:15+00:00',
    field_main_location: true,
    field_mental_health_phone: '412-360-6600',
    field_meta_tags:
      '{"description":"The Pittsburgh VA H.J. Heinz campus is a medical geriatric community living and progressive care center. Services include hearing care, speech pathology, dental care, primary care, and a pharmacy.","keywords":"H.J. Heinz VA medical geriatric community living center"}',
    field_mobile: false,
    field_office_hours: [
      {
        day: 0,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: '24/7',
      },
      {
        day: 1,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: '24/7',
      },
      {
        day: 2,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: '24/7',
      },
      {
        day: 3,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: '24/7',
      },
      {
        day: 4,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: '24/7',
      },
      {
        day: 5,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: '24/7',
      },
      {
        day: 6,
        all_day: false,
        starthours: null,
        endhours: null,
        comment: '24/7',
      },
    ],
    field_operating_status_facility: 'normal',
    field_operating_status_more_info: null,
    field_phone_number: '866-482-7488',
    field_supplemental_status_more_i: null,
    field_timezone: 'America/New_York',
    links: {
      self: {
        href: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/health_care_local_facility/e15ebe41-f7cf-4f2c-a407-3728c341220b?resourceVersion=id%3A818989',
      },
    },
    resourceIdObjMeta: {
      drupal_internal__target_id: 175,
    },
    node_type: {
      type: 'node_type--node_type',
      id: '5ecbcf0c-b701-49d5-a47e-08803d42dd80',
      resourceIdObjMeta: {
        drupal_internal__target_id: 'health_care_local_facility',
      },
    },
    revision_uid: {
      type: 'user--user',
      id: 'c564bd69-e8da-4ac3-905c-dd94f4bf7b35',
      resourceIdObjMeta: {
        drupal_internal__target_id: 1317,
      },
    },
    uid: {
      type: 'user--user',
      id: 'c564bd69-e8da-4ac3-905c-dd94f4bf7b35',
      resourceIdObjMeta: {
        drupal_internal__target_id: 1317,
      },
    },
    field_administration: {
      type: 'taxonomy_term--administration',
      id: '87832236-1e54-4ce3-8141-8dec27c8a9a7',
      drupal_internal__tid: 12,
      drupal_internal__revision_id: 1572,
      langcode: 'en',
      revision_created: '2023-04-03T19:41:40+00:00',
      revision_log_message: null,
      status: true,
      name: 'VA Pittsburgh health care',
      description: null,
      weight: 0,
      changed: '2023-04-03T19:41:40+00:00',
      default_langcode: true,
      revision_translation_affected: true,
      moderation_state: null,
      metatag: [
        {
          tag: 'meta',
          attributes: {
            name: 'title',
            content: 'VA Pittsburgh health care | VA.gov CMS',
          },
        },
        {
          tag: 'link',
          attributes: {
            rel: 'canonical',
            href: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/section/vha/vamc-facilities/va-pittsburgh-health-care',
          },
        },
      ],
      path: {
        alias: '/section/vha/vamc-facilities/va-pittsburgh-health-care',
        pid: 987,
        langcode: 'en',
      },
      content_translation_source: 'und',
      content_translation_outdated: false,
      content_translation_created: null,
      field_description: null,
      links: {
        self: {
          href: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/taxonomy_term/administration/87832236-1e54-4ce3-8141-8dec27c8a9a7?resourceVersion=id%3A1572',
        },
      },
      resourceIdObjMeta: {
        drupal_internal__target_id: 12,
      },
      vid: {
        type: 'taxonomy_vocabulary--taxonomy_vocabulary',
        id: '645055c5-e567-4683-b6db-459ce04522ce',
        resourceIdObjMeta: {
          drupal_internal__target_id: 'administration',
        },
      },
      revision_user: {
        type: 'user--user',
        id: '20b2bc97-2210-4def-9a0f-46c22d250eb7',
        resourceIdObjMeta: {
          drupal_internal__target_id: 0,
        },
      },
      parent: [
        {
          type: 'taxonomy_term--administration',
          id: '62ba5bc4-5bf3-4888-a2bb-0489ead0c76f',
          resourceIdObjMeta: {
            drupal_internal__target_id: 157,
          },
        },
      ],
      content_translation_uid: null,
      field_product: {
        type: 'taxonomy_term--products',
        id: '2fe1cb98-c03e-49fe-bb09-d73b66b99c8d',
        resourceIdObjMeta: {
          drupal_internal__target_id: 284,
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
    field_local_health_care_service_: [
      {
        type: 'node--health_care_local_health_service',
        id: '0d73b85c-b637-4527-9e8b-6f78f05a2ab4',
        resourceIdObjMeta: {
          drupal_internal__target_id: 355,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '5571a858-a6a4-4e9d-a110-110b1c5d7ebf',
        resourceIdObjMeta: {
          drupal_internal__target_id: 356,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '88a5e744-5cfb-491a-bf53-ac6c0fc07f4b',
        resourceIdObjMeta: {
          drupal_internal__target_id: 357,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 0,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 1,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 2,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 3,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'c8c43cec-81d2-495b-be81-5129490622c1',
        resourceIdObjMeta: {
          drupal_internal__target_id: 358,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'ea7f52c8-203f-4cdb-8437-fd3648b3807f',
        resourceIdObjMeta: {
          drupal_internal__target_id: 452,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '14e57845-110f-4166-a8cd-8bae2d886913',
        resourceIdObjMeta: {
          drupal_internal__target_id: 453,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 4,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '36f7cebd-08bd-4b77-a5f8-f4904cf210b6',
        resourceIdObjMeta: {
          drupal_internal__target_id: 459,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'f0c8a0e6-c631-4792-ab16-d7f956923b73',
        resourceIdObjMeta: {
          drupal_internal__target_id: 460,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '9130891f-4884-4d10-a0a0-671730f2cec5',
        resourceIdObjMeta: {
          drupal_internal__target_id: 462,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '2f44780a-d49c-43e6-87c8-ef66eb9f18ff',
        resourceIdObjMeta: {
          drupal_internal__target_id: 469,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'fdb87ac3-cf59-43ba-9908-ff1de484ce63',
        resourceIdObjMeta: {
          drupal_internal__target_id: 470,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '89733fed-7f21-4c29-8e50-003424df1afb',
        resourceIdObjMeta: {
          drupal_internal__target_id: 481,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'a3e20785-6bc2-44b4-a3d2-a3837a70b5f0',
        resourceIdObjMeta: {
          drupal_internal__target_id: 494,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '3d792ced-59f4-4b71-8633-dae36bef86eb',
        resourceIdObjMeta: {
          drupal_internal__target_id: 496,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'a044cafe-b5d0-4aa9-9633-8852790df828',
        resourceIdObjMeta: {
          drupal_internal__target_id: 597,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'f1e75524-194c-4c05-a086-8c8b1248abb8',
        resourceIdObjMeta: {
          drupal_internal__target_id: 602,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'b874472c-c66c-4f88-a789-ba31d33d2e11',
        resourceIdObjMeta: {
          drupal_internal__target_id: 604,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '82fc56d3-e6a6-43e3-98c1-c87e0f8366dd',
        resourceIdObjMeta: {
          drupal_internal__target_id: 610,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '6ef7d829-5a74-4846-be1c-cf45d1e0c46d',
        resourceIdObjMeta: {
          drupal_internal__target_id: 625,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '3ec5cffb-1025-4d98-9ba5-a22cdbc66698',
        resourceIdObjMeta: {
          drupal_internal__target_id: 632,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '3f49a39f-3457-4e19-9433-e2d16015d471',
        resourceIdObjMeta: {
          drupal_internal__target_id: 633,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'c15dd28b-413b-48f6-a1fb-d8683c913e2f',
        resourceIdObjMeta: {
          drupal_internal__target_id: 634,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '28d358e6-3838-40e5-92e1-fd30d33e174d',
        resourceIdObjMeta: {
          drupal_internal__target_id: 635,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'd72934eb-42d0-4413-bcf9-67f4b2bebee5',
        resourceIdObjMeta: {
          drupal_internal__target_id: 639,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '88ad402e-5f72-40af-9c99-5c97f76bbfbb',
        resourceIdObjMeta: {
          drupal_internal__target_id: 644,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '676acdff-d8f1-46c8-8ae5-49457f101c7b',
        resourceIdObjMeta: {
          drupal_internal__target_id: 645,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 5,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'bd0e24f1-eae2-43a2-8fc3-dea764d6c87b',
        resourceIdObjMeta: {
          drupal_internal__target_id: 741,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'aac60ec2-0468-49c6-be40-65c8a21b0513',
        resourceIdObjMeta: {
          drupal_internal__target_id: 744,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 6,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '6d71dc89-32bd-4c61-932f-68ebad4b04dc',
        resourceIdObjMeta: {
          drupal_internal__target_id: 994,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '2ad0413f-9f1f-4ffe-a35c-5c06030e2873',
        resourceIdObjMeta: {
          drupal_internal__target_id: 1014,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'missing',
        resourceIdObjMeta: {
          arity: 7,
          links: {
            help: {
              href: 'https://www.drupal.org/docs/8/modules/json-api/core-concepts#missing',
              meta: {
                about:
                  "Usage and meaning of the 'missing' resource identifier.",
              },
            },
          },
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '9198779f-53e0-4e22-8160-3e612c39e97a',
        resourceIdObjMeta: {
          drupal_internal__target_id: 1033,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '89a107e4-b645-4a01-a19c-10e52d93fd78',
        resourceIdObjMeta: {
          drupal_internal__target_id: 1051,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'f19cba64-b1b2-48bf-a7a8-da03e1dad5c6',
        resourceIdObjMeta: {
          drupal_internal__target_id: 2329,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '96dc069a-e27e-4b24-bdc6-64f95ed71507',
        resourceIdObjMeta: {
          drupal_internal__target_id: 2331,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '61fb75ac-a65f-4e46-9b55-25dfb5f83f98',
        resourceIdObjMeta: {
          drupal_internal__target_id: 15425,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: 'f5c1a708-52d6-4986-8db9-612a09a28c10',
        resourceIdObjMeta: {
          drupal_internal__target_id: 56403,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '04d79987-3262-49fd-bb04-3ad2f15eb205',
        resourceIdObjMeta: {
          drupal_internal__target_id: 59298,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '085ae12e-6bb8-431b-8b39-f37ff796cf08',
        resourceIdObjMeta: {
          drupal_internal__target_id: 59299,
        },
      },
      {
        type: 'node--health_care_local_health_service',
        id: '6ec28d5c-9d4a-4deb-a189-24a09e51a691',
        resourceIdObjMeta: {
          drupal_internal__target_id: 59300,
        },
      },
    ],
    field_location_services: [
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: '7f1e7866-8975-4960-af44-eb3ec27090d8',
        resourceIdObjMeta: {
          target_revision_id: 1021344,
          drupal_internal__target_id: 4201,
        },
      },
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: 'f0d0eb26-72cc-42f0-9198-77636b1ab018',
        resourceIdObjMeta: {
          target_revision_id: 1021345,
          drupal_internal__target_id: 2765,
        },
      },
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: 'bab7b07c-e3e8-4ca4-a00d-3d968b7ed7c4',
        resourceIdObjMeta: {
          target_revision_id: 1021346,
          drupal_internal__target_id: 2763,
        },
      },
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: '640304c8-1975-435e-b710-3536c1140382',
        resourceIdObjMeta: {
          target_revision_id: 1021347,
          drupal_internal__target_id: 2764,
        },
      },
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: 'e915d298-4eda-456c-a822-49464f8ec1ff',
        resourceIdObjMeta: {
          target_revision_id: 1021348,
          drupal_internal__target_id: 2767,
        },
      },
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: '7049fad0-7c40-4535-bca7-74addcf70a34',
        resourceIdObjMeta: {
          target_revision_id: 1021349,
          drupal_internal__target_id: 5335,
        },
      },
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: '67ca2715-de10-402b-a53e-c118097bff92',
        resourceIdObjMeta: {
          target_revision_id: 1021350,
          drupal_internal__target_id: 5336,
        },
      },
      {
        type: 'paragraph--health_care_local_facility_servi',
        id: '136fe7a5-6706-4a2b-a9f4-7bf807d20b1c',
        resourceIdObjMeta: {
          target_revision_id: 1021351,
          drupal_internal__target_id: 4038,
        },
      },
    ],
    field_media: {
      type: 'media--image',
      id: '8140b30e-34d1-4bf7-9570-4bdcff5b4f19',
      resourceIdObjMeta: {
        drupal_internal__target_id: 13,
      },
    },
    field_region_page: {
      type: 'node--health_care_region_page',
      id: '2bddb1a7-6fb1-4503-838d-9c2fcb51c46a',
      resourceIdObjMeta: {
        drupal_internal__target_id: 318,
      },
    },
    field_supplemental_status: null,
    relationshipNames: [
      'node_type',
      'revision_uid',
      'uid',
      'field_administration',
      'field_local_health_care_service_',
      'field_location_services',
      'field_media',
      'field_region_page',
      'field_supplemental_status',
    ],
  },
  locationType: 'facility',
  urlOfOnlineEvent: null,
  address: {
    langcode: 'en',
    country_code: 'US',
    administrative_area: '',
    locality: '',
    address_line1: '',
    address_line2: '',
  },
  cost: 'Free',
  socialLinks: {
    path: '/pittsburgh-health-care/events/63132',
    title: 'Veterans Town Hall',
  },
  link: null,
  additionalInfo: null,
  eventCTA: null,
  body: {
    value:
      '<p>Get important VA updates and hear from VAPHS leadership and representatives from VBA’s Pittsburgh Regional Office and the National Cemetery of the Alleghenies. Our town hall is part of our ongoing effort to hear from you and use your feedback to improve VA care.</p>\r\n\r\n<p>Attend in person, via WebEx or by phone.</p>\r\n\r\n<p>1. Join in person in the Learning Exchange on our H.J. Heinz III campus, 1010 Delafield Road, Pittsburgh, PA 15215, building 71, Learning Exchange.</p>\r\n\r\n<p>2. Join via Webex:</p>\r\n\r\n<ul><li>Go to: <a href="/admin/content/linky/16960">https://veteransaffairs.webex.com/veteransaffairs/j.php?MTID=mf85a5856faead97291fe0ce7cfacfb00</a></li>\r\n\t<li>If prompted, use webinar/event number 2763 626 2859 and password 3TKkzQqm@23</li>\r\n</ul><p>3. Join via phone:</p>\r\n\r\n<ul><li>Call 1-404-397-1596 and enter access code 276 029 65213</li>\r\n\t<li>Phone participants must press *3 to raise their hand to ask a question.</li>\r\n</ul>',
    format: 'rich_text',
    processed:
      '<p>Get important VA updates and hear from VAPHS leadership and representatives from VBA’s Pittsburgh Regional Office and the National Cemetery of the Alleghenies. Our town hall is part of our ongoing effort to hear from you and use your feedback to improve VA care.</p>\n\n<p>Attend in person, via WebEx or by phone.</p>\n\n<p>1. Join in person in the Learning Exchange on our H.J. Heinz III campus, 1010 Delafield Road, Pittsburgh, PA 15215, building 71, Learning Exchange.</p>\n\n<p>2. Join via Webex:</p>\n\n<ul><li>Go to: <a href="https://veteransaffairs.webex.com/wbxmjs/joinservice/sites/veteransaffairs/meeting/download/0602006047574141a9f001afcc3a873c?siteurl=veteransaffairs&amp;MTID=mf85a5856faead97291fe0ce7cfacfb00">https://veteransaffairs.webex.com/veteransaffairs/j.php?MTID=mf85a5856faead97291fe0ce7cfacfb00</a></li>\n\t<li>If prompted, use webinar/event number 2763 626 2859 and password 3TKkzQqm@23</li>\n</ul><p>3. Join via phone:</p>\n\n<ul><li>Call 1-404-397-1596 and enter access code 276 029 65213</li>\n\t<li>Phone participants must press *3 to raise their hand to ask a question.</li>\n</ul>',
  },
  listing: '/pittsburgh-health-care/events ',
}
