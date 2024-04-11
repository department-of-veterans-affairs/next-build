# Pagination

## Background

Pagination refers to any situation where there's a limit on the number of items that can comprise a single page, and where the total number of items in question exceeds this single-page limit.

This documentation discusses pagination in two contexts:

1. Listing Pages
2. JSON:API

## Listing Pages

Our listing pages fall into two categories:

1. All-Static Listing Pages
2. Single-Page Listing Pages

It's important to note here that the language around these pages can become a bit tricky:

- We collectively refer to certain content types as "Listing Pages" (e.g. Story Listing Pages, Event Listing Pages).
- Individual listing "pages" are often, themselves, comprised of multiple "pages" of content.
- We'll often refer to "paged pages" to distinguish the individual pages from the higher level of organziation.

### All-Static Listing Pages

E.g. Story Listing Pages

All-static listing pages are the listing pages whose individual paged pages are all statically generated at build time.

This can be demonstrated by looking at an example of the story-listing static paths that are generated for a particular VAMC:

- /minneapolis-health-care/stories
- /minneapolis-health-care/stories/page-2
- /minneapolis-health-care/stories/page-3
- /minneapolis-health-care/stories/page-4

It's important to emphasize: ALL of these pages are statically generated at build time.

Here is how this is accomplished:

- Drupal manages a _single_ entity that represents the listing page for Minneapolis Health Care's news stories.
- That node has incoming references (story nodes point at that listing page to indicate they should be listed there): ![Screenshot showing editor field to select the listing page on which a story should be listed](./images/where-should-story-be-listed.png)
- When the page is queried during build time, these incoming references allow all of the individual stories to be queried as well. This allows us to know the total number of stories that need to be listed.
- The total number of stories is divided by the `PAGE_SIZE` to calculate the total number of paged pages.
- One static path is returned for each page. The first static path has no paging segment. The subsequent paths include `/page-x` at the end.
- When it comes time to build each individual paged page, the page number is used to calculate an offset for querying the individual stories. The query for the individual page in question will request `PAGE_SIZE` stories, starting from the calculated offset.

### Single-Page Listing Pages

E.g. Event Listing Pages

Single-page listing pages are much different. Rather than statically generating a separate page for each subsequent paged page, only a single static page is generated. Then, paging is handled by the browser.

This can be demonstrated by looking at an example of the event-listing static path that is generated for a particular VAMC:

- /minneapolis-health-care/events
- (no others)

Here is how this is accomplished:

- Currently, this browser-side paging is handled by a widget in vets-website.
- Utilizing that widget amounts to sending _all_ of the paged entities to the browser.
- With the entirety of the data on hand, the browser code implements paging by filtering the data to a certain slice of the whole based on the current page it wants to display. When the user clicks to change the page, a new slice is cut from the whole.

## JSON:API

Paging also applies in the context of querying data from Drupal. This is related to our concept of listing pages (and is a foundational piece of rendering listing pages), but it's also applicable outside that context.

JSON:API has a hard limit of 50 resources per page, but we often need to query more than this limit. In most cases where this is true, we ultimately want to request _all_ of the resources in a given collection. Generating listing pages, as discussed previously in this document, is one such example. Another very important example is static-path generation. In order to properly generate _all_ the pages we need to build, we need to be able to ask Drupal for all of the pages it knows about, and, for any given resource type, this might very well be more than 50.

In order to work around this limit, we simply fetch 50 at a time and "glue" them all together. This is done and explained in `src/lib/drupal/query.ts` in a function named `fetchAndConcatAllResourceCollectionPages`.

It's important to note that there are additional mechanisms at play here that influenced the decision of how to handle paging, and that might influence future iterations:

- https://next-drupal.org/guides/page-limit
- https://github.com/chapter-three/next-drupal/issues/527 (a bug that limited our options; this bug has now been fixed).
- Utilizing JSON:API's `next` links would require fetching in series. Utilizing custom paging allowed us to fetch in parallel.
