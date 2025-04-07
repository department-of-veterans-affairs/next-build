#!/bin/bash

# === CLI ARGS ===

DRY_RUN=false
PRODUCT_NAME=""

usage() {
  echo "Usage: $0 [--dry-run] [--product=<productName>]"
  exit 1
}

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

if [ -z "$PRODUCT_NAME" ]; then
  echo "📦 Let's move your product!"
  read -rp "Enter the name of the product: " PRODUCT_NAME
  echo ""
fi

if [ -z "$PRODUCT_NAME" ]; then
  echo "❌ Product name is required."
  exit 1
fi

# === Color codes ===
RESET='\033[0m'
GRAY='\033[2m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
CYAN='\033[36m'

# === Color function ===
color() {
  local text="$1"
  local color="$2"
  case "$color" in
  gray) echo -e "${GRAY}${text}${RESET}" ;;
  red) echo -e "${RED}${text}${RESET}" ;;
  green) echo -e "${GREEN}${text}${RESET}" ;;
  yellow) echo -e "${YELLOW}${text}${RESET}" ;;
  blue) echo -e "${BLUE}${text}${RESET}" ;;
  cyan) echo -e "${CYAN}${text}${RESET}" ;;
  *) echo "$text" ;;
  esac
}

# === Paths & Helpers ===
PRODUCT_DIR="src/products/${PRODUCT_NAME}"
LAYOUT_DIR="src/templates/layouts/${PRODUCT_NAME}"
QUERY_FILE="src/data/queries/${PRODUCT_NAME}.ts"
FORMATTED_TYPE_FILE="src/types/formatted/${PRODUCT_NAME}.ts"
CODEOWNERS_FILE=".github/CODEOWNERS"

run_or_echo() {
  if $DRY_RUN; then
    echo -e "${GRAY}   [dry-run] $*${RESET}"
  else
    eval "$@"
  fi
}

log() {
  echo -e "${BLUE}🔧 $1${RESET}"
}

warn() {
  echo -e "${YELLOW}⚠️  $1${RESET}"
}

success() {
  echo -e "${GREEN}✅ $1${RESET}"
}

error() {
  echo -e "${RED}❌ $1${RESET}"
}

