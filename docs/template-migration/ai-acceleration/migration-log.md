# Migration Log

## 2024-03-21 - Initial Setup

### VAMC System Content Type Template Setup
- Generated new content type template using `yarn plop` with `vamc_system` as the content type name
- This command created the following files:
  - `playwright/tests/vamcSystem.spec.js` - Initial page tests
  - `src/data/queries/tests/vamcSystem.test.tsx` - Data query tests
  - `src/data/queries/vamcSystem.ts` - Data fetching implementation
  - `src/lib/constants/resourceTypes.ts` - Added VAMC system resource type
  - `src/mocks/vamcSystem.mock.json` - Mock data file
  - `src/templates/layouts/vamcSystem/index.test.tsx` - Component tests
  - `src/templates/layouts/vamcSystem/index.tsx` - Main component
  - `src/templates/layouts/vamcSystem/vamcSystem.stories.ts` - Storybook stories
  - `src/types/formatted/vamcSystem.ts` - Type definitions

### Template Integration
- Integrated the VAMC system template into the application:
  - Added VAMC system to `PAGE_RESOURCE_TYPES` in `src/lib/constants/resourceTypes.ts`
  - Imported and added VAMC system query to `QUERIES_MAP` in `src/data/queries/index.ts`
  - Added VAMC system component to the main page router in `src/pages/[[...slug]].tsx`
- Fixed duplicate resource type entry:
  - Removed duplicate `VAMC_SYSTEM: 'node--vamc_system'` entry from `RESOURCE_TYPES`
  - Kept original `VAMC_SYSTEM: 'node--health_care_region_page'` value

### Node Type Definition Process
- Node types are defined based on actual API responses from the Drupal CMS
- Process for defining node types:
  1. Query the Drupal API for a sample of the content type
  2. Analyze the returned JSON structure
  3. Define only the fields that will be used in the application
  4. Add the type definition to `src/types/drupal/node.ts`
- For the VAMC system type:
  - Initial API response showed many fields including:
    - Basic fields (title, description, intro_text)
    - Media fields (field_media)
    - Administration fields (field_administration)
    - Social media links (field_facebook, field_twitter, etc.)
    - Health services (field_clinical_health_services)
    - And many more
  - Initially defined only essential fields:
    ```typescript
    export interface NodeVamcSystem extends DrupalNode {
      field_description: string
      field_intro_text: string
      field_media: DrupalMediaImage
      field_administration: FieldAdministration
    }
    ```
  - Additional fields can be added as needed when implementing specific features

### Next Steps
- Begin migrating liquid template components to Next.js components
- Set up necessary data fetching and routing
- Implement responsive design and accessibility features
- Add more fields to the node type definition as needed for specific features
