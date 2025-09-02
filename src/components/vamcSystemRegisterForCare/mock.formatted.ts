import { VamcSystemRegisterForCare } from './formatted-type'

const mockData: VamcSystemRegisterForCare = {
  breadcrumbs: [
    {
      options: [],
      title: 'Home',
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/',
    },
    {
      options: [],
      title: 'VA Richmond health care',
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/richmond-health-care',
    },
    {
      options: [],
      title: 'Register for care',
      uri: 'internal:#',
    },
  ],
  entityId: 44606,
  entityPath: '/richmond-health-care/register-for-care',
  id: '116e00eb-8208-4bdc-8952-e3c9bc509327',
  lastUpdated: '2022-05-06T15:10:15+00:00',
  menu: {
    data: {
      description: null,
      links: [
        {
          description: null,
          expanded: false,
          label: 'VA Richmond health care',
          links: [
            {
              description: null,
              expanded: false,
              label: 'SERVICES AND LOCATIONS',
              links: [],
              lovellSection: null,
              url: {
                path: '',
              },
            },
            {
              description: null,
              expanded: false,
              label: 'NEWS AND EVENTS',
              links: [],
              lovellSection: null,
              url: {
                path: '',
              },
            },
            {
              description: null,
              expanded: false,
              label: 'ABOUT VA RICHMOND',
              links: [],
              lovellSection: null,
              url: {
                path: '',
              },
            },
          ],
          lovellSection: null,
          url: {
            path: '/richmond-health-care',
          },
        },
      ],
      name: 'VA Richmond health care',
    },
    rootPath: '/richmond-health-care/register-for-care/',
  },
  metatags: [],
  moderationState: 'published',
  published: true,
  title: 'Register for care',
  topOfPageContent: {
    html: '<h2 id="patient-registration-admission">Patient registration (admissions)</h2><p>Whether you moved and need to change your medical center or need a primary care provider in the area, we can help. Call us or visit one of our patient registration offices to get started.</p>',
    id: null,
    type: 'paragraph--wysiwyg',
  },
  type: 'node--vamc_system_register_for_care',
  vamcSystem: {
    id: '9aafd9b9-3676-4167-aeb7-0bde3c1ec1d6',
    title: 'VA Richmond health care',
  },
}
export default mockData
