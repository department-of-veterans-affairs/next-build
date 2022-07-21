// include global styles here for storybook
import '../src/styles/globals.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
    method: 'alphabetical',
      order: [
        'Introduction',
        'Components',
        'Paragraphs',
        'Node'
      ],
    }
  }
}
