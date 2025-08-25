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

3. **Update Migration Guide**: **IMMEDIATELY** after successful commit, update this guide:

   - Mark component as [x] completed in the task list
   - Update "Migration Progress Tracking" section with new count and commit hash
   - Update "Current Component" to next component

4. **Request Verification**: Ask for human verification before proceeding to the next component

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
6. **Update Migration Guide**: **CRITICAL** - After each successful migration, update this guide to:
   - Mark the component as completed with [x] in the task list
   - Update the "Migration Progress Tracking" section with new status and commit hash
   - Update the "Current Component" to indicate the next component to migrate

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

### Phase 1: Common Template Components (from `src/templates/common/`)

- [x] **breadcrumbs** - Common reusable component
- [x] **heading** - Common reusable component
- [x] **meta** - Common utility component
- [x] **util** (HTMLComment) - Simple utility component
- [x] **banner** - Sub-component of banners, has query
- [x] **maintenanceBanner** - Sub-component of banners
- [ ] **promoBanner** - Sub-component of banners
- [ ] **benefitsHubLinks** - Has query, types, likely has mocks
- [ ] **commonAndPopular** - Standalone template component
- [ ] **contentFooter** - Standalone template component
- [x] **footer** - Standalone template component
- [ ] **googleMapsDirections** - Standalone template component
- [x] **header** - Standalone template component (with TopNav sub-component)
- [ ] **medallia** - Standalone template component
- [ ] **mediaImage** - Has query, types, likely has mocks (includes customLoader)
- [ ] **pageLayout** - Standalone template component
- [ ] **preview** - Standalone template component
- [ ] **relatedLinks** - Has query, types, likely has mocks
- [ ] **secondaryButtonGroup** - Standalone template component

_Note: `button`, `featuredContent`, and `phoneNumber` have been moved to Phase 2 as they are part of the paragraph system._

## Phase 2: Paragraph System Components

This phase handles the complex Drupal paragraph system which includes many subtypes, queries, formatters, and templates. The paragraph system is foundational to how content is structured in Drupal. These components all extend `DrupalParagraph` or `PublishedParagraph` and work together through the central `Paragraph` component.

_Note: This phase will require careful coordination as paragraphs have complex interdependencies and formatting logic._

### Core Paragraph Infrastructure

- [ ] **paragraph** - Central paragraph component router/dispatcher (in `src/templates/components/paragraph/`)
  - _Critical component that routes all paragraph types to their specific implementations_
  - _Has complex imports from both common and component templates_
  - _Must be migrated after all individual paragraph components_

### Paragraph Components from Templates (`src/templates/components/`)

#### Alert System Components

- [ ] **alert** - Has query, types, mocks, template
  - _Base alert paragraph with reusable alert blocks and embedded paragraphs_
  - _Complex: Contains nested paragraphs (ExpandableText, Wysiwyg)_
- [ ] **alertSingle** - Has query, types, mocks, template
  - _Single alert instance with non-reusable alert reference_
- [ ] **alertNonReusable** - Has query, types, mocks, template
  - _Non-reusable alert paragraphs with embedded content_
- [ ] **alertBlock** - Has query, types, mocks, template
  - _Block-level alert components_

#### Interactive Content Components

- [ ] **accordion** - Has query, types, mocks, template
  - _Collapsible accordion items with header and rich content_
- [ ] **collapsiblePanel** - Has query, types, mocks, template
  - _Complex: Contains nested CollapsiblePanelItem paragraphs_
  - _Has bordered, expandable, and multi-panel configurations_
- [ ] **expandableText** - Has query, types, mocks, template
  - _Text content with expand/collapse functionality_

#### Content Display Components

- [ ] **wysiwyg** - Has query, types, mocks, template
  - _Rich text content with WYSIWYG formatting_
  - _Handles both standard and character-limited (1000) variants_
- [ ] **table** - Has query, types, mocks, template
  - _Structured table data display_
- [ ] **numberCallout** - Has query, types, mocks, template
  - _Highlighted numeric content with descriptive text_
