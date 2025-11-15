COMMITS_FILE=/tmp/commits.txt
PR_LIST_FILE=/tmp/prs.txt

# Get all the commits from the merge base to the current commit
git --no-pager log $(git --no-pager merge-base main HEAD)..HEAD >"$COMMITS_FILE"

# Find the PR numbers
rg "^    .+ \(#(\d+)\)" "$COMMITS_FILE" --replace '$1' --no-line-number >"$PR_LIST_FILE"

# Fun fact: `| xargs` removes the trailing spaces...weirdly...🤷
echo "Found $(cat "$PR_LIST_FILE" | wc -l | xargs) PRs from main to HEAD"
echo ""

# Loop through each PR number and get the PR description
while read pr_number; do
  echo "- PR $pr_number"
  pr_contents=$(gh pr view "$pr_number" --json title,body)
  ticket_link=$(printf '%s' "$pr_contents" | jq -r '.body' | rg -o '(https://github.com/department-of-veterans-affairs/va.gov-cms/issues/\d+)' | head -n 1)
  pr_title=$(printf '%s' "$pr_contents" | jq -r '.title')
  echo "  - Title: $pr_title"
  echo "  - Ticket: $ticket_link"
done <"$PR_LIST_FILE"
