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
        title: 'Benefit 1',
        uri: '/benefit-1',
        summary: 'Benefit 1 Teaser Text',
      },
      {
        title: 'Benefit 2',
        uri: '/benefit-2',
        summary: 'Benefit 2 Teaser Text',
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
