import { Preview } from '@storybook/react'
import WebComponentProvider from '@/stories/webComponentProvider'

// include global styles here for storybook
import '../src/assets/styles/globals.css'
import '../public/generated/static-pages.css'
// import '../public/generated/style.css' // svg imports break this

const preview: Preview = {
  decorators: [
    (Story) => <WebComponentProvider>{Story()}</WebComponentProvider>,
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'Common',
          'Components',
          'Paragraphs',
          'Layouts',
        ],
      },
    },
  },
}

export default preview
