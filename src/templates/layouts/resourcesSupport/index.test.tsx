import React from 'react'
import { render, screen } from '@testing-library/react'
import { ResourcesSupport } from './'
import { Button } from '@/types/formatted/button'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { AudienceTopics } from '@/types/formatted/audienceTopics'
import { ContactInfo } from '@/types/formatted/contactInfo'

describe('<ResourcesSupport /> Component', () => {
  const resourcesSupportProps = {
    title: 'Test Title',
    intro: '<p>Test Intro</p>',
    alert: null,
    buttons: [
      {
        id: '1',
        label: 'Button 1',
        url: '/button-1',
        type: 'paragraph--button' as Button['type'],
      },
      {
        id: '2',
        label: 'Button 2',
        url: '/button-2',
        type: 'paragraph--button' as Button['type'],
      },
    ],
    repeatButtons: true,
    toc: true,
    mainContent: [
      {
        id: '1',
        html: 'If you need support...',
        className: '',
        type: 'paragraph--wysiwyg' as Wysiwyg['type'],
      },
    ],
    tags: {
      type: 'paragraph--audience_topics' as AudienceTopics['type'],
      id: '1',
      tags: [
        {
          id: '1',
          name: 'Test Audience',
          href: '/audience',
          categoryLabel: 'Audience Category',
        },
        {
          id: '2',
          name: 'Test Topic',
          href: '/topic',
          categoryLabel: 'Topic Category',
        },
      ],
    },
    contactInformation: {
      id: '1',
      type: 'paragraph--contact_information' as ContactInfo['type'],
      contactType: 'DC' as ContactInfo['contactType'],
      defaultContact: {
        name: 'Test Name',
        phone: '123-456-7890',
        email: 'test@example.com',
        title: 'Test contact title',
        value: 'Test Value',
        href: '/test-contact-href/',
      },
    },
    benefitsHubLinks: [
      {
        id: '1',
        title: 'Benefit 1',
        label: 'Benefit 1 Label',
        path: '/benefit-1',
        teaserText: 'Benefit 1 Teaser Text',
      },
      {
        id: '2',
        title: 'Benefit 2',
        label: 'Benefit 2 Label',
        path: '/benefit-2',
        teaserText: 'Benefit 2 Teaser Text',
      },
    ],
    lastUpdated: '2024-03-22',
  }

  beforeEach(() => {
    render(
      <ResourcesSupport
        id={''}
        type={''}
        published={false}
        {...resourcesSupportProps}
      />
    )
  })

  it('renders all information correctly', () => {
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Intro')).toBeInTheDocument()
    expect(screen.getByText('If you need support...')).toBeInTheDocument()
    expect(screen.getByText('Test Audience')).toBeInTheDocument()
    expect(screen.getByText('Test Topic')).toBeInTheDocument()
    expect(screen.getByText('Test contact title')).toBeInTheDocument()
  })
})
