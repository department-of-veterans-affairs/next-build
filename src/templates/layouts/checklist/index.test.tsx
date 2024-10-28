import React from 'react'
import { render, screen } from '@testing-library/react'
import { Checklist } from './index'

describe('Checklist with valid data', () => {
  const data = {
    alert: {
      alertSelection: 'R',
      blockReference: {
        alertType: 'info',
        content: '<p>If you have 2 or more qualifying periods of active duty, you may now qualify for up to 48 months of entitlement. You must be eligible for benefits through the Post-9/11 GI Bill and either Montgomery GI Bill Active Duty (MGIB-AD) or Montgomery GI Bill Selected Reserve (MGIB-SR).</p><p><strong>Note: </strong>Even if you gave up your right to use MGIB-AD or MGIB-SR benefits in the past (we call this “relinquishing” your benefits), you may now qualify to use some of that entitlement.&nbsp;</p><p><a href="/education/about-gi-bill-benefits/montgomery-active-duty#what-if-im-eligible-for-more-t" data-entity-type="node" data-entity-uuid="ba4617ed-4c37-4a40-a770-ed9a087a1a2c" data-entity-substitution="canonical" title="Montgomery GI Bill Active Duty (MGIB-AD)">Find out if you can use more than 1 education benefit</a>&nbsp;</p>',
        title: 'You may qualify for additional entitlement under more than 1 education benefit'
      },
      id: '1',
      type: 'paragraph--alert_single'
    },
    benefitsHubLinks: [
      {
        uri: '/health-care',
        summary: 'Apply for VA health care, find out how to access services, and manage your health and benefits online.',
        title: 'VA health care'
      },
      {
        uri: '/burials-memorials',
        summary: `Get help planning a burial in a VA national cemetery, order a headstone or other memorial item to honor a Veteran's service, and apply for survivor and dependent benefits.`,
        title: 'VA burial benefits and memorial items'
      }
    ],
    buttons: [
      {
        label: 'CTA one',
        url: 'https://www.va.gov'
      },
      {
        label: 'CTA two',
        url: 'https://www.va.gov'
      }
    ],
    checklist: [
      {
        header: 'Header one',
        intro: 'Intro one',
        items: [
          'First: checklist section one, item one',
          'Second: checklist section one, item two',
          'Third: checklist section one, item three'
        ]
      },
      {
        header: 'Header two',
        intro: 'Intro two',
        items: [
          'First: checklist section two, item one',
          'Second: checklist section two, item two.',
          'Third: checklist section two, item three'
        ]
      },
      {
        header: null,
        intro: 'Intro three',
        items: [
          'First: checklist section three, item one',
          'Second: checklist section three, item two'
        ]
      }
    ],
    contactInformation: {
      additionalContact: {
        address: 'test@va.gov',
        label: 'Talk to all the VA people:'
      },
      benefitHubContacts: [
        {
          id: '45',
          href: 'tel: 1-888-442-4551',
          title: 'GI Bill Hotline:',
          value: '888-GIBILL-1 (888-442-4551)'
        },
        {
          id: '46',
          href: 'tel: 1-918-781-5678',
          title: 'Students Outside the U.S.:',
          value: '+1-918-781-5678'
        }
      ],
      contactType: 'BHC',
      defaultContact: {
        href: 'tel:1-800-698-2411',
        title: 'MyVA411 main information line:',
        value: '800-698-2411'
      }
    },
    intro: '<p>This is the page introduction. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce cursus malesuada neque, id mattis ligula venenatis dapibus. Nulla purus ligula, ultricies id maximus eu, venenatis eu nulla. Suspendisse auctor turpis non iaculis molestie. Mauris luctus libero erat, sed tempor est hendrerit eu. Cras sodales egestas mi, et porta sapien pharetra eget. Pellentesque ornare metus sed eros ornare porta. Sed egestas, felis sed imperdiet commodo, eros mauris venenatis velit, vitae mattis augue velit sed lectus.</p>\n',
    lastUpdated: '2024-10-16T20:04:12+00:00',
    relatedInformation: [
      {
        id: '23',
        summary: 'Link teaser one',
        title: 'Teasing this link',
        uri: 'https://www.va.gov'
      },
      {
        id: '24',
        summary: 'Link teaser two',
        title: "Ooh, don't you want to see what's here?",
        uri: 'https://www.va.gov'
      }
    ],
    repeatButtons: true,
    tags: {
      tags: [
        {
          id: '1',
          categoryLabel: 'Topics',
          href: '/resources/tag/fraud-and-identity-theft-prevention',
          name: 'Fraud and identity theft prevention'
        },
        {
          id: '2',
          categoryLabel: 'Topics',
          href: '/resources/tag/guide-and-service-dogs',
          name: 'Guide and service dogs'
        }
      ]
    },
    title: 'Test Checklist Page'
  }

  test('renders Checklist component', () => {
    const { container } = render(
      <Checklist
        id=""
        type=""
        published={false}
        {...data}
      />
    )

    // Header and intro
    expect(screen.getByText('Test Checklist Page')).toBeInTheDocument()
    expect(container.innerHTML).toContain('This is the page introduction')

    // Alert
    expect(container.innerHTML).toContain('You may qualify for additional entitlement under more than 1 education benefit')

    // CTAs
    expect(container.innerHTML).toContain('CTA one')
    expect(container.innerHTML).toContain('CTA two')

    // First header, intro, checklist
    expect(screen.getByText('Header one')).toBeInTheDocument()
    expect(screen.getByText('Intro one')).toBeInTheDocument()
    expect(container.innerHTML).toContain('First: checklist section one, item one')
    expect(container.innerHTML).toContain('Second: checklist section one, item two')
    expect(container.innerHTML).toContain('Third: checklist section one, item three')

    // Second header, intro, checklist
    expect(screen.getByText('Header two')).toBeInTheDocument()
    expect(screen.getByText('Intro two')).toBeInTheDocument()
    expect(container.innerHTML).toContain('First: checklist section two, item one')
    expect(container.innerHTML).toContain('Second: checklist section two, item two')
    expect(container.innerHTML).toContain('Third: checklist section two, item three')

    // Third intro, checklist
    expect(screen.getByText('Intro three')).toBeInTheDocument()
    expect(container.innerHTML).toContain('First: checklist section three, item one')
    expect(container.innerHTML).toContain('Second: checklist section three, item two')

    // Tags
    expect(screen.getByText('Fraud and identity theft prevention')).toBeInTheDocument()
    expect(screen.getByText('Guide and service dogs')).toBeInTheDocument()

    // Rate Your Experience
    expect(container.innerHTML).toContain('How do you rate your experience on this page?')

    // Related information
    expect(screen.getByText('Related information')).toBeInTheDocument()
    expect(container.innerHTML).toContain('Teasing this link')
    expect(screen.getByText('Link teaser one')).toBeInTheDocument()
    expect(container.innerHTML).toContain(`Ooh, don't you want to see what's here?`)
    expect(screen.getByText('Link teaser two')).toBeInTheDocument()

    // VA benefits
    expect(screen.getByText('VA benefits')).toBeInTheDocument()
    expect(container.innerHTML).toContain('Health care')
    expect(screen.getByText('Apply for VA health care, find out how to access services, and manage your health and benefits online.')).toBeInTheDocument()
    expect(container.innerHTML).toContain('Burials and memorials')
    expect(screen.getByText(`Get help planning a burial in a VA national cemetery, order a headstone or other memorial item to honor a Veteran's service, and apply for survivor and dependent benefits.`)).toBeInTheDocument()

    // Contact information
    expect(screen.getByText('Need more help?')).toBeInTheDocument()
    expect(screen.getByText('888-GIBILL-1 (888-442-4551)')).toBeInTheDocument()
    expect(screen.getByText('+1-918-781-5678')).toBeInTheDocument()

    // Content footer
    expect(container.innerHTML).toContain('<va-back-to-top>')
    expect(screen.getByText('October 16, 2024')).toBeInTheDocument()
    expect(container.innerHTML).toContain('Feedback')
  })
})
