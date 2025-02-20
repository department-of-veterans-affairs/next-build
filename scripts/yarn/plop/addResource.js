// ts-morph _should_ be installed as a dev dependency
// eslint-disable-next-line import/no-extraneous-dependencies
import { Project, SyntaxKind } from 'ts-morph'

// Initialize a project and add your source file
const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
  skipAddingFilesFromTsConfig: true,
})

/**
 * Plop custom action to add a new resource type to the RESOURCE_TYPES object in resourceTypes.ts
 *
 * @see https://plopjs.com/documentation/#functionsignature-custom-action
 * @param {*} answers
 * @param {*} config
 * @returns void
 */
export const addResource = (answers, config) => {
  const resourceType = `node--${answers.name}`

  const sourceFile = project.addSourceFileAtPath(
    'src/lib/constants/resourceTypes.ts'
  )

  // Find the RESOURCE_TYPES variable declaration
  const resourceTypesVar = sourceFile.getVariableDeclaration('RESOURCE_TYPES')

  if (resourceTypesVar) {
    const initializer = resourceTypesVar.getInitializer()

    if (initializer) {
      const objectLiteral =
        initializer.getKind() === SyntaxKind.AsExpression
          ? initializer.getExpression()
          : initializer

      if (objectLiteral.getKind() === SyntaxKind.ObjectLiteralExpression) {
        const propertyName = answers.name.toUpperCase().replace(/-/g, '_')

        // Check if this resource type already exists
        const properties = objectLiteral
          .asKind(SyntaxKind.ObjectLiteralExpression)
          .getProperties()
        const existingProperty = properties.find((prop) => {
          const initializer = prop.getInitializer()
          return initializer && initializer.getText() === `'${resourceType}'`
        })

        if (existingProperty) {
          return `Resource type '${resourceType}' already exists as ${existingProperty.getName()}`
        }

        try {
          objectLiteral
            .asKind(SyntaxKind.ObjectLiteralExpression)
            .addPropertyAssignment({
              name: propertyName,
              initializer: `'${resourceType}'`,
            })

          // Format the file
          sourceFile.formatText({
            formatter: 'prettier',
            options: {
              printWidth: 120,
              tabWidth: 2,
            },
          })

          // Save changes
          sourceFile.saveSync()
          return 'Resource type added successfully!'
        } catch (error) {
          console.error('Error adding property:', error)
          return `Failed to add resource type: ${error.message}`
        }
      } else {
        // RESOURCE_TYPES is not an object literal :awkward-turtle:
        console.error(
          'Expression is not an object literal:',
          objectLiteral.getKindName()
        )
      }
    }
  }

  return 'Failed to add resource type'
}
