import { Meta, StoryObj } from '@storybook/react'
import { ReactWidget } from './index'

const meta: Meta<typeof ReactWidget> = {
  title: 'Paragraphs/ReactWidget',
  component: ReactWidget,
}
export default meta

type Story = StoryObj<typeof ReactWidget>

export const Default: Story = {
  args: {
    entityId: 0,
    widgetType: 'pension-app-status',
  },
}

export const CtaWidget: Story = {
  args: {
    entityId: 0,
    ctaWidget: true,
    widgetType: 'direct-deposit',
  },
}
