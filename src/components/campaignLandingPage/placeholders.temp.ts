export const placeholders = {
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
