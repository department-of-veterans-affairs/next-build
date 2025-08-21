# Template Migration: Post-Launch

## What is the Post-Launch phase?

The Post-Launch phase is the final phase of the template migration process. At this point, the template is used in production. These are the last few steps before the Product-owning Team takes over ownership of the template.

## What do we do here?

After the next-build template has been running in Production without issue, the post-launch ticket can be completed. This ticket contains the following tasks that need to be done:

- Determine code ownership
  - If the product should be transferred to another team, update the [CODEOWNERS file](https://github.com/department-of-veterans-affairs/next-build/blob/main/.github/CODEOWNERS)
- Within GraphQL, stop content-build from building the pages for this template by removing the necessary queries from the:
  - `get individual` and `get all pages` queries
  - `count` query
- Create API Tests for the content type
- Add a comment at the top of the content-build layout to indicate that the layout has been migrated to next-build:

```
{% comment %}
This template is no longer used to build production content.
Please make any changes you need in Next Build.
{% endcomment %}
```

## RACI

- **Responsible:** The CMS team
- **Accountable:** Chris Valarida & Laura Flannery (CMS Team)
- **Consulted:** Product-owning Team
- **Informed:** Product-owning Team

## Maintenance and Enhancements

_Congratulations! You've made it!_

The template is now in production and the Product-owning Team is responsible for maintaining and enhancing the template.
