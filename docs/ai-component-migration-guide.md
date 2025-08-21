# AI Component Migration Guide

## Overview

This guide provides instructions for AI agents to systematically migrate component code files from their dispersed locations (`src/templates/common`, `src/templates/components`, `src/data/queries`, `src/types/formatted`, `src/mocks`) to the new consolidated component structure in `src/components/`. Each component should be migrated individually, with thorough testing and error resolution before proceeding to the next component.

## Migration Process

### 1. Pre-Migration Analysis

Before executing the migration commands for each component:

1. **Verify Component Structure**: Check if the component has the following files that need migration:

   - Template component in `src/templates/common/{componentName}/` OR `src/templates/components/{componentName}/`
   - Query file at `src/data/queries/{componentName}.ts` (if applicable)
   - Query test file in `src/data/queries/tests/{componentName}.test.ts` (if applicable)
   - Formatted type file at `src/types/formatted/{componentName}.ts` (if applicable)
   - Mock file in `src/mocks/{componentName}.mock.{js|json}` (if applicable)

2. **Check Dependencies**: Search the codebase for any imports or references to the component files that will be moved.

3. **Identify Component Type**: Determine if this is a:
   - **Template component** (from `src/templates/components/`) - Usually has query, types, mocks
   - **Common component** (from `src/templates/common/`) - Usually just template + tests
   - **Standalone query** (from `src/data/queries/`) - Query that might not have a template yet

### 2. Execute Migration Commands

Follow these manual steps to migrate the component:

#### Step 2.1: Create Component Directory

```bash
mkdir -p src/components/{componentName}
```

#### Step 2.2: Identify and Move Template Files

First, determine where the template exists:

```bash
# Check if component exists in common templates
ls src/templates/common/{componentName}/ 2>/dev/null
# OR check if component exists in template components
ls src/templates/components/{componentName}/ 2>/dev/null
```

Then move template files:

```bash
# For each file in the source directory:
# - If it's index.tsx, rename to template.tsx
# - If it's index.test.tsx, rename to template.test.tsx
# - Otherwise, keep the original name

# Example commands:
mv src/templates/common/{componentName}/index.tsx src/components/{componentName}/template.tsx
mv src/templates/common/{componentName}/index.test.tsx src/components/{componentName}/template.test.tsx
# Move any additional files (sub-components, utilities, etc.)
mv src/templates/common/{componentName}/* src/components/{componentName}/
```

#### Step 2.3: Move Query File (if exists)

```bash
# Check if query file exists
ls src/data/queries/{componentName}.ts 2>/dev/null
# If it exists, move it
mv src/data/queries/{componentName}.ts src/components/{componentName}/query.ts
```

#### Step 2.4: Move Query Test File (if exists)

```bash
# Check for query test file
ls src/data/queries/tests/{componentName}.test.* 2>/dev/null
# If it exists, move and rename
mv src/data/queries/tests/{componentName}.test.tsx src/components/{componentName}/query.test.ts
# OR
mv src/data/queries/tests/{componentName}.test.ts src/components/{componentName}/query.test.ts
```

#### Step 2.5: Move Test Snapshots (if exist)

```bash
# Create snapshots directory and move snapshot files
mkdir -p src/components/{componentName}/__snapshots__
mv src/data/queries/tests/__snapshots__/{componentName}.test.tsx.snap src/components/{componentName}/__snapshots__/query.test.ts.snap 2>/dev/null || true
```

#### Step 2.6: Move Formatted Type File (if exists)

```bash
# Check if formatted type file exists
ls src/types/formatted/{componentName}.ts 2>/dev/null
# If it exists, move it
mv src/types/formatted/{componentName}.ts src/components/{componentName}/formatted-type.ts
```

#### Step 2.7: Move Mock File (if exists)

```bash
# Check for mock file (could be .js or .json)
ls src/mocks/{componentName}.mock.* 2>/dev/null
# Move and rename, preserving extension
mv src/mocks/{componentName}.mock.json src/components/{componentName}/mock.json 2>/dev/null || true
mv src/mocks/{componentName}.mock.js src/components/{componentName}/mock.js 2>/dev/null || true
```

#### Step 2.8: Clean Up Empty Directories

```bash
# Remove empty template directory
rmdir src/templates/common/{componentName} 2>/dev/null || true
rmdir src/templates/components/{componentName} 2>/dev/null || true
```

