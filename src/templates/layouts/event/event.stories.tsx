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
    field_intro_text:
      'Classified as a Geriatric Center of Excellence, our H.J. Heinz III campus offers transitional care, rehabilitation, dementia and hospice care beds, an ambulatory care center, and many outpatient services. Get address and hours, parking and transportation information, and health services offered at H. John Heinz III Department of Veterans Affairs Medical Center.',
    field_last_saved_by_an_editor: '2023-08-01T12:55:15+00:00',
    field_main_location: true,
    field_mental_health_phone: '412-360-6600',
    field_meta_tags:
      '{"description":"The Pittsburgh VA H.J. Heinz campus is a medical geriatric community living and progressive care center. Services include hearing care, speech pathology, dental care, primary care, and a pharmacy.","keywords":"H.J. Heinz VA medical geriatric community living center"}',

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
