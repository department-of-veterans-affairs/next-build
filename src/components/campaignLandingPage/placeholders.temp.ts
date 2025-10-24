export const placeholders = {
  fieldPrimaryCallToAction: {
    entity: {
      fieldButtonLink: { url: { path: '#' } },
      fieldButtonLabel: 'Primary Action',
    },
  },
  // Why this matters section
  fieldClpWhyThisMatters: 'This is why this matters to you.',
  fieldSecondaryCallToAction: {
    entity: {
      fieldButtonLink: { url: { path: '#' } },
      fieldButtonLabel: 'Secondary Action',
    },
  },
  fieldClpAudience: [
    { entity: { name: 'Veterans' } },
    { entity: { name: 'Service members' } },
  ],

  // URLs for social sharing
  hostUrl: 'https://www.va.gov',
  entityUrl: { path: '/campaign-page' },

  // What you can do section
  fieldClpWhatYouCanDoHeader: 'What you can do',
  fieldClpWhatYouCanDoIntro: 'Here are some actions you can take.',
  fieldClpWhatYouCanDoPromos: [
    {
      entity: {
        fieldImage: {
          entity: {
            image: { alt: 'Promo 1' },
            thumbnail: {
              derivative: {
                url: '/promo1.jpg',
                height: '200',
                width: '300',
              },
            },
          },
        },
        fieldPromoLink: {
          entity: {
            fieldLink: {
              title: 'Learn more',
              url: { path: '#' },
            },
            fieldLinkSummary: 'Description of promo 1',
          },
        },
      },
    },
  ],

  // Video panel
  fieldClpVideoPanel: true,
  fieldClpVideoPanelHeader: 'Watch this video',
  fieldMedia: {
    entity: {
      fieldMediaVideoEmbedField: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      name: 'Video title',
      fieldDuration: '120',
      fieldPublicationDate: { date: '2024-01-01' },
      fieldDescription: 'Video description',
    },
  },
  fieldClpVideoPanelMoreVideo: {
    entity: {
      fieldButtonLink: { url: { path: '#' } },
      fieldButtonLabel: 'See more videos',
    },
  },

  // Spotlight panel
  fieldClpSpotlightPanel: true,
  fieldClpSpotlightHeader: 'Spotlight',
  fieldClpSpotlightIntroText: 'Spotlight intro text',
  fieldClpSpotlightCta: {
    entity: {
      fieldButtonLink: { url: { path: '#' } },
      fieldButtonLabel: 'Learn more',
    },
  },
  fieldClpSpotlightLinkTeasers: [
    {
      entity: {
        fieldLink: {
          title: 'Spotlight link 1',
          url: { path: '#' },
        },
        fieldLinkSummary: 'Summary of spotlight link',
      },
    },
  ],

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
