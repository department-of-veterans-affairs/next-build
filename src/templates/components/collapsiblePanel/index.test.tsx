import { render, screen } from '@testing-library/react'
import { CollapsiblePanel } from './index'
import { CollapsiblePanel as FormattedCollapsiblePanel } from '@/types/formatted/collapsiblePanel'

const data: FormattedCollapsiblePanel = {
  type: 'paragraph--collapsible_panel',
  id: '02c2a0af-ba08-4c24-a4d6-a9dd812e8ee5',
  entityId: 3802,
  paragraphs: [
    {
      type: 'paragraph--collapsible_panel_item',
      id: '4c3b8528-abb6-421a-a56b-80652ce05d37',
      entityId: 3801,
      title: 'Pharmacy (prescriptions and medical supplies)',
      wysiwyg:
        '<p>[National blurb] Your VA health care benefits include prescription medicines and many medical supplies, either free or at reduced rates depending on the medication, your eligibility status, and other factors. [LINK TO 2019 COPAY RATES – NEW NATIONAL URL TBD]</p>\n\n<p>[Regional blurb] New prescriptions can be picked up in person at our Pittsburgh pharmacies. Refills are available online, by phone or mail. We also offer safe disposal of medicines.</p>\n\n<h2>Refill your prescriptions online, by phone or mail</h2>\n\n<h3>Pick up new prescriptions</h3>\n\n<p><strong>University Drive campus</strong><br>\nUniversity Drive C<br>\nBuilding 1<br>\nPittsburgh, PA 15240-1003</p>\n\n<h4>Pharmacy hours</h4>\n\n<p>7:30 a.m. – 9:00 p.m. ET, Mon – Fri<br>\n7:30 a.m. – 4:00 p.m. ET, Sat, Sun, and holidays</p>\n\n<p><strong>Heinz campus</strong><br>\n1010 Delafield Road<br>\nBuilding 71<br>\nPittsburgh, PA 15215</p>\n\n<h4>Pharmacy hours</h4>\n\n<p>8:00 a.m. – 4:30 p.m. ET, Mon – Fri</p>\n\n<h2>Questions about your prescriptions</h2>\n\n<h3>Pharmacy support</h3>\n\n<p>866-400-1242<br>\n8:00 a.m. – 4:30 p.m. ET, Mon – Fri</p>\n\n<h3>Safely dispose your medicine</h3>\n\n<p>Drop off your expired or unwanted medicine at a MedSafe box. The large blue boxes are located at:</p>\n\n<ul><li>Heinz campus, Building 51, Community Living Center</li>\n\t<li>University Drive campus, Building 1</li>\n</ul>',
      paragraphs: [],
    },
    {
      type: 'paragraph--collapsible_panel_item',
      id: '0000-1111-2222-3333',
      entityId: 1,
      title: 'Another Panel Item',
      wysiwyg: '<p>This is another collapsible panel item</p>',
      paragraphs: [],
    },
  ],
}

describe('<CollapsiblePanel> with valid data', () => {
  test('renders <CollapsiblePanel /> with defaults', () => {
    render(<CollapsiblePanel {...data} />)
    const vaAccordion = document.querySelector('va-accordion')
    expect(vaAccordion).not.toBeNull()
    expect(vaAccordion).not.toHaveAttribute('bordered')
    expect(vaAccordion).not.toHaveAttribute('open-single')

    const vaAccordionItems = document.querySelectorAll(
      'va-accordion va-accordion-item'
    )
    vaAccordionItems.forEach((element) => {
      expect(element).not.toHaveAttribute('open')
    })
  })

  test('renders <CollapsiblePanel /> with first panel initially expanded', () => {
    render(<CollapsiblePanel {...data} startExpanded={true} />)
    const vaAccordion = document.querySelector('va-accordion')
    const vaAccordionItems = document.querySelectorAll(
      'va-accordion va-accordion-item'
    )

    expect(vaAccordionItems[0]).toHaveAttribute('open')
  })

  test('renders <CollapsiblePanel /> with all expected panels', () => {
    render(<CollapsiblePanel {...data} />)
    const vaAccordion = document.querySelector('va-accordion')
    expect(vaAccordion).not.toBeNull()
    expect(vaAccordion).not.toHaveAttribute('bordered')
    expect(vaAccordion).not.toHaveAttribute('open-single')

    const vaAccordionItems = document.querySelectorAll(
      'va-accordion va-accordion-item'
    )
    expect(vaAccordionItems.length).toBe(2)
    expect(
      screen.queryByText(/Pharmacy \(prescriptions and medical supplies\)/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Another Panel Item/)).toBeInTheDocument()
  })
})
