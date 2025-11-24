export const placeholders = {
  // Stories panel
  fieldClpStoriesPanel: true,
  fieldClpStoriesHeader: 'Stories',
  fieldClpStoriesIntro: 'Read stories from Veterans.',
  fieldClpStoriesTeasers: [
    {
      entity: {
        fieldMedia: {
          entity: {
            image: { alt: 'Story image' },
            thumbnail: {
              derivative: {
                url: '/story1.jpg',
                height: '200',
                width: '300',
              },
            },
          },
        },
        fieldLinkTeaser: {
          entity: {
            fieldLink: {
              title: 'Story title',
              url: { path: '#' },
            },
            fieldLinkSummary: 'Story summary',
          },
        },
      },
    },
  ],
  fieldClpStoriesCta: { uri: '#' },

  // Resources panel
  fieldClpResourcesPanel: true,
  fieldClpResourcesHeader: 'Resources',
  fieldClpResourcesIntroText: 'Download these resources.',
  fieldClpResources: [
    {
      entity: {
        name: 'Resource 1',
        fieldDescription: 'Resource description',
        fieldMediaExternalFile: { uri: '/resource1.pdf' },
      },
    },
  ],
  fieldClpResourcesCta: {
    entity: {
      fieldButtonLink: { url: { path: '#' } },
      fieldButtonLabel: 'See all resources',
    },
  },
  clpTotalSections: '8',

  // Events panel
  fieldClpEventsPanel: true,
  fieldClpEventsHeader: 'Events',
  fieldClpEventsReferences: [
    {
      entity: {
        entityUrl: { path: '#' },
        title: 'Event title',
        fieldDescription: 'Event description',
        fieldDatetimeRangeTimezone: [],
        fieldFacilityLocation: {
          entity: {
            entityUrl: { path: '#' },
            title: 'VA Medical Center',
          },
        },
        fieldLocationHumanreadable: 'Online',
        fieldUrlOfAnOnlineEvent: { uri: '#' },
        fieldLink: { uri: '#', url: { path: '#' } },
        fieldEventCta: 'Register now',
      },
    },
  ],

  // FAQ panel
  fieldClpFaqPanel: true,
  fieldClpFaqParagraphs: [
    {
      entity: {
        fieldQuestion: 'Question 1',
        fieldAnswer: [
          {
            entity: {
              entityBundle: 'wysiwyg',
              processed: '<p>Answer to question 1</p>',
            },
          },
        ],
        entityId: '1',
      },
    },
  ],
  fieldClpReusableQA: {
    entity: {
      fieldSectionHeader: 'Frequently asked questions',
      fieldRichWysiwyg: { processed: '' },
      queryFieldQAs: { entities: [] },
      entityBundle: 'q_a_group',
      fieldAccordionDisplay: true,
    },
  },
  fieldClpFaqCta: {
    entity: {
      fieldButtonLink: { url: { path: '#' } },
      fieldButtonLabel: 'See all FAQs',
    },
  },

  // Connect with us
  fieldConnectWithUs: {
    entity: {
      fieldExternalLink: { title: 'VA Benefits' },
      fieldEmailUpdatesLink: {
        url: { path: '#' },
        title: 'Get email updates',
      },
      fieldSocialMediaLinks: {
        platformValues: JSON.stringify({
          twitter: { value: 'DeptVetAffairs' },
          facebook: { value: 'VeteransAffairs' },
          youtube: { value: 'user/DeptVetAffairs' },
          linkedin: { value: 'company/department-of-veterans-affairs' },
          instagram: { value: 'deptvetaffairs' },
        }),
      },
    },
  },

  // Benefit categories
  fieldBenefitCategories: [
    {
      entity: {
        fieldTitleIcon: 'health-care',
        entityUrl: { path: '#' },
        title: 'Health care',
        fieldTeaserText: 'Learn about VA health care benefits.',
      },
    },
  ],
}
