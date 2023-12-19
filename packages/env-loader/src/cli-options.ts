import { Command, Option } from 'commander'
import { EnvVars } from '.'

type AdditionalHelp = {
  heading: string
  commands: string[]
}

const ADDITIONAL_HELP: { [key: string]: AdditionalHelp[] } = {
  test: [
    {
      heading: 'Update Snapshots',
      commands: ['yarn test:update-snapshots', 'yarn test:u'],
    },
  ],
}

const formatHelpText = (
  scriptName: string,
  helpCommands: AdditionalHelp[]
): string => {
  const outputLines: string[] = []
  outputLines.push(`Additional \`${scriptName}\` commands:`)
  helpCommands.forEach((helpCommand) => {
    outputLines.push(`\n  ${helpCommand.heading}:`)
    helpCommand.commands.forEach((terminalCommand) => {
      outputLines.push(`\n    $ ${terminalCommand}`)
    })
  })
  outputLines.push('\n')

  return outputLines.join('')
}

const configureAdditionalHelpText = (
  program: Command,
  scriptName: string
): void => {
  const additionalHelp = ADDITIONAL_HELP[scriptName]
  if (additionalHelp) {
    program.addHelpText('beforeAll', formatHelpText(scriptName, additionalHelp))
  }
}

/**
 * Parses CLI options from the command line into an object.
 */
export const getCliOptions = (scriptName: string): EnvVars => {
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

  configureAdditionalHelpText(program, scriptName)

  return program.parse().opts()
}
