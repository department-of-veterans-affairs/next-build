import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  // Required
  framework: '@storybook/nextjs',
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  // Optional
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  docs: {
    autodocs: true,
  },

  // previewBody: (body) => `
  //   ${body}
  //   <script src="/generated/static-pages.entry.js"></script>
  // `,
}

export default config
