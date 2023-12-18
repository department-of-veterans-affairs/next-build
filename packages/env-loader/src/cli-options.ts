import { Command, Option } from 'commander'
import { EnvVars } from '.'

/**
 * Parses CLI options from the command line into an object.
 */
export const getCliOptions = (): EnvVars => {
  const program = new Command()
  program
    .option('--NEXT_IMAGE_DOMAIN <url>', 'Drupal image domain')
    .option(
      '--NEXT_PUBLIC_ASSETS_URL <url>',
      'Where to source vets-website assets'
    )
    .addOption(
      new Option('--NEXT_PUBLIC_BUILD_TYPE <buildType>', 'Build type').choices([
        'localhost',
        'vaogvdev',
        'vagovstaging',
        'vagovprod',
      ])
    )
    .option('--NEXT_PUBLIC_DRUPAL_BASE_URL <url>', 'Drupal base URL')
    .option('--DRUPAL_CLIENT_ID <id>', 'Drupal client ID')
    .option('--DRUPAL_CLIENT_SECRET <secret>', 'Drupal client secret')
    .option('--DRUPAL_PREVIEW_SECRET <secret>', 'Drupal preview secret')
    .option('--DRUPAL_SITE_ID <id>', 'Drupal site ID')
    .option('--REDIS_URL <url>', 'Redis URL')
    .option('--SITE_URL <url>', 'Origin used for generated absolute paths')
    .parse()

  return program.opts()
}