update_all_imports() {
  log "🔎 Scanning project for import references to '$(color "$PRODUCT_NAME" cyan)'"

  # Parallel arrays: old paths and their replacements
  searches=(
    "@/templates/layouts/${PRODUCT_NAME}"
    "@/data/queries/${PRODUCT_NAME}"
    "@/data/queries/tests/${PRODUCT_NAME}"
    "@/types/formatted/${PRODUCT_NAME}"
    "@/mocks/${PRODUCT_NAME}.mock"
  )

  replacements=(
    "@/products/${PRODUCT_NAME}"
    "@/products/${PRODUCT_NAME}/query"
    "@/products/${PRODUCT_NAME}/query.test"
    "@/products/${PRODUCT_NAME}/formatted-type"
    "@/products/${PRODUCT_NAME}/mock"
  )

  # Loop through both arrays by index
  i=0
  while [ $i -lt ${#searches[@]} ]; do
    search="${searches[$i]}"
    replace="${replacements[$i]}"
    i=$((i + 1))

    log "Replacing imports from $(color "$search" yellow) → $(color "$replace" green)"

    # Escape slashes in search and replace patterns
    search_escaped=$(printf '%s\n' "$search" | sed 's/[\/&]/\\&/g')
    replace_escaped=$(printf '%s\n' "$replace" | sed 's/[\/&]/\\&/g')

    # Find and replace with word boundaries
    grep -rl --exclude-dir=node_modules --include="*.ts*" --include="*.js*" "$search" ./src | while read -r file; do
      log "↪ Updating file: $(color "$file" cyan)"
      run_or_echo "sed -i '' -E \"s|$search_escaped|$replace_escaped|g\" \"$file\""
    done
  done
}

# === Main ===

echo "🛠  Moving product: '$(color "$PRODUCT_NAME" cyan)'"
$DRY_RUN && echo -e "${GRAY}💡 Dry-run mode enabled — no changes will be made.${RESET}"

log "Creating directory: $(color "$PRODUCT_DIR" green)"
run_or_echo "mkdir -p '${PRODUCT_DIR}'"

if [ -d "${LAYOUT_DIR}" ]; then
  for file in "${LAYOUT_DIR}"/*; do
    base=$(basename "$file")
    if [[ "$base" == index.* ]]; then
      ext="${base#*.}"
      log "Renaming $(color "$base" yellow) → $(color "template.${ext}" green)"
      run_or_echo "mv '$file' '${PRODUCT_DIR}/template.${ext}'"
    else
      log "Moving $(color "$base" yellow)"
      run_or_echo "mv '$file' '${PRODUCT_DIR}/$base'"
    fi
  done
else
  warn "Layout directory '$(color "$LAYOUT_DIR" gray)' not found."
fi

if [ -f "$QUERY_FILE" ]; then
  log "Moving $(color "query.ts" yellow)"
  run_or_echo "mv '$QUERY_FILE' '${PRODUCT_DIR}/query.ts'"
else
  warn "Query file '$(color "$QUERY_FILE" gray)' not found."
fi

found_query_test=$(find src/data/queries/tests -type f \( -name "${PRODUCT_NAME}.test.ts" -o -name "${PRODUCT_NAME}.test.tsx" \) | head -n 1)
if [ -n "$found_query_test" ]; then
  log "Moving $(color "$(basename "$found_query_test")" yellow) → $(color "query.test.ts" green)"
  run_or_echo "mv '$found_query_test' '${PRODUCT_DIR}/query.test.ts'"
else
  warn "Query test file for '$(color "$PRODUCT_NAME" cyan)' not found."
fi

if [ -f "$FORMATTED_TYPE_FILE" ]; then
  log "Moving $(color "$(basename "$FORMATTED_TYPE_FILE")" yellow) → $(color "formatted-type.ts" green)"
  run_or_echo "mv '$FORMATTED_TYPE_FILE' '${PRODUCT_DIR}/formatted-type.ts'"
else
  warn "Formatted type file '$(color "$FORMATTED_TYPE_FILE" gray)' not found."
fi

mock_file=$(find src/mocks -type f \( -name "${PRODUCT_NAME}.mock.js" -o -name "${PRODUCT_NAME}.mock.json" \) | head -n 1)
if [ -n "$mock_file" ]; then
  ext="${mock_file##*.}"
  log "Moving $(color "$(basename "$mock_file")" yellow) → $(color "mock.${ext}" green)"
  run_or_echo "mv '$mock_file' '${PRODUCT_DIR}/mock.${ext}'"
else
  warn "Mock file for '$(color "$PRODUCT_NAME" cyan)' not found."
fi

update_all_imports

log "Running $(color 'yarn run lint' blue)"
run_or_echo "yarn run lint"

if [ -f "$CODEOWNERS_FILE" ]; then
  CODEOWNERS_LINE="src/products/${PRODUCT_NAME}/ @department-of-veterans-affairs/ap-team @department-of-veterans-affairs/va-platform-cop-frontend"
  log "Adding CODEOWNERS entry: $(color "$CODEOWNERS_LINE" green)"
  run_or_echo "echo \"$CODEOWNERS_LINE\" >> '$CODEOWNERS_FILE'"
  $DRY_RUN || success "CODEOWNERS updated."
else
  warn "CODEOWNERS file not found at '$(color "$CODEOWNERS_FILE" gray)'"
fi

echo ""
success "Done moving product '$(color "$PRODUCT_NAME" cyan)$(color "'!" green)"
$DRY_RUN && echo -e "${GRAY}🔍 This was a dry-run — no files were modified.${RESET}"
