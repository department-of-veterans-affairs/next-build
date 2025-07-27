# Guide to leveraging AI for template migration

## Why use AI

We're using AI to accelerate the migration of legacy Liquid templates to modern, testable React components while reducing manual effort and inconsistency

## Overview

The general flow goes like this:

1. Pass in the Liquid template and ask for a React component
   1. Be sure to leave stub components for any `{% include '...' %}`s
2. Generate unit tests for the functionality
3. Repeat steps 1 - 2 for each include; replace the stub components with these fully-functional ones

## Approved LLMs

**GitHub Copilot** is provided under the VA’s GitHub organization.

To request access, fill out the onboarding form here:

1. [Copilot Onboarding Request Form](https://github.com/department-of-veterans-affairs/copilot-onboarding/issues/new?template=copilot-onboarding.yml)

2. Once approved, follow GitHub Copilot’s setup instructions for Visual Studio Code:
   [Set up GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup)

After installation, it should prompt you to sign in using your GitHub account which is linked to you VA repo. The VA hosts several copilot related training sessions and workshops in public channels so stay tuned for that.

## Tips

- You can use [aider with GitHub Copilot](https://aider.chat/docs/llms/github.html) to feed in very deliberate context
  - I usually give it all the static types in `src/types/drupal/node.ts` and any others that may be used
  - It's really useful for generating unit tests for a single component; LLMs tend to get distracted with too much context
- Manually creating the static types expected from Drupal before step 1 may be useful for the more complicated entity types
- I haven't found generating the query file to be very useful; feel free to try AI-generating it, but be sure have a solid input type and output type first, and give it an example
- You can use AI for documenting sections of your code, or even layout documentation in files if needed
- Human in the loop is needed when it comes to understanding Drupal data and their meanings