#### Step 2.9: Update Import References

Use search and replace tools to update all import paths across the codebase:

**Template imports:**

- Find: `@/templates/common/{componentName}`
- Replace: `@/components/{componentName}/template`
- Find: `@/templates/components/{componentName}`
- Replace: `@/components/{componentName}/template`

**Query imports:**

- Find: `@/data/queries/{componentName}`
- Replace: `@/components/{componentName}/query`

**Type imports:**

- Find: `@/types/formatted/{componentName}`
- Replace: `@/components/{componentName}/formatted-type`

**Mock imports:**

- Find: `@/mocks/{componentName}.mock`
- Replace: `@/components/{componentName}/mock`

#### Step 2.10: Skip CODEOWNERS Update

**Note**: CODEOWNERS updates are not required for component migrations. Skip this step.

### 3. Post-Migration Error Resolution

After executing the migration commands, you **MUST**:

1. **Run TypeScript Check**:

```bash
npx tsc --noEmit
```

2. **Fix Import/Export Issues**: Common errors to resolve:

   - **Missing export statements**: Ensure the moved files properly export their main functions/types
   - **Import path updates**: Verify all import statements are correctly updated to new paths
   - **Circular dependencies**: Check for any new circular import issues
   - **Index file updates**: Update any index.ts files that re-export the moved modules

3. **Update Template References**: Check if any template files need updates:

   - Component exports in moved template files
   - Component imports in other files
   - Test file imports and references

4. **Verify Query Integration**: Ensure (if applicable):

   - Query exports match expected function signatures
   - Query imports in the main queries index file are correct
   - Type exports are properly accessible

5. **Fix Internal Import Paths**: Update imports within the moved files:

   - **In `formatted-type.ts`**: Update relative imports to absolute paths (e.g., `./publishedEntity` → `@/types/formatted/publishedEntity`)
   - **In `query.ts`**: Update imports like `import { queries } from '.'` → `import { queries } from '@/data/queries'`
   - **In `template.test.tsx`**: Update imports like `import { Component } from './index'` → `import { Component } from './template'`
   - **In `query.test.ts`**: Update imports like `import { params } from '../{componentName}'` → `import { params } from './query'`

6. **Test File Validation**:
   - Run the specific tests for the migrated component
   - Fix any broken test imports or mocks
   - Update snapshot tests if paths changed

### 4. Verification Steps

Before considering the migration complete:

1. **Test Suite**: Run tests specifically related to the migrated component

```bash
npm test -- src/components/{componentName}/template.test.tsx
npm test -- src/components/{componentName}/query.test.ts
```

2. **Import Validation**: Verify that all import updates were successful by searching for old import paths

3. **Manual Review**: Run the dev server (`yarn dev`) to ensure no compilation errors, asking the human to view a relevant page in a browser to make sure it loads

### 5. Commit Changes

Once all errors are resolved and verification is complete:

1. **Stage Changes**: Add all modified and moved files

```bash
git add .
```

2. **Commit**: Create a descriptive commit message

```bash
git commit -m "migrate: move {componentName} to components directory

- Migrated {componentName} component files to src/components/{componentName}/
- Moved and renamed index.tsx -> template.tsx
- Moved and renamed index.test.tsx -> template.test.tsx
[List other moved files: query.ts, formatted-type.ts, mock.json, etc.]
- Updated all import statements across the codebase
- Fixed import paths in migrated files
- All TypeScript errors resolved
- All tests passing"
```

3. **Request Verification**: Ask for human verification before proceeding to the next component

## Common Error Patterns and Solutions

### Import Path Errors

- **Problem**: `Cannot find module '@/templates/common/{component}'` or `Cannot find module '@/templates/components/{component}'`
- **Solution**: Update imports to use `@/components/{component}/template` or `@/components/{component}`

### Missing Exports

- **Problem**: `Module has no exported member`
- **Solution**: Add proper export statements to moved files, typically the main component function

### Type Import Issues

- **Problem**: Type imports failing after migration
- **Solution**: Update type imports to use `@/components/{component}/formatted-type`

### Internal Import Path Issues

- **Problem**: `Cannot find module './publishedEntity'` in formatted-type.ts
- **Solution**: Update to absolute path `@/types/formatted/publishedEntity`

- **Problem**: `Cannot find module '.'` in query.ts
- **Solution**: Update to `@/data/queries`

