# Guide to leveraging AI for template migration

## Overview

The general flow goes like this:

1. Pass in the Liquid template and ask for a React component
   1. Be sure to leave stub components for any `{% include '...' %}`s
2. Generate unit tests for the functionality
3. Repeat steps 1 - 2 for each include; replace the stub components with these fully-functional ones

## Approved LLMs

I think just GitHub Copilot provided under VA's GitHub organization.

## Tips

- You can use [aider with GitHub Copilot](https://aider.chat/docs/llms/github.html) to feed in very deliberate context
  - I usually give it all the static types in `src/types/drupal/node.ts` and any others that may be used
  - It's really useful for generating unit tests for a single component; LLMs tend to get distracted with too much context
- Manually creating the static types expected from Drupal before step 1 may be useful for the more complicated entity types
- I haven't found generating the query file to be very useful; feel free to try AI-generating it, but be sure have a solid input type and output type first, and give it an example
