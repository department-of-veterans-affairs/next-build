## Overview

This guide provides step-by-step instructions for AI agents to migrate page templates from the `content-build` project to the `next-build` project. The migration follows an iterative approach, starting with scaffolding and then filling in individual chunks of functionality. All new templates will be placed in `src/components/<component_name>` using the co-located structure.

## Pre-Migration Setup

### 1. Analyze the Source Template

Before beginning migration:

1. **Locate the source template** in `content-build/src/site/layouts/` or `content-build/src/site/components/`
   - Ask user for the path if one can't easily be identified
2. **Identify the content type** (e.g., `node--vet_center_locations_list`)
3. **Examine the template structure** to understand:
   - Required data fields
   - Conditional logic
   - Included components/partials
   - CSS classes and styling
   - Accessibility features

Ask clarifying questions if neccessary.

### 2. Create Component Directory Structure

```bash
# Create the component directory
mkdir -p src/components/<component_name>
```

## Phase 1: Scaffolding

### Step 1: Create Basic Component Files

Create the following files in `src/components/<component_name>/`:

#### 1.1 Template Component (`template.tsx`)

```typescript
import React from 'react'
import { Formatted<ComponentName> } from './formatted-type'

interface <ComponentName>Props extends Formatted<ComponentName> {}

export const <ComponentName>: React.FC<<ComponentName>Props> = (props) => {
  return (
    <div className="<component-name>-template">
      <h1>{props.title}</h1>

      {/* TODO: Add intro text */}
      <div>TODO: Intro text section</div>

      {/* TODO: Add main content */}
      <div>TODO: Main content section</div>

      {/* TODO: Add related content */}
      <div>TODO: Related content section</div>
    </div>
  )
}

export default <ComponentName>
```

#### 1.2 Formatted Type (`formatted-type.ts`)

```typescript
import { PublishedEntity } from '@/types/formatted/publishedEntity'

export interface Formatted<ComponentName> extends PublishedEntity {
  title: string
  fieldIntroText?: string
  // TODO: Add more fields as needed
}
```

#### 1.3 Query File (`query.ts`)

```typescript
import { queries } from '@/data/queries'
import { Node<ComponentName> } from '@/types/drupal/node'
import { Formatted<ComponentName> } from './formatted-type'

export const params = {
  type: 'node--<content_type>',
  includes: [
    'field_intro_text',
    // TODO: Add more includes as needed
  ],
}

export const formatter = (data: Node<ComponentName>): Formatted<ComponentName> => {
  return {
    entityId: data.drupal_internal__nid,
    entityPath: data.path?.alias || '',
    title: data.title,
    fieldIntroText: data.field_intro_text,
    // TODO: Add more field transformations
  }
}

export const query = async (): Promise<Formatted<ComponentName>[]> => {
  const response = await queries.get<ComponentName>(params)
  return response.map(formatter)
}
```

#### 1.4 Mock Data (`mock.json`)

```json
{
  "drupal_internal__nid": 123,
  "title": "Sample <ComponentName> Title",
  "field_intro_text": "This is a sample intro text for the component.",
  "path": {
    "alias": "/sample-path"
  }
}
```

#### 1.5 Component Tests (`template.test.tsx`)

```typescript
import React from 'react'
import { render, screen } from '@testing-library/react'
import <ComponentName> from './template'
import mockData from './mock.json'

describe('<ComponentName>', () => {
  it('renders the title', () => {
    render(<<ComponentName> {...mockData} />)
    expect(screen.getByText('Sample <ComponentName> Title')).toBeInTheDocument()
  })

  it('renders intro text when provided', () => {
    render(<<ComponentName> {...mockData} />)
    expect(screen.getByText('This is a sample intro text for the component.')).toBeInTheDocument()
  })
})
```

#### 1.6 Query Tests (`query.test.ts`)

```typescript
import { formatter } from './query'
import mockData from './mock.json'

describe('<ComponentName> formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter(mockData)

    expect(result.title).toBe('Sample <ComponentName> Title')
    expect(result.fieldIntroText).toBe(
      'This is a sample intro text for the component.'
    )
    expect(result.entityId).toBe(123)
    expect(result.entityPath).toBe('/sample-path')
  })
})
```