- **Problem**: `Cannot find module './index'` in template.test.tsx
- **Solution**: Update to `./template`

- **Problem**: `Cannot find module '../{componentName}'` in query.test.ts
- **Solution**: Update to `./query`

### Circular Dependencies

- **Problem**: Circular dependency warnings
- **Solution**: Review import chains and refactor if necessary

### Test File Issues

- **Problem**: Tests failing due to import path changes
- **Solution**: Update test imports and mock paths to match new structure

## Best Practices

1. **One Component at a Time**: Never migrate multiple components simultaneously
2. **Thorough Testing**: Always run the full test suite after migration
3. **Incremental Commits**: Commit each successful migration separately
4. **Error Documentation**: Document any unique errors encountered in this migration guide for future reference
5. **Import Verification**: Double-check all import path updates were successful

## Manual Migration Process Summary

The manual migration process involves these key actions:

1. **Directory Creation**: Creates `src/components/{componentName}/` directory
2. **Template Migration**: Moves template files from `src/templates/common/{componentName}/` or `src/templates/components/{componentName}/` and renames `index.*` to `template.*`
3. **Query Migration**: Moves `src/data/queries/{componentName}.ts` to `src/components/{componentName}/query.ts` (if exists)
4. **Test Migration**: Moves query test files and renames to `query.test.ts` (if exists)
5. **Type Migration**: Moves formatted type file and renames to `formatted-type.ts` (if exists)
6. **Mock Migration**: Moves mock files and renames to `mock.{ext}` (if exists)
7. **Import Updates**: Updates import paths throughout the codebase using search/replace operations

---

## Migration Task List

### 🔄 Pending Migration

#### Template Components (with potential queries/types/mocks)

##### From `src/templates/components/`

- [ ] **accordion** - Has query, types, likely has mocks
- [ ] **alert** - Has query, types, likely has mocks
- [ ] **alertBlock** - Has query, types, likely has mocks
- [ ] **alertNonReusable** - Has query, types, likely has mocks
- [ ] **alertSingle** - Has query, types, likely has mocks
- [ ] **audienceTopics** - Has query, types, likely has mocks
- [ ] **collapsiblePanel** - Has query, types, likely has mocks
- [ ] **contactInfo** - Has query, types, likely has mocks
- [ ] **eventTeaser** - Has query, types, likely has mocks
- [ ] **expandableOperatingStatus** - Standalone template component
- [ ] **expandableText** - Has query, types, likely has mocks
- [ ] **facilityListing** - Standalone template component
- [ ] **getUpdatesSection** - Standalone template component
- [ ] **hours** - Standalone template component (with HoursItem sub-component)
- [ ] **linkTeaser** - Has query, types, likely has mocks
- [ ] **lovellSwitcher** - Standalone template component
- [ ] **newsStoryTeaser** - Has query, types, likely has mocks
- [ ] **numberCallout** - Has query, types, likely has mocks
- [ ] **paragraph** - Standalone template component
- [ ] **prepareForVisitAccordions** - Standalone template component
- [ ] **pressReleaseTeaser** - Has query, types, likely has mocks
- [ ] **processList** - Has query, types, likely has mocks
- [ ] **qaCollapsiblePanel** - Standalone template component
- [ ] **qaParagraph** - Has query, types, likely has mocks
- [ ] **qaSection** - Has query, types, likely has mocks
- [ ] **rateYourExperience** - Standalone template component
- [ ] **reactWidget** - Has query, types, likely has mocks
- [ ] **serviceLocation** - Standalone template component (with ServiceAddress sub-component)
- [ ] **staffNewsProfile** - Standalone template component
- [ ] **staffProfileSideBarNav** - Standalone template component
- [ ] **staffProfileTeaser** - Standalone template component
- [ ] **storyListingLink** - Standalone template component
- [ ] **table** - Has query, types, likely has mocks
- [ ] **textWithImage** - Standalone template component
- [ ] **topTasks** - Standalone template component
- [ ] **vamcSystemSocialLinks** - Standalone template component
- [ ] **vetCenterAddressPhoneImage** - Standalone template component
- [ ] **vetCenterHealthServices** - Has query, types, likely has mocks
- [ ] **vetCenterHealthServicesList** - Standalone template component
- [ ] **wysiwyg** - Has query, types, likely has mocks

##### From `src/templates/common/`

