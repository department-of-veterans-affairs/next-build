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

### Next Steps
- Begin migrating liquid template components to Next.js components
- Set up necessary data fetching and routing
- Implement responsive design and accessibility features
