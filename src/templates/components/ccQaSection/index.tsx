import { FormattedCcQaSection } from '@/types/formatted/ccQaSection'
import { Fragment } from 'react'

export function CCQaSection(props: FormattedCcQaSection) {
  return (
    <div data-template="paragraphs/q_a_section" data-entity-id={props.id}>
      {/* Header */}
      {/* Intro */}
      {/* QaCollapsiblePanel */}
      {/* va-accordion */}
      <div data-template="paragraphs/q_a.collapsible_panel">
        <va-accordion>
          {props.questions.map((qa, index) => (
            // va-accordion-item
            <va-accordion-item key={qa.id}></va-accordion-item>
          ))}
        </va-accordion>
      </div>
    </div>
  )
}