- [ ] **banner** - Sub-component of banners, has query
- [ ] **maintenanceBanner** - Sub-component of banners
- [ ] **promoBanner** - Sub-component of banners
- [ ] **benefitsHubLinks** - Has query, types, likely has mocks
- [ ] **breadcrumbs** - Standalone template component
- [ ] **button** - Has query, types, likely has mocks
- [ ] **commonAndPopular** - Standalone template component
- [ ] **contentFooter** - Standalone template component
- [ ] **featuredContent** - Has query, types, likely has mocks
- [ ] **footer** - Standalone template component
- [ ] **googleMapsDirections** - Standalone template component
- [ ] **header** - Standalone template component (with TopNav sub-component)
- [ ] **heading** - Standalone template component
- [ ] **medallia** - Standalone template component
- [ ] **mediaImage** - Has query, types, likely has mocks (includes customLoader)
- [ ] **meta** - Standalone template component
- [ ] **pageLayout** - Standalone template component
- [ ] **phoneNumber** - Has query, types, likely has mocks
- [ ] **preview** - Standalone template component
- [ ] **relatedLinks** - Has query, types, likely has mocks
- [ ] **secondaryButtonGroup** - Standalone template component
- [ ] **util** (HTMLComment) - Standalone utility component

#### Standalone Queries (without current templates)

- [ ] **administration** - Query-only module
- [ ] **banners** - Has query but banner components are in common/
- [ ] **collapsiblePanelItem** - Has query, may need template creation
- [ ] **emailContact** - Has query, may need template creation
- [ ] **headerFooter** - Special query for header/footer data
- [ ] **mediaDocument** - Has query, may need template creation
- [ ] **mediaVideo** - Has query, may need template creation
- [ ] **promoBlock** - Has query, may need template creation
- [ ] **qaGroup** - Has query, may need template creation
- [ ] **staticPathResources** - Special static path generation query
- [ ] **supportServices** - Has query, may need template creation
- [ ] **vamcEhr** - Has query, may need template creation

#### Priority Order Recommendation

**Phase 1: Simple Template Components (no queries/types)**

1. **breadcrumbs** - Common reusable component
2. **heading** - Common reusable component
3. **meta** - Common utility component
4. **util** (HTMLComment) - Simple utility component
5. **paragraph** - Simple template component
6. **commonAndPopular** - Simple template component

**Phase 2: Template Components with Queries/Types**

1. **button** - Fundamental component with query/types
2. **phoneNumber** - Commonly used component with query/types
3. **mediaImage** - Critical media component with query/types
4. **accordion** - Common component with query/types
5. **alert** - Important component with query/types

**Phase 3: Complex Components**

1. **pageLayout** - Core layout component
2. **header** - Core layout component (with TopNav sub-component)
3. **footer** - Core layout component
4. **hours** - Component with sub-components (HoursItem)
5. **serviceLocation** - Component with sub-components (ServiceAddress)

**Phase 4: Specialized Components**

1. **expandableOperatingStatus** - Specialized functionality
2. **lovellSwitcher** - Specialized functionality
3. **rateYourExperience** - Specialized functionality
4. **medallia** - External integration component

### 📝 Migration Progress Tracking

**Current Component**: _No migration started yet_

**Status**: Ready to begin component migration

**Last Completed**: _None yet_

**Notes**: This component migration builds on the successful product migration. All products have been moved to `src/components/` (renamed from `src/products/`). Now we need to consolidate the remaining template components and queries into the same unified structure.

---

## Emergency Recovery

If migration causes critical issues:

1. **Revert Changes**: Use git to revert the migration commit
2. **Analyze Issues**: Review error logs and import failures
3. **Incremental Approach**: Try migrating smaller components first
4. **Seek Help**: Document the issue and request human assistance

Remember: **Each migration must be fully complete and verified before proceeding to the next component.**

## Component Categories

### Template Components

Components that have React template files, usually with tests, and may have associated queries, types, and mocks.

### Query Modules

Standalone data fetching modules that format data from Drupal. Some may not have templates yet.

### Utility Components

Simple components that provide utility functions or basic UI elements without complex data requirements.

### Layout Components

Core structural components like header, footer, pageLayout that form the foundation of pages.

This migration will result in a unified `src/components/` directory where each component is self-contained with all its related files (template, query, types, mocks, tests) co-located.
