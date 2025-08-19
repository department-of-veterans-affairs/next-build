# AI Product Migration Guide

## Overview

This guide provides instructions for AI agents to systematically migrate product code files from the legacy structure to the new consolidated product structure using the `move-product.sh` script. Each product should be migrated individually, with thorough testing and error resolution before proceeding to the next product.

## Migration Process

### 1. Pre-Migration Analysis

Before running the migration script for each product:

1. **Verify Product Structure**: Check if the product has the following files that need migration:

   - Template layout in `src/templates/layouts/{productName}/`
   - Query file at `src/data/queries/{productName}.ts`
   - Query test file in `src/data/queries/tests/{productName}.test.ts`
   - Formatted type file at `src/types/formatted/{productName}.ts`
   - Mock file in `src/mocks/{productName}.mock.{js|json}`

2. **Check Dependencies**: Search the codebase for any imports or references to the product files that will be moved.

### 2. Run Migration Script

Execute the migration script for the target product:

```bash
./scripts/move-product.sh --product={productName}
```

**Note**: Use `--dry-run` flag first to preview changes before actual execution.

### 3. Post-Migration Error Resolution

After running the migration script, you **MUST**:

1. **Run TypeScript Check**: The script runs `npx tsc --noEmit` but you should verify no new errors were introduced.

2. **Fix Import/Export Issues**: Common errors to resolve:

   - **Missing export statements**: Ensure the moved files properly export their main functions/types
   - **Import path updates**: Verify all import statements are correctly updated to new paths
   - **Circular dependencies**: Check for any new circular import issues
   - **Index file updates**: Update any index.ts files that re-export the moved modules

3. **Update Template References**: Check if any template files need updates:

   - Layout component exports in moved template files
   - Component imports in other files
   - Test file imports and references

4. **Verify Query Integration**: Ensure:

   - Query exports match expected function signatures
   - Query imports in the main queries index file are correct
   - Type exports are properly accessible

5. **Test File Validation**:
   - Run the specific tests for the migrated product
   - Fix any broken test imports or mocks
   - Update snapshot tests if paths changed

### 4. Verification Steps

Before considering the migration complete:

1. **Test Suite**: Run tests specifically related to the migrated product
2. **Import Validation**: Verify that all import updates were successful by searching for old import paths
3. **Manual Review**: Run the dev server (`yarn dev`) to ensure no compilation errors, asking the human to view a relevant page in a browser to make sure it loads

### 5. Commit Changes

Once all errors are resolved and verification is complete:

1. **Stage Changes**: Add all modified and moved files
2. **Commit**: Create a descriptive commit message: `migrate: move {productName} to products directory`
3. **Request Verification**: Ask for human verification before proceeding to the next product

## Common Error Patterns and Solutions

### Import Path Errors

- **Problem**: `Cannot find module '@/templates/layouts/{product}'`
- **Solution**: Update imports to use `@/products/{product}/template`

### Missing Exports

- **Problem**: `Module has no exported member`
- **Solution**: Add proper export statements to moved files, typically the main component function

### Type Import Issues

- **Problem**: Type imports failing after migration
- **Solution**: Update type imports to use `@/products/{product}/formatted-type`

### Circular Dependencies

- **Problem**: Circular dependency warnings
- **Solution**: Review import chains and refactor if necessary

### Test File Issues

- **Problem**: Tests failing due to import path changes
- **Solution**: Update test imports and mock paths to match new structure

## Best Practices

1. **One Product at a Time**: Never migrate multiple products simultaneously
2. **Thorough Testing**: Always run the full test suite after migration
3. **Incremental Commits**: Commit each successful migration separately
4. **Error Documentation**: Document any unique errors encountered in this migration guide for future reference
5. **Import Verification**: Double-check all import path updates were successful

## Script Behavior

The `move-product.sh` script performs these actions:

1. **Directory Creation**: Creates `src/products/{productName}/` directory
2. **Template Migration**: Moves layout files from `src/templates/layouts/{productName}/` and renames `index.*` to `template.*`
3. **Query Migration**: Moves `src/data/queries/{productName}.ts` to `src/products/{productName}/query.ts`
4. **Test Migration**: Moves query test files and renames to `query.test.ts`
5. **Type Migration**: Moves formatted type file and renames to `formatted-type.ts`
6. **Mock Migration**: Moves mock files and renames to `mock.{ext}`
7. **Import Updates**: Automatically updates import paths throughout the codebase
8. **CODEOWNERS**: Adds appropriate CODEOWNERS entry

---

## Migration Task List

### ✅ Already Migrated

- [x] event
- [x] eventListing
- [x] newsStory
- [x] storyListing
- [x] pressRelease
- [x] pressReleaseListing
- [x] staffProfile
- [x] vamcSystemVaPolice
- [x] leadershipListing
- [x] vetCenter

### 🔄 Pending Migration

#### Products with Templates & Queries

- [ ] **healthCareLocalFacility** - Has template layout and query file
- [ ] **locationsListing** - Has template layout and query file
- [ ] **questionAnswer** - Has template layout and query file
- [ ] **resourcesSupport** - Has template layout and query file
- [ ] **vamcHealthServicesListing** - Has template layout and query file
- [ ] **vamcSystem** - Has template layout and query file
- [ ] **vbaFacility** - Has template layout and query file

- [ ] **vetCenterLocationListing** - Has template layout and query file
- [ ] **vetCenterOutstation** - Has template layout and query file

#### Priority Order Recommendation

1. **vetCenterLocationListing** - Related to vetCenter
2. **vetCenterOutstation** - Related to vetCenter
3. **vamcSystem** - Core VAMC functionality
4. **healthCareLocalFacility** - Healthcare facility core
5. **vamcHealthServicesListing** - Related to VAMC
6. **locationsListing** - General locations
7. **vbaFacility** - VBA facilities
8. **resourcesSupport** - Support resources
9. **questionAnswer** - Q&A functionality

### 📝 Migration Progress Tracking

**Current Product**: vetCenterLocationListing _(next up)_

**Status**: Ready for next migration

**Last Completed**: vetCenter - Successfully migrated with all tests passing

**Notes**: vetCenter migration completed successfully. Fixed import paths in formatted-type.ts, query.ts, and template.test.tsx. All TypeScript errors resolved and all tests passing.

---

## Emergency Recovery

If migration causes critical issues:

1. **Revert Changes**: Use git to revert the migration commit
2. **Analyze Issues**: Review error logs and import failures
3. **Incremental Approach**: Try migrating smaller components first
4. **Seek Help**: Document the issue and request human assistance

Remember: **Each migration must be fully complete and verified before proceeding to the next product.**
