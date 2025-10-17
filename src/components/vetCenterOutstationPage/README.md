# Vet Center Outstation Pages

This component provides full-page layouts for Vet Center Outstations, designed to mirror the Main Vet Center page structure while being tailored specifically for outstation locations.

## Current Status: Mock Data Phase

**⚠️ This feature is currently in development and uses mock data only.**

The component is fully functional but operates with static mock data instead of real CMS content. This allows for development, testing, and design review before the CMS integration is complete.

## How to Enable Locally

1. **Set the feature flag** in your environment file (`.env.local`, `.env.dev`, etc.):

   ```bash
   FEATURE_NEXT_BUILD_CONTENT_VET_CENTER_OUTSTATION_PAGE=true
   ```

2. **Start the development server**:

   ```bash
   yarn dev
   ```

3. **Visit the test URL** (using mock data):
   ```
   http://localhost:3999/dev-vet-center-outstation/sepulveda-outstation
   ```

## Architecture

### Component Structure

```
src/components/vetCenterOutstationPage/
├── README.md                    # This file
├── formatted-type.ts            # TypeScript interface for page data
├── template.tsx                 # React component for rendering pages
├── query.ts                     # Data loader and formatter (currently uses mocks)
└── __mocks__/
    └── sepulveda-outstation.json # Mock data for testing
```

### Key Features

- **Mirrors Main Vet Center Layout**: Uses the same components and structure as main Vet Centers
- **Side Navigation**: Shows only "Locations" link, pointing back to parent VC locations page
- **Breadcrumbs**: Follows the pattern: Home > [Main Vet Center] > Locations > [Outstation name]
- **Health Services**: Displays counseling, referral, and other services in separate grouped sections
- **Feature Flag Gated**: Only builds when `FEATURE_NEXT_BUILD_CONTENT_VET_CENTER_OUTSTATION_PAGE=true`

## Adding New Mock Outstations

To add additional mock outstation data for testing:

1. **Create a new mock file** in `__mocks__/`:

   ```bash
   src/components/vetCenterOutstationPage/__mocks__/new-outstation-name.json
   ```

2. **Update the query registry** in `query.ts`:

   ```typescript
   const MOCK_OUTSTATIONS = {
     'sepulveda-outstation': () => /* existing */,
     'new-outstation-name': () =>
       JSON.parse(
         fs.readFileSync(
           path.join(process.cwd(), 'src/components/vetCenterOutstationPage/__mocks__/new-outstation-name.json'),
           'utf-8'
         )
       )
   }
   ```

3. **Follow the data structure** from `sepulveda-outstation.json` as a template

## CMS Integration (Future)

When the CMS integration is ready:

1. **Replace mock data loader** in `query.ts` with real Drupal queries
2. **Update the data fetching** to use `fetchSingleEntityOrPreview` like other components
3. **Test with real CMS data** while keeping the feature flag enabled
4. **Enable in production** by setting the feature flag to `true` in production environment

## Testing

### Current Mock Testing

```bash
# Enable the feature flag
FEATURE_NEXT_BUILD_CONTENT_VET_CENTER_OUTSTATION_PAGE=true yarn dev

# Visit: http://localhost:3999/dev-vet-center-outstation/sepulveda-outstation
```

**Note:** We're using a development-only route (`/dev-vet-center-outstation/[slug]`) because the final URLs (`/chatsworth-vet-center/locations/sepulveda-outstation`) require CMS integration to work properly.

### Future CMS Testing

When CMS integration is complete, the same URLs will work with real data from the CMS.

## Design Specifications

The outstation pages follow the design specifications from:

- **Figma**: [Vet Centers Design](https://www.figma.com/design/EVd3q06ukAbVS61Q8MwRAT/Vet-Centers?node-id=1790-8784&t=hJ6vIymGbQi142Vk-0)
- **GitHub Issue**: [#20706](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/20706)

### Key Requirements Met

- ✅ Mimics Main Vet Center layout
- ✅ Standard sections always display (title, contact info, commitment, spotlight, etc.)
- ✅ Editor-entered sections display conditionally (prepare for visit, health services, etc.)
- ✅ Breadcrumb: "VA.gov home > [Main Vet Center] > Locations > [Outstation name]"
- ✅ Left nav shows "Locations" only
- ✅ Links to parent vet center locations page
- ✅ Uses existing VC components for consistency

## Troubleshooting

### Page shows 404

- Ensure `FEATURE_NEXT_BUILD_CONTENT_VET_CENTER_OUTSTATION_PAGE=true` is set
- Restart your dev server after changing environment variables
- Check that you're using the correct URL path

### Missing sections

- Review the mock data structure in `__mocks__/sepulveda-outstation.json`
- Ensure the data formatter in `query.ts` is correctly mapping the fields

### Side navigation issues

- The side nav is handled by the `SideNavLayout` component
- It should show only "Locations" that links to the parent vet center's locations page

## Related Components

- **`vetCenter`**: Main Vet Center pages (not modified)
- **`vetCenterOutstation`**: Used for embedding outstations within main VC pages (not modified)
- **`vetCenterLocationListing`**: Lists outstation locations for a main vet center