### Step 2: Integration Setup

#### 2.1 Add Resource Type

Add to `src/lib/constants/resourceTypes.ts`:

```typescript
export const RESOURCE_TYPES = {
  // ... existing types
  <COMPONENT_NAME>: 'node--<content_type>',
} as const

export const PAGE_RESOURCE_TYPES = {
  // ... existing types
  [RESOURCE_TYPES.<COMPONENT_NAME>]: RESOURCE_TYPES.<COMPONENT_NAME>,
} as const
```

#### 2.2 Add to Queries Map

Add to `src/data/queries/index.ts`:

```typescript
import { <ComponentName> } from '@/components/<component_name>/query'

export const QUERIES_MAP = {
  // ... existing queries
  [RESOURCE_TYPES.<COMPONENT_NAME>]: <ComponentName>,
} as const
```

#### 2.3 Add to Page Router

Add to `src/pages/[[...slug]].tsx`:

```typescript
import <ComponentName> from '@/components/<component_name>/template'

// In the render logic:
{resource.type === RESOURCE_TYPES.<COMPONENT_NAME> && (
  <<ComponentName> {...(resource as Formatted<ComponentName>)} />
)}
```

### Step 3: Define Drupal Node Type

Add to `src/types/drupal/node.ts`:

```typescript
export interface Node<ComponentName> extends DrupalNode {
  field_intro_text?: string
  // TODO: Add more fields as needed
}
```

## Phase 2: Template Structure

### Step 4: Copy Original Template Structure

1. **Copy the original Drupal template** to `src/components/<component_name>/_old_template.drupal.liquid`
2. **Analyze the template** to identify:
   - HTML structure and divs
   - CSS classes
   - Conditional logic blocks
   - Include statements
   - Field references

### Step 5: Scaffold Template Structure

Update `template.tsx` with the actual HTML structure from the original template:

```typescript
export const <ComponentName>: React.FC<<ComponentName>Props> = (props) => {
  return (
    <div className="<original-css-classes>">
      {/* Header section */}
      <header className="<header-classes>">
        <h1>{props.title}</h1>
        {props.fieldIntroText && (
          <div className="intro-text">{props.fieldIntroText}</div>
        )}
      </header>

      {/* Main content area */}
      <main className="<main-classes>">
        {/* TODO: Main action buttons */}
        <div className="action-buttons">
          TODO: Implement main action buttons
        </div>

        {/* TODO: Locations section */}
        <section className="locations">
          TODO: Implement locations section
        </div>

        {/* TODO: Health services */}
        <section className="health-services">
          TODO: Implement health services section
        </div>
      </main>

      {/* TODO: Related content */}
      <aside className="related-content">
        TODO: Implement related content section
      </aside>
    </div>
  )
}
```

## Phase 3: Feature Implementation

### Step 6: Implement Individual Features

For each TODO section, follow this process:

#### 6.1 Create Feature Component

Create a new component file for the feature:

```typescript
// src/components/<component_name>/<feature-name>.tsx
import React from 'react'

interface <FeatureName>Props {
  // Define props based on what the feature needs
}

export const <FeatureName>: React.FC<<FeatureName>Props> = (props) => {
  return (
    <div className="<feature-classes>">
      {/* Implement feature logic */}
    </div>
  )
}
```

#### 6.2 Add Feature Tests

```typescript
// src/components/<component_name>/<feature-name>.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { <FeatureName> } from './<feature-name>'

describe('<FeatureName>', () => {
  it('renders correctly', () => {
    // Add test implementation
  })
})
```

#### 6.3 Update Main Template

Import and use the feature component in the main template:

```typescript
import { <FeatureName> } from './<feature-name>'

// Replace TODO with actual component:
<<FeatureName> {...featureProps} />
```

#### 6.4 Update Types and Queries

If the feature requires additional data:

1. **Add fields to `Node<ComponentName>`** in `src/types/drupal/node.ts`
2. **Add fields to `Formatted<ComponentName>`** in `formatted-type.ts`
3. **Update includes** in `query.ts` params
4. **Update formatter** to transform new fields
5. **Update mock data** to include new fields

