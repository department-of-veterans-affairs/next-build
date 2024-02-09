import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  // Required
  framework: '@storybook/nextjs',
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  // Optional
  staticDirs: ['../public'], // include vets-website assets
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  docs: {
    autodocs: true,
  },
}

export default config
