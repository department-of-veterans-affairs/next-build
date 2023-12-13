import { Meta, StoryObj } from '@storybook/react'
import Breadcrumbs from '.'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
}
export default meta

type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  args: {
    breadcrumbs: [
      { uri: '/home', title: 'Home', options: [] },
      { uri: '/about', title: 'About', options: [] },
    ],
  },
}

// todo: breadcrumbsOverride not typed correctly
// export const WithOverride: Story = {
//   args: {
//     breadcrumbs: [
//       { uri: '/home', title: 'Home', options: [] },
//       { uri: '/about', title: 'About', options: [] },
//     ],
//     breadcrumbsOverride: [
//       { uri: '/home', title: 'Start', options: [] },
//       { uri: '/about', title: 'Details', options: [] },
//     ],
//   }
// }
