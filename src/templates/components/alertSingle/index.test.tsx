import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AlertSingle } from './'
import { AlertBlock, AlertNonReusable } from '@/types/formatted/alert'
import { AlertSingle as FormattedAlertSingle } from '@/types/formatted/alert'
import { ParagraphComponent } from '@/types/formatted/paragraph'

describe('AlertSingle Component', () => {
  const blockReference: AlertBlock = {
    id: 'block-ref-id',
    alertType: 'info',
    title: 'Block Reference Title',
    content: {
      id: 'et-1',
      type: 'paragraph--expandable_text',
      header: 'Block Reference Header',
      text: 'Block reference content text.',
    },
  }

  const nonReusableRef: AlertNonReusable = {
    id: 'non-reusable-ref-id',
    type: 'paragraph--non_reusable_alert',
    alertType: 'warning',
    heading: 'Non-Reusable Reference Title',
    paragraphs: [
      {
        id: 'w-01',
        type: 'paragraph--wysiwyg',
        html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
      },
    ],
  }

  const alertSingleData: ParagraphComponent<FormattedAlertSingle> = {
    id: 'as-01',
    alertSelection: null,
    blockReference,
    nonReusableRef,
  }

  it('renders nothing if alertSelection is not provided', () => {
    render(<AlertSingle {...alertSingleData} />)
    expect(screen.queryByText(/Block Reference Title/)).toBeNull()
    expect(screen.queryByText(/Non-Reusable Reference Title/)).toBeNull()
  })

  it('renders blockReference content for alertSelection "R"', () => {
    const data: ParagraphComponent<FormattedAlertSingle> = {
      ...alertSingleData,
      alertSelection: 'R',
    }
    render(<AlertSingle {...data} />)
    expect(screen.getByText(/Block Reference Title/)).toBeInTheDocument()
  })

  it('renders nonReusableRef content for alertSelection "NR"', () => {
    const data: ParagraphComponent<FormattedAlertSingle> = {
      ...alertSingleData,
      alertSelection: 'NR',
    }
    render(<AlertSingle {...data} />)
    expect(screen.getByText(/Non-Reusable Reference Title/)).toBeInTheDocument()
  })
})
