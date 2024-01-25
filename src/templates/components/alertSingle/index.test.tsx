import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AlertSingle } from './'

describe('AlertSingle Component', () => {
  const blockReference = {
    id: 'block-ref-id',
    alertType: 'info',
    title: 'Block Reference Title',
    content: {
      header: 'Block Reference Header',
      text: 'Block reference content text.',
    },
  }

  const nonReusableRef = {
    id: 'non-reusable-ref-id',
    alertType: 'warning',
    title: 'Non-Reusable Reference Title',
    content: {
      header: 'Non-Reusable Reference Header',
      text: 'Non-reusable reference content text.',
    },
  }

  it('renders nothing if alertSelection is not provided', () => {
    render(
      <AlertSingle
        alertSelection={null}
        blockReference={blockReference}
        nonReusableRef={nonReusableRef}
      />
    )
    expect(screen.queryByText(/Block Reference Title/)).toBeNull()
    expect(screen.queryByText(/Non-Reusable Reference Title/)).toBeNull()
  })

  it('renders blockReference content for alertSelection "R"', () => {
    render(
      <AlertSingle
        alertSelection="R"
        blockReference={blockReference}
        nonReusableRef={nonReusableRef}
      />
    )
    expect(screen.getByText(/Block Reference Title/)).toBeInTheDocument()
  })

  it('renders nonReusableRef content for alertSelection "NR"', () => {
    render(
      <AlertSingle
        alertSelection="NR"
        blockReference={blockReference}
        nonReusableRef={nonReusableRef}
      />
    )
    expect(screen.getByText(/Non-Reusable Reference Title/)).toBeInTheDocument()
  })
})
