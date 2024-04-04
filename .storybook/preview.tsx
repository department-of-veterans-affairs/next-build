import { Preview } from '@storybook/react'

// include global styles here for storybook
import '../src/assets/styles/globals.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Common', 'Components', 'Paragraphs', 'Layouts'],
      },
    },
  },
}

export default preview
