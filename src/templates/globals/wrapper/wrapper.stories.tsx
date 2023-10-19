import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { Wrapper } from './index'
import headerFooterData from '@/mocks/headerFooter.mock.json'

const meta: Meta<typeof Wrapper> = {
  title: 'Components/Page Wrapper',
  component: Wrapper,
}
export default meta
type Story = StoryObj<typeof Wrapper>

export const PageWrapper: Story = {
  render: () => (
    <Wrapper bannerData={[]} headerFooterData={headerFooterData}>
      <div style={{ minHeight: '30vh' }}></div>
    </Wrapper>
  ),
}
