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

### Original Template Preservation

- Copied the original Drupal liquid template to `src/templates/layouts/vamcSystem/_old_template.drupal.liquid`
- This template serves as a reference for:
  - Understanding the current functionality
  - Identifying required data fields
  - Maintaining feature parity during migration
  - Verifying the migrated implementation
- The template includes several key sections:
  - Header and navigation
  - Main content area with:
    - Facility image
    - Main action buttons
    - Locations section
    - "Manage your health online" section
    - Related links
    - Stories and events sections
    - Social media links
  - Footer elements

### Component Props and Type Definition Methodology

- Component Props Analysis:
  1. Referenced the main page router (`src/pages/[[...slug]].tsx`) to see how the component is being used:
     ```typescript
     {resource.type === RESOURCE_TYPES.VAMC_SYSTEM && (
       <VamcSystem {...(resource as FormattedVamcSystem)} />
     )}
     ```
  2. This showed that the component receives a `FormattedVamcSystem` type as its props
  3. The spread operator (`...`) indicates all fields from the type are passed as props

- Type Definition and Data Transformation:
  1. Analyzed the liquid template (`_old_template.drupal.liquid`) to identify all fields being used
  2. Cross-referenced with the API response to understand the data structure
  3. Determined necessary fields by:
     - Looking for direct field usage in the template (e.g., `{{ title }}`, `{{ fieldIntroText }}`)
     - Identifying fields used in conditional logic (e.g., `{% if fieldAdministration.entity.entityId != '1039' %}`)
     - Noting fields used in includes and partials
     - Checking for fields used in URL construction (e.g., `{{ entityUrl.path }}/locations`)
  4. Updated the `FormattedVamcSystem` type in `src/types/formatted/vamcSystem.ts` to match:
     - The output of the formatter function
     - The needs of the React component
     - The fields identified in the liquid template
  5. Implemented the formatter function in `src/data/queries/vamcSystem.ts` to:
     - Convert Drupal's snake_case field names to camelCase
     - Transform the raw Drupal data into the `FormattedVamcSystem` type
     - Handle any necessary data structure transformations
  6. Added nullability where appropriate (e.g., `fieldInstagram: FieldLink | null`)
  7. Used existing type definitions from the codebase (e.g., `DrupalMediaImage`, `FieldLink`)

### Initial React Component Implementation

- Created initial component structure in `src/templates/layouts/vamcSystem/index.tsx`
- Implemented basic component structure with:
  - Title and image display
  - Main action buttons placeholder
  - Locations section with "See all locations" link
  - "Manage your health online" section (conditionally rendered)
- Added placeholders for future components:
  - Related links
  - Stories section
  - Events section
  - Social links
- Added TODO comments for components that need to be implemented:
  - Main buttons component
  - Facility listing component
  - Health online links component
  - List of link teasers component
  - Stories section
  - Events section
  - Social links component

### Next Steps

- Begin migrating liquid template components to Next.js components
- Set up necessary data fetching and routing
- Implement responsive design and accessibility features
- Add more fields to the node type definition as needed for specific features
- Break down the template into smaller, reusable components
- Implement the TODO components:
  - Main buttons component
  - Facility listing component
  - Health online links component
  - List of link teasers component
  - Stories section
  - Events section
  - Social links component