### Step 7: Entity Relationships

For features that require related entities:

#### 7.1 Define Related Entity Types

```typescript
// In src/types/drupal/node.ts
export interface Node<RelatedEntity> extends DrupalNode {
  // Define related entity fields
}

// In formatted-type.ts
export interface Formatted<RelatedEntity> extends PublishedEntity {
  // Define formatted related entity fields
}
```

#### 7.2 Update Query Includes

```typescript
export const params = {
  type: 'node--<content_type>',
  includes: [
    'field_intro_text',
    'field_related_entity',
    'field_related_entity.field_title',
    // Add more includes as needed
  ],
}
```

#### 7.3 Update Formatter

```typescript
export const formatter = (
  data: Node<ComponentName>
): Formatted<ComponentName> => {
  return {
    // ... existing fields
    relatedEntity: data.field_related_entity
      ? {
          entityId: data.field_related_entity.drupal_internal__nid,
          title: data.field_related_entity.title,
          // Transform other fields
        }
      : null,
  }
}
```

## Phase 4: Testing and Validation

### Step 8: Run Tests

```bash
# Run component tests
npm test -- src/components/<component_name>/

# Run TypeScript check
npx tsc --noEmit
```

### Step 9: Manual Testing

1. **Start development server**: `yarn dev`
2. **Navigate to the page** in the browser
3. **Verify functionality** matches the original template
4. **Check responsive design** on different screen sizes
5. **Validate accessibility** using browser dev tools

## Phase 5: Final Integration

### Step 10: Update Feature Toggle

Add to `envs/.env.tugboat`:

```bash
# Enable new template on Tugboat
NEXT_PUBLIC_FEATURE_TOGGLE_<COMPONENT_NAME>=true
```

### Step 11: Update Documentation

1. **Update component README** if it exists
2. **Add component to storybook** if applicable
3. **Update any relevant migration guides**

## Common Patterns and Best Practices

### Component Structure

- **Keep components focused**: Each component should have a single responsibility
- **Use proper TypeScript**: Define interfaces for all props and data structures
- **Follow naming conventions**: Use consistent naming for files and components
- **Maintain accessibility**: Preserve ARIA attributes and semantic HTML from original template

### Data Handling

- **Start minimal**: Only include fields you actually need
- **Handle nullability**: Use optional properties for fields that might not exist
- **Transform data**: Convert Drupal field names to camelCase in formatted types
- **Reuse existing types**: Leverage existing type definitions when possible

### Testing Strategy

- **Test data transformation**: Ensure formatter functions work correctly
- **Test component rendering**: Verify components render with expected props
- **Test edge cases**: Handle null/undefined values gracefully
- **Use snapshots**: Capture component output for regression testing

### Error Handling

- **Graceful degradation**: Handle missing data without breaking the page
- **Type safety**: Use TypeScript to catch errors at compile time
- **Fallback values**: Provide sensible defaults for missing content

## Troubleshooting

### Common Issues

1. **Type errors**: Ensure all required fields are defined in both Drupal and formatted types
2. **Import errors**: Check that all import paths are correct after file moves
3. **Data missing**: Verify that required includes are added to the query params
4. **Styling issues**: Preserve original CSS classes to maintain visual consistency

### Debugging Steps

1. **Check browser console** for JavaScript errors
2. **Verify API responses** in Network tab
3. **Inspect component props** using React DevTools
4. **Check TypeScript output** for compilation errors

## Completion Checklist

- [ ] Component directory created with all necessary files
- [ ] Basic template structure implemented
- [ ] Resource type added to constants
- [ ] Query integration completed
- [ ] Page router updated
- [ ] Drupal node type defined
- [ ] All TODO sections implemented
- [ ] Tests written and passing
- [ ] TypeScript compilation successful
- [ ] Manual testing completed
- [ ] Feature toggle enabled
- [ ] Documentation updated

## Next Steps

After completing the migration:

1. **Create a PR** with the migrated template
2. **Request code review** from team members
3. **Deploy to staging** for QA testing
4. **Monitor for issues** in production
5. **Plan next template migration** following the same process

Remember: **Each migration should be completed and tested before moving to the next template.**