- [ ] **linkTeaser** - Has query, types, mocks, template
  - _Link preview with summary content_
- [ ] **processList** - Has query, types, mocks, template
  - _Step-by-step process instructions_

#### Interactive Elements

- [ ] **reactWidget** - Has query, types, mocks, template
  - _Dynamic React widgets with CTA, error handling, and loading states_
  - _Configurable timeout and widget type selection_

#### Q&A System Components

- [ ] **qaSection** - Has query, types, mocks, template
  - _Section-based Q&A with accordion display options_
  - _Complex: Contains nested FormattedParagraph arrays for questions_
- [ ] **qaParagraph** - Has query, types, mocks, template
  - _Individual Q&A pairs with formatted answers_
  - _Complex: Contains nested FormattedParagraph arrays for answers_

#### Audience & Topic Components

- [ ] **audienceTopics** - Has query, types, mocks, template
  - _Audience targeting with beneficiaries and topic selection_
  - _Supports both beneficiaries and non-beneficiaries taxonomy terms_

#### Contact & Communication

- [ ] **contactInfo** - Has query, types, mocks, template
  - _Contact information with multiple contact types_
  - _Complex: Supports phone, email, benefit hub, and support service contacts_

### Paragraph Components from Common Templates (`src/templates/common/`)

- [ ] **button** - Has query, types, mocks, template (from common)
  - _Standard button components with label and link configuration_
  - _Note: This overlaps with Phase 1 but is part of paragraph system_
- [ ] **featuredContent** - Has query, types, mocks, template (from common)
  - _Featured content sections with optional CTA buttons_
  - _Note: This overlaps with Phase 1 but is part of paragraph system_
- [ ] **phoneNumber** - Has query, types, mocks, template (from common)
  - _Phone number display with extension, label, and type (SMS, TTY, FAX)_
  - _Note: This overlaps with Phase 1 but is part of paragraph system_

### Query-Only Paragraph Components

- [ ] **collapsiblePanelItem** - Has query, types, mocks (no template - used within collapsiblePanel)
  - _Individual items within collapsible panels_
  - _Contains title, wysiwyg content, and nested table paragraphs_
- [ ] **emailContact** - Has query, types, mocks (no standalone template - used within contactInfo)
  - _Email contact information with address and label_
- [ ] **qaGroup** - Has query, types, mocks (rendered through qaSection template)
  - _Grouped Q&A sections with accordion display settings_

### Special Paragraph Types (Referenced but need investigation)

- [ ] **serviceLocation** - Template exists but needs paragraph integration check
  - _Service location information with addresses, hours, phone numbers_
  - _Complex: Contains nested ServiceLocationAddress paragraphs_
- [ ] **staffProfile** - Investigate if this needs paragraph system integration
- [ ] **step** & **stepByStep** - Investigate if these have corresponding queries/templates
  - _Step-by-step instructions with media and alert integration_

### Notes on Paragraph System Migration:

1. **High Interdependency**: Many paragraph components reference each other (alerts contain wysiwyg/expandableText, collapsiblePanel contains collapsiblePanelItem, etc.)

2. **Central Paragraph Component**: The `paragraph` component in `src/templates/components/paragraph/` serves as the central dispatcher and must be migrated last after all individual components.

3. **Formatter Integration**: All paragraph components use `FormattedParagraph` types and are integrated into the central formatting system.

4. **Overlap with Other Phases**: Some components (`button`, `featuredContent`, `phoneNumber`) appear in Phase 1 but are also part of the paragraph system - they should be migrated in Phase 2 to maintain paragraph system integrity.

5. **Template vs Query-Only**: Some paragraph types only have queries/formatters but use existing templates (like `qaGroup` using `qaSection` template).

---

## Phase 3: Non-Paragraph Template Components (from `src/templates/components/`)

_Note: Paragraph-related components have been moved to Phase 2. This phase contains standalone template components that are not part of the paragraph system._

### Event & News Components

- [ ] **eventTeaser** - Has query, types, likely has mocks
  - _Event preview components for listings and cards_
