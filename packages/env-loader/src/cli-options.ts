import { Command, Option } from 'commander'
import { EnvVars } from '.'

type CliOptionsAndArgs = {
  options: EnvVars
  args: string[]
}

type AdditionalHelp = {
  heading: string
  commands: string[]
}

const ADDITIONAL_HELP: AdditionalHelp[] = [
  {
    heading: 'Run unit tests in watch mode',
    commands: ['yarn test -- --watch'],
  },
  {
    heading: 'Unit test specific file',
    commands: ['yarn test -- path/to/file'],
  },
  {
    heading: 'Update unit-test snapshots',
    commands: ['yarn test -- -u'],
  },
  {
    heading: 'Get help for Next build',
    commands: ['yarn build -- -h'],
  },
  {
    heading:
      'Run Next dev server on a specific port and pull data from a specific Drupal instance',
    commands: [
      'yarn dev --NEXT_PUBLIC_DRUPAL_BASE_URL <drupal base url> -- -p <port number>',
    ],
  },
]

const getAdditionalHelpText = (): string => {
  const helpText: string[] = []
  helpText.push(
    'Args can be passed through to the underlying utility by adding them to the end of the command.'
  )
  helpText.push(
    '\nUse "--" to separate the env flags from the args meant for the underlying utility.'
  )
  helpText.push('\nEx:')
  ADDITIONAL_HELP.forEach((helpCommand) => {
    helpText.push(`\n  ${helpCommand.heading}:`)
    helpCommand.commands.forEach((terminalCommand) => {
      helpText.push(`\n    $ ${terminalCommand}`)
    })
  })
  helpText.push('\n')
  return helpText.join('')
}

/**
 * Parses CLI options and arguments from the command line into an object.
 *
 * See https://www.npmjs.com/package/commander#common-option-types-boolean-and-value
 */
export const getCliOptionsAndArgs = (): CliOptionsAndArgs => {
  const program = new Command()

  program
    .passThroughOptions()
    .option('--NEXT_IMAGE_DOMAIN <url>', 'Drupal image domain')
    .option(
      '--NEXT_PUBLIC_ASSETS_URL <url>',
      'Where to source vets-website assets'
    )
    .addOption(
      new Option('--NEXT_PUBLIC_BUILD_TYPE <buildType>', 'Build type').choices([
        'localhost',
        'vagovdev',
        'vagovstaging',
        'vagovprod',
      ])
    )
    .option('--NEXT_PUBLIC_DRUPAL_BASE_URL <url>', 'Drupal base URL')
    .option('--DRUPAL_CLIENT_ID <id>', 'Drupal client ID')
    .option('--DRUPAL_CLIENT_SECRET <secret>', 'Drupal client secret')
    .option('--DRUPAL_PREVIEW_SECRET <secret>', 'Drupal preview secret')
    .option('--DRUPAL_SITE_ID <id>', 'Drupal site ID')
    .addOption(
      new Option('--USE_REDIS <true|false>', 'Enable redis').choices([
        'true',
        'false',
      ])
    )
    .option('--REDIS_URL <url>', 'Redis URL')
    .option('--SITE_URL <url>', 'Origin used for generated absolute paths')
    .addOption(
      new Option(
        '--SSG <true|false>',
        'Run logic in getStaticPaths to generate all page URLs'
      ).choices(['true', 'false'])
    )

  const additionalHelpText = getAdditionalHelpText()
  program.addHelpText('beforeAll', additionalHelpText)

  program.exitOverride()
  try {
    const parsed = program.parse()
    const options = parsed.opts()
    const args = parsed.args

    return {
      options,
      args,
    }
  } catch (err) {
    if (err.code === 'commander.helpDisplayed') {
      return {
        options: {},
        args: ['-h'],
      }
    }

    return {
      options: {},
      args: [],
    }
  }
}
