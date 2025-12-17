export const placeholders = {
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