- [ ] **newsStoryTeaser** - Has query, types, likely has mocks
  - _News story preview components_
- [ ] **pressReleaseTeaser** - Has query, types, likely has mocks
  - _Press release preview components_
- [ ] **staffNewsProfile** - Standalone template component
  - _Staff profile for news stories_

### Facility & Location Components

- [ ] **expandableOperatingStatus** - Standalone template component
  - _Collapsible facility operating status display_
- [ ] **facilityListing** - Standalone template component
  - _Facility listing and directory components_
- [ ] **hours** - Standalone template component (with HoursItem sub-component)
  - _Business hours display with individual hour items_
- [ ] **serviceLocation** - Standalone template component (with ServiceAddress sub-component)
  - _Service location information display_
  - _Note: While this has paragraph types, the template is standalone_

### Navigation & UI Components

- [ ] **lovellSwitcher** - Standalone template component
  - _Lovell Federal facility switching interface_
- [ ] **prepareForVisitAccordions** - Standalone template component
  - _Visit preparation accordion interfaces_
- [ ] **qaCollapsiblePanel** - Standalone template component
  - _Q&A collapsible panel (different from paragraph qaSection)_
- [ ] **staffProfileSideBarNav** - Standalone template component
  - _Staff profile sidebar navigation_
- [ ] **topTasks** - Standalone template component
  - _Top tasks quick access interface_

### Content Display Components

- [ ] **getUpdatesSection** - Standalone template component
  - _Update subscription sections_
- [ ] **rateYourExperience** - Standalone template component
  - _User experience rating interface_
- [ ] **storyListingLink** - Standalone template component
  - _Story listing navigation links_
- [ ] **textWithImage** - Standalone template component
  - _Text content with accompanying images_
- [ ] **staffProfileTeaser** - Standalone template component
  - _Staff profile preview components_

### VA-Specific Components

- [ ] **vamcSystemSocialLinks** - Standalone template component
  - _VAMC system social media links_
- [ ] **vetCenterAddressPhoneImage** - Standalone template component
  - _Vet center contact information display_
- [ ] **vetCenterHealthServices** - Has query, types, likely has mocks
  - _Vet center health services listings_
- [ ] **vetCenterHealthServicesList** - Standalone template component
  - _Vet center health services list display_

## Phase 4: Standalone Queries (Non-Paragraph)

_Note: Paragraph-related queries have been moved to Phase 2. This phase contains standalone query modules that are not part of the paragraph system._

### Infrastructure Queries

- [ ] **administration** - Query-only module
  - _Administrative data and configuration queries_
- [ ] **staticPathResources** - Special static path generation query
  - _Static site generation path resolution_

### Banner System Queries

- [ ] **banners** - Has query but banner components are in common/
  - _Banner content queries (components in Phase 1 common templates)_

### Media Queries

- [ ] **mediaDocument** - Has query, may need template creation
  - _Document media handling and formatting_
- [ ] **mediaVideo** - Has query, may need template creation
  - _Video media handling and formatting_

### Content Block Queries

- [ ] **promoBlock** - Has query, may need template creation
  - _Promotional content block formatting_
- [ ] **supportServices** - Has query, may need template creation
  - _Support services data formatting_

### Healthcare System Queries

- [ ] **vamcEhr** - Has query, may need template creation
  - _VAMC Electronic Health Record integration queries_

### Notes on Standalone Queries:

1. **Template Creation**: Some queries may need corresponding template components created during migration.

2. **Integration Points**: These queries may be used by components in other phases and should be migrated after the dependent components.

3. **Infrastructure Dependencies**: Some queries (like `headerFooter`, `staticPathResources`) are foundational and used across the application.

### 📝 Migration Progress Tracking

**Current Component**: Ready for next migration (promoBanner component)

**Status**: 6 components successfully migrated

**Last Completed**: meta, util (HTMLComment), banner, maintenanceBanner (commits: 9d84ab8c, dbd6bafe, 421d67fe, 6c978688)

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
