# Fetch Entity Script

A command-line tool for fetching resources from the Drupal JSON:API. This script is useful for grabbing mock data, debugging API responses, and exploring the Drupal content structure.

## Usage

```bash
yarn fetch-entity <resource-type> [uuid] [options]
```

To read about all options and parameters, run

```bash
yarn fetch-entity --help
```

## Examples

### Fetch a single resource by UUID

```bash
yarn fetch-entity node--health_care_local_facility 12345678-1234-1234-1234-123456789012
```

### Fetch a collection of resources

```bash
yarn fetch-entity node--health_care_local_facility --collection --limit 5
```

### Fetch with related fields included

```bash
yarn fetch-entity node--health_care_local_facility 12345678-1234-1234-1234-123456789012 --include field_telephone field_region_page.field_related_links
```

### Output as JSON

```bash
yarn fetch-entity node--health_care_local_facility 12345678-1234-1234-1234-123456789012 --json
```

### Deflate output to avoid circular references

```bash
yarn fetch-entity node--health_care_local_facility 12345678-1234-1234-1234-123456789012 --deflate
```

## Environment Variables

The script requires authentication credentials to access the Drupal API. It will look for these environment variables in `envs/.env.local`.

## Notes

- The script uses a proxy connection for external requests and direct connection for local Drupal instances
- Certificate files are automatically loaded for secure connections
- When using `--collection` with `--limit 1`, the script returns the first item directly instead of an array
- The script automatically handles authentication based on available environment variables
- Circular references in the output can cause issues with JSON serialization; use `--deflate` to avoid this

## Troubleshooting

1. **Authentication errors**: Ensure your environment variables are correctly set in `envs/.env.local`
2. **Connection issues**: Check that the Drupal instance is accessible and certificates are properly configured
3. **Circular reference errors**: Use the `--deflate` flag to remove circular references from the output
4. **Resource not found**: Verify the resource type and UUID are correct
