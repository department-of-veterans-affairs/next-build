# Template Migration

So you wanna migrate a template, do ya? Well, I've got good news! You've come to the right place.

This document outlines the process for migrating templates from the old `content-build` to `next-build`, complete with phase definitions, RACI matrices, and transition criteria.

> [!NOTE]
> 🏗️ This document is still a work in progress. As you work through the phases, if you see something that could be improved, please create a PR to update our docs!

## Prerequisites

- A successful build in `content-build`
- A successful build in `next-build`

## Phases

The migration of templates consists of four distinct phases. Follow the links below to learn more about each phase:

1. [Pre-Migration](./pre-migration.md)
   - **Definition**: The template for a given content type either doesn’t exist in next-build or is stale.
2. [Active Migration](./active-migration.md)
   - **Definition**: The template is under active development & testing but has not yet been deployed to production.
   - ⭐ This is where the bulk of the work happens.
3. [Rollout](./rollout.md)
   - **Definition**: The template is now utilized to generate content in production.
4. [Post-Launch](./post-launch.md)
   - **Definition**: The template is now in production awaiting handoff to the Product-owning Team.

After the Post-Launch phase, the Product-owning Team has ownership of the template and is responsible for maintaining and enhancing the template.
