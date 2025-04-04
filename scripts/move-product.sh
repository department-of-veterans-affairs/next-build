#!/bin/bash

# =============================
# CLI Args
# =============================

DRY_RUN=false
PRODUCT_NAME=""

# Helper: print usage
usage() {
  echo "Usage: $0 [--dry-run] [--product=<productName>]"
  exit 1
}

# Parse CLI args
for arg in "$@"; do
  case $arg in
  --dry-run)
    DRY_RUN=true
    ;;
  --product=*)
    PRODUCT_NAME="${arg#*=}"
    ;;
  --product)
    shift
    PRODUCT_NAME="$1"
    ;;
  *)
    usage
    ;;
  esac
done

# If no product passed, prompt for it
if [ -z "$PRODUCT_NAME" ]; then
  echo "📦 Let's move your product!"
  read -rp "Enter the name of the product: " PRODUCT_NAME
  echo ""
fi

# Validate
if [ -z "$PRODUCT_NAME" ]; then
  echo "❌ Product name is required."
  exit 1
fi

# =============================
# Paths and Helpers
# =============================

PRODUCT_DIR="src/products/${PRODUCT_NAME}"
LAYOUT_DIR="src/templates/layouts/${PRODUCT_NAME}"
QUERY_FILE="src/data/queries/${PRODUCT_NAME}.ts"
FORMATTED_TYPE_FILE="src/types/formatted/${PRODUCT_NAME}.ts"
CODEOWNERS_FILE=".github/CODEOWNERS"

run_or_echo() {
  if $DRY_RUN; then
    echo "🟡 [dry-run] $*"
  else
    eval "$@"
  fi
}

log() {
  echo -e "\n🔧 $1"
}

# =============================
# Main Script
# =============================

echo "🛠  Starting product move for: '${PRODUCT_NAME}'"
$DRY_RUN && echo "💡 Running in DRY-RUN mode — no files will be changed."

# Create target directory
log "Creating directory: ${PRODUCT_DIR}"
run_or_echo "mkdir -p '${PRODUCT_DIR}'"

# Move and rename layout files
if [ -d "${LAYOUT_DIR}" ]; then
  for file in "${LAYOUT_DIR}"/*; do
    base=$(basename "$file")
    if [[ "$base" == index.* ]]; then
      ext="${base#*.}"
      log "Renaming ${base} -> template.${ext}"
      run_or_echo "mv '$file' '${PRODUCT_DIR}/template.${ext}'"
    else
      log "Moving ${base}"
      run_or_echo "mv '$file' '${PRODUCT_DIR}/$base'"
    fi
  done
else
  echo "⚠️ Layout directory '${LAYOUT_DIR}' not found."
fi

# Move query file
if [ -f "$QUERY_FILE" ]; then
  log "Moving query.ts"
  run_or_echo "mv '$QUERY_FILE' '${PRODUCT_DIR}/query.ts'"
else
  echo "⚠️ Query file '${QUERY_FILE}' not found."
fi

# Move query test file (.test.ts or .test.tsx), save as .ts
found_query_test=$(find src/data/queries/tests -type f \( -name "${PRODUCT_NAME}.test.ts" -o -name "${PRODUCT_NAME}.test.tsx" \) | head -n 1)
if [ -n "$found_query_test" ]; then
  log "Moving query test -> query.test.ts"
  run_or_echo "mv '$found_query_test' '${PRODUCT_DIR}/query.test.ts'"
else
  echo "⚠️ Query test file for '${PRODUCT_NAME}' not found."
fi

# Move formatted type
if [ -f "$FORMATTED_TYPE_FILE" ]; then
  log "Moving formatted type -> formatted-type.ts"
  run_or_echo "mv '$FORMATTED_TYPE_FILE' '${PRODUCT_DIR}/formatted-type.ts'"
else
  echo "⚠️ Formatted type file '${FORMATTED_TYPE_FILE}' not found."
fi

# Move mock file (.mock.js or .mock.json), preserve extension
mock_file=$(find src/mocks -type f \( -name "${PRODUCT_NAME}.mock.js" -o -name "${PRODUCT_NAME}.mock.json" \) | head -n 1)
if [ -n "$mock_file" ]; then
  ext="${mock_file##*.}"
  log "Moving mock file -> mock.${ext}"
  run_or_echo "mv '$mock_file' '${PRODUCT_DIR}/mock.${ext}'"
else
  echo "⚠️ Mock file for '${PRODUCT_NAME}' not found."
fi

# Run the linter
run_or_echo "yarn run lint"

# Add to CODEOWNERS
if [ -f "$CODEOWNERS_FILE" ]; then
  CODEOWNERS_LINE="src/products/${PRODUCT_NAME}/ @department-of-veterans-affairs/ap-team @department-of-veterans-affairs/va-platform-cop-frontend"
  log "Adding CODEOWNERS entry"
  run_or_echo "echo \"$CODEOWNERS_LINE\" >> '$CODEOWNERS_FILE'"
  $DRY_RUN || echo "✅ CODEOWNERS updated."
else
  echo "⚠️ CODEOWNERS file not found at '${CODEOWNERS_FILE}'"
fi

echo -e "\n🎉 All done for product '${PRODUCT_NAME}'!"
$DRY_RUN && echo "🔍 No files were modified (dry-run mode)."
