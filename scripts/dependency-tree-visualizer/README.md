# Content Build Dependency Tree Visualizer

This tool helps visualize the dependency tree of any given template (or
templates) in the `content-build` repo.

> [!important]
> This is written in TypeScript, so you'll need to run it using `ts-node`,
> `bun`, `deno`, or a version of Node that can strip the types.

**Basic usage:**

```sh
bun scripts/dependency-tree-visualizer/index.ts ../content-build/src/site/layouts/health_care_local_facility.drupal.liquid
```

**Help:**

```sh
bun scripts/dependency-tree-visualizer/index.ts --help
```

**Creating a visual graph:**

> [!important]
> You need to have `dot` installed on your system. You can install it via `brew
install graphviz`

```sh
bun scripts/dependency-tree-visualizer/index.ts ../content-build/src/site/layouts/health_care_local_facility.drupal.liquid --dot && dot -Tsvg graph.dot -o graph.svg
```
