# Content Build Dependency Tree Visualizer

A powerful tool for analyzing and visualizing the dependency relationships between Liquid templates in the `content-build` repository. This tool helps developers understand template complexity, identify circular dependencies, and optimize template architecture.

## Features

- **Dependency Analysis**: Traces all `{% include %}` statements to build a complete dependency tree
- **Complexity Metrics**: Calculates cyclomatic complexity and lines of code for each template
- **Multiple Output Formats**: Console output for quick analysis, DOT format for visual graphs
- **Missing File Detection**: Identifies broken includes and missing templates
- **Summary Statistics**: Provides totals for complexity, lines of code, and tree depth
- **Color-coded Output**: Enhanced readability with syntax highlighting

## Installation

The tool is already configured in the project. No additional installation required.

## Usage

### Basic Console Output

Analyze a single template and display its dependency tree in the console:

```sh
yarn visualize-dependency-tree ../content-build/src/site/layouts/health_care_local_facility.drupal.liquid
```

### Multiple Templates

Analyze multiple templates simultaneously:

```sh
yarn visualize-dependency-tree \
  ../content-build/src/site/layouts/health_care_local_facility.drupal.liquid \
  ../content-build/src/site/layouts/health_care_region_page.drupal.liquid
```

### Summary Mode

Get a quick overview without detailed tree structure:

```sh
yarn visualize-dependency-tree ../content-build/src/site/layouts/health_care_local_facility.drupal.liquid --summary
```

### Visual Graph Generation

Generate a DOT file for creating visual dependency graphs:

```sh
yarn visualize-dependency-tree ../content-build/src/site/layouts/health_care_local_facility.drupal.liquid --dot
```

> [!important]
> You need to have `dot` installed on your system. You can install it via `brew install graphviz`

Convert the DOT file to various formats:

```sh
# SVG (recommended for web viewing)
dot -Tsvg graph.dot -o graph.svg

# PNG (for documentation)
dot -Tpng graph.dot -o graph.png

# PDF (for printing)
dot -Tpdf graph.dot -o graph.pdf

# Interactive HTML
dot -Tsvg graph.dot -o graph.html
```

## Output Explanation

### Console Output

The console output shows:

- **File path**: Color-coded for better readability
- **Lines of Code (LoC)**: Total lines in the template
- **Cyclomatic Complexity (CC)**: Measures code complexity based on decision points
- **Include count**: Number of times each template is included
- **Missing files**: Highlighted in red with warning symbols

### Summary Statistics

At the end of analysis, you'll see:

- **Total cyclomatic complexity**: Sum of all template complexities
- **Total lines of code**: Combined lines across all templates
- **Maximum depth of tree**: Deepest dependency chain
- **Total number of files**: Unique templates analyzed

### Visual Graph Features

The generated DOT graph includes:

- **Node labels**: File paths with LoC and CC metrics
- **Color coding**: Green/orange/red based on complexity thresholds
- **Edge labels**: Include counts for multiple references
- **Missing file indicators**: Dashed red edges and nodes

## Understanding Metrics

### Cyclomatic Complexity

Measures code complexity by counting decision points:

- **1-5**: Low complexity (green)
- **6-10**: Moderate complexity (orange)
- **11+**: High complexity (red)

Decision points include:

- `{% if %}` statements
- `{% elsif %}` statements
- `{% unless %}` statements
- `{% for %}` loops
- `{% case %}` statements
- `{% when %}` clauses

### Lines of Code

- **1-50**: Small template (green)
- **51-200**: Medium template (orange)
- **201+**: Large template (red)

## Examples

### Analyzing a single template

```sh
yarn visualize-dependency-tree ../content-build/src/site/layouts/
health_care_local_facility.drupal.liquid
```

### Complex Template Analysis

```sh
yarn visualize-dependency-tree ../content-build/src/site/layouts/health_care_local_facility.drupal.liquid --dot
dot -Tsvg graph.dot -o facility-dependencies.svg
```

This creates a visual graph showing all dependencies with complexity metrics.

## Troubleshooting

### Missing Files

If you see `⚠️ Missing: filename` in the output:

1. Check if the file path is correct
2. Verify the file exists in the content-build repository
3. Ensure the include path uses the correct relative path

### Graphviz Not Found

If `dot` command is not found:

```sh
# macOS
brew install graphviz

# Ubuntu/Debian
sudo apt-get install graphviz

# Windows
# Download from https://graphviz.org/download/
```

### Large Dependency Trees

For very large dependency trees:

- Use `--summary` flag for overview statistics
- Consider analyzing specific sub-templates first
- Use the visual graph for better navigation

## Help

Get detailed help and all available options:

```sh
yarn visualize-dependency-tree --help
```
