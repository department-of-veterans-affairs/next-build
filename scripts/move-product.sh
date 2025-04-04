#!/bin/bash

# Usage info
usage() {
  echo "Usage: $0 [--dry-run]"
  exit 1
}

# Parse arguments
DRY_RUN=false
if [ "$1" == "--dry-run" ]; then
  DRY_RUN=true
elif [ -n "$1" ]; then
  usage
fi

# Prompt for product name
read -rp "Enter the name of the product: " name

# Define paths
PRODUCT_DIR="src/products/${name}"
LAYOUT_DIR="src/templates/layouts/${name}"
QUERY_FILE="src/data/queries/${name}.ts"
FORMATTED_TYPE_FILE="src/types/formatted/${name}.ts"
CODEOWNERS_FILE=".github/CODEOWNERS"

# Helper function for dry-run-aware commands
run_or_echo() {
  if $DRY_RUN; then
    echo "🟡 [dry-run] $*"
  else
    eval "$@"
  fi
}

# Create target directory
run_or_echo "mkdir -p '${PRODUCT_DIR}'"

# Move and rename layout files
if [ -d "${LAYOUT_DIR}" ]; then
  for file in "${LAYOUT_DIR}"/*; do
    base=$(basename "$file")
    if [[ "$base" == index.* ]]; then
      ext="${base#*.}"
      run_or_echo "mv '$file' '${PRODUCT_DIR}/template.${ext}'"
    else
      run_or_echo "mv '$file' '${PRODUCT_DIR}/$base'"
    fi
  done
else
  echo "⚠️ Layout directory '${LAYOUT_DIR}' not found."
fi

# Move query file
if [ -f "$QUERY_FILE" ]; then
  run_or_echo "mv '$QUERY_FILE' '${PRODUCT_DIR}/query.ts'"
else
  echo "⚠️ Query file '${QUERY_FILE}' not found."
fi

# Move query test file (.test.ts or .test.tsx), save as .ts
found_query_test=$(find src/data/queries/tests -type f \( -name "${name}.test.ts" -o -name "${name}.test.tsx" \) | head -n 1)
if [ -n "$found_query_test" ]; then
  run_or_echo "mv '$found_query_test' '${PRODUCT_DIR}/query.test.ts'"
else
  echo "⚠️ Query test file for '${name}' not found."
fi

# Move formatted type
if [ -f "$FORMATTED_TYPE_FILE" ]; then
  run_or_echo "mv '$FORMATTED_TYPE_FILE' '${PRODUCT_DIR}/formatted-type.ts'"
else
  echo "⚠️ Formatted type file '${FORMATTED_TYPE_FILE}' not found."
fi

# Move mock file (.mock.js or .mock.json), preserve extension
mock_file=$(find src/mocks -type f \( -name "${name}.mock.js" -o -name "${name}.mock.json" \) | head -n 1)
if [ -n "$mock_file" ]; then
  ext="${mock_file##*.}"
  run_or_echo "mv '$mock_file' '${PRODUCT_DIR}/mock.${ext}'"
else
  echo "⚠️ Mock file for '${name}' not found."
fi

# Run the linter
run_or_echo "yarn run lint"

# Add to CODEOWNERS
if [ -f "$CODEOWNERS_FILE" ]; then
  CODEOWNERS_LINE="src/products/${name}/ @department-of-veterans-affairs/ap-team @department-of-veterans-affairs/va-platform-cop-frontend"
  run_or_echo "echo \"$CODEOWNERS_LINE\" >> '$CODEOWNERS_FILE'"
  $DRY_RUN || echo "✅ CODEOWNERS updated."
else
  echo "⚠️ CODEOWNERS file not found at '${CODEOWNERS_FILE}'"
fi

echo "🎉 All done for product '${name}'!"
