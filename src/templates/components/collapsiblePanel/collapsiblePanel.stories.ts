import { Meta, StoryObj } from '@storybook/react'
import { CollapsiblePanel } from './index'
import { CollapsiblePanelItem as FormattedCollapsiblePanelItem } from '@/types/formatted/collapsiblePanel'

const meta: Meta<typeof CollapsiblePanel> = {
  title: 'Paragraphs/CollapsiblePanel',
  component: CollapsiblePanel,
}
export default meta

type Story = StoryObj<typeof CollapsiblePanel>

const paragraphs: FormattedCollapsiblePanelItem[] = [
  {
    id: '11111-11111-11111',
    entityId: 11,
    type: 'paragraph--collapsible_panel_item',
    title: 'Heading A',
    wysiwyg: '<p>This is collapsible-panel content A. It includes a table.',
    paragraphs: [
      {
        id: '000000-1111-2222-3333',
        entityId: 111,
        type: 'paragraph--table',
        data: [
          ['X', 'Y', 'Z'],
          ['1', '2', '3'],
          ['4', '5', '6'],
        ],
        title: 'Table Title',
      },
    ],
  },
  {
    id: '22222-22222-22222',
    entityId: 12,
    type: 'paragraph--collapsible_panel_item',
    title: 'Heading B',
    wysiwyg: '<p>This is collapsible-panel content B.',
  },
]

export const Default: Story = {
  args: {
    entityId: 1,
    paragraphs,
  },
}

export const Bordered: Story = {
  args: {
    entityId: 2,
    paragraphs,
    bordered: true,
  },
}

export const OpenSingle: Story = {
  args: {
    entityId: 3,
    paragraphs,
    multiSelect: false,
  },
}

export const StartExpanded: Story = {
  args: {
    entityId: 4,
    paragraphs,
    startExpanded: true,
  },
}
