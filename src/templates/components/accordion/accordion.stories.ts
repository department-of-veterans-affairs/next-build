import { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './'
import { AccordionItem as FormattedAccordionItem } from '@/types/formatted/accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
}
export default meta

type Story = StoryObj<typeof Accordion>

const accordionData: FormattedAccordionItem[] = [
  {
    type: 'paragraph--basic_accordion',
    id: '1',
    header: 'First Header',
    html: '<p>Content for the first item</p>',
  },
  {
    type: 'paragraph--basic_accordion',
    id: '2',
    header: 'Second Header',
    html: '<p>Content for the second item</p>',
  },
]

export const BorderedAccordion: Story = {
  args: {
    id: 'bordered-accordion',
    bordered: true,
    items: accordionData,
  },
}

export const DefaultAccordion: Story = {
  args: {
    id: 'default-accordion',
    bordered: false,
    items: accordionData,
  },
}
