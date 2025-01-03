import { Meta, StoryObj } from '@storybook/react'
import { Wrapper } from '@/templates/layouts/wrapper'
import headerFooterMock from '@/mocks/headerFooter.mock.json'

const meta: Meta<typeof Wrapper> = {
  title: 'Layouts/Wrapper',
  component: Wrapper,
}
export default meta

type Story = StoryObj<typeof Wrapper>

const props = {
  headerFooterData: headerFooterMock,
  bannerData: [],
  preview: false,
  resource: null,
}

export const Example: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <Wrapper {...props}>
      <div style={{ height: '600px' }}></div>
    </Wrapper>
  ),
}
