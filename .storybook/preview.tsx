import { Preview } from '@storybook/react'
import WebComponentProvider from './webComponentProvider'

// include global styles here for storybook
import '../src/assets/styles/globals.css'

const preview: Preview = {
  decorators: [
    (Story) => <WebComponentProvider>{Story()}</WebComponentProvider>,
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Common', 'Components', 'Paragraphs', 'Layouts'],
      },
    },
  },
}

export default preview
