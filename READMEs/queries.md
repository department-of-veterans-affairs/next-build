# Queries

Queries are how data makes it to the front end templates of next-build. They consist of three functions:

- **params**: a constructor for the JSON:API params required for a given query
- **data**: where the fetch to the endpoint is actually performed
- **formatter**: shaping the response from the data function to an agnostic format for the front end (i.e. front end templates should not be using drupal field names)

We'll break down each of these in detail, using News Story as our example. But first, let's look at what Drupal's JSON:API gives us.

## How JSON:API works

Most of the data for next-build comes from Drupal's JSON:API. Here's a list of [available endpoints](https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/) provided by the CMS. If you see `Some resources have been omitted because of insufficient authorization.`, you'll need to log in to the CMS first to set auth for your session.

A [News Story node](https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/news_story) has a
lot of data, and most of the data we need for each field, but not all. Some fields are entity references to other pieces of content. Ctrl+f for `field_author` and see this:

<!-- prettier-ignore -->
```json
"field_author": {
  "data": {
    "type": "node--person_profile",
    "id": "c76037be-ebb0-4338-9b31-973a76958929",
    "meta": {
      "drupal_internal__target_id": 378
    }
  },
  "links": {
    "related": {
      "href": "https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/news_story/bb4dcfc1-736b-4a9e-aa48-23c2dd4a4980/field_author?resourceVersion=id%3A17354"
    },
    "self": {
      "href": "https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/news_story/bb4dcfc1-736b-4a9e-aa48-23c2dd4a4980/relationships/field_author?resourceVersion=id%3A17354"
    }
  }
},
```

That tells us that another piece of content is referenced by our news story node, but it doesn't give us any of that content's data by default. To include fields with the reference node's data, add `?include=` to your endpoint with the field name. This additional data will be included in the response in an array under the `included:` key.

https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/jsonapi/node/news_story?include=field_author

When querying resources via drupalClient, the data will be serialized appropriately into a structured response that includes references in-line, instead of in a separate array.

## How Queries work

Now that we have an idea of what JSON:API provides, how do we use that data in next-build? With a little help from [next-drupal](https://next-drupal.org/) and other open source libraries, of course! The structure of our queries is largely dictated by what the next-drupal provided [drupalClient](/src/lib/drupal/drupalClient.ts) is expecting: a resource type and a parameter object.

There is a master list of all queries available in `src/data/queries/index.ts`. This file contains reference to all configured queries in the repo as well as a number of helper types for our build processes. All we really need to know is that the queries defined in `QUERIES_MAP` are made up of the functions previously mentioned: **params**, **data** and **formatter**.

These three work together to create consistent requests and responses for all configured query types. They are independent functions so they can be called in isolation when needed. For example, you may need to consistenly format some portion of data returned by multiple query types or have to include similar query parameters to multiple resource requests.

**Not every query file has all three parts!** Some may contain just a `formatter`, as they will never be queried individually (e.g. many Paragraphs).

The helper types mentioned above help ensure the correct query files and functions are being referenced, so errors will be thrown when you try to query resources without data functions defined or other incongruous usages.

### Params

The `params` portion of a query is a function that helps format the desired query's parameters into a JSON:API-compliant shape.

```js
// Define the query params for fetching node--news_story.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    ...getNestedIncludes('field_media', 'media--image'),
    'field_author',
    'field_listing',
    'field_administration',
  ])
}
```

In this example, we ask for 5 additional fields to be included. We want our request to also contain the data for referenced entities in the `field_author`, `field_listing`, `field_administration`, `field_media` and `field_media.image`.

The dot notation from the last field there is how you tell [JSON:API to include references on references](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/includes). We have a custom helper function `getNestedIncludes` to help re-use defined query parameters for arbitrary field names. Image fields may not always be
named `field_media`, but you will always want to include the `.image` reference on that entity.

The params object can get more complex if needed. For example, listing pages may want to limit results to a specific VAMC System, or use different fields for sorting.

```js
export const listingParams: QueryParams<string> = (listingEntityId: string) => {
  return queries
    .getParams(`${RESOURCE_TYPES.STORY}--teaser`)
    .addFilter('field_listing.id', listingEntityId)
    .addSort('-created')
}
```

The returned object will be used in the data function as the `params` object for drupalClient's resource requests.

### Data

The data function is where we `fetch` data. We have a number of wrappers around that fetch (drupalClient, proxy-fetcher, redis, helper functions for pagination & preview, etc), but at it's core, the data function is performing `fetch` to read data from the JSONAPI endpoint. Any data fetched here happens on the server and will be present on the page when it is generated statically. If you have data that needs to be dynamic, it must be fetched in a `useEffect` hook in the template itself. This is generally a rare occurence.

```js
// Implement the data loader.
export const data: QueryData<NewsStoryDataOpts, NodeNewsStory> = async (
  opts
): Promise<NodeNewsStory> => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.STORY,
    params
  )) as NodeNewsStory

  return entity
}
```

This function is basically saying: "Go fetch me a RESOURCE_TYPES.STORY, that may or may not be published, and use these parameters to do it."

We could return the promise directly, but returning the `entity` helps keep it readable at a glance, and we may be performing multiple fetches for different dependent resources in one data function.

For example, a News Story Listing page ends up making at least three different fetches: the listing page's content, the paginated items for a given page number, and the menu items for that page. It ultimately returns much more than just the single entity.

Whether a single fetch is made for everything or multiple responses are collected, it all needs to be passed to the `formatter()`.

### Formatter

Think of the `formatter()` as the glue layer between API data and web page display. We normalize our data here. This way we can receive all the necessary data from the CMS (or elsewhere) and deliver exactly what the components and pages expect, without being tied explicitly to Drupal field structure and name schemes. Technically, formatting could happen in the `data` function, but we would lose a fair bit of flexibility. Sometimes you have the data returned from a separate JSON:API request (i.e. from an `include`) and want to shape it consistently. It wouldn't make sense to query that data again separately just to receive it in the shape you want.

This separation of concerns also keeps the door open to ingest and display data from any source, not necessarily Drupal, in a consistent manner. The formatter doesn't care where input comes from, it just wants to output structured data.

To finish the News Story example, here's the formatter:

```js
export const formatter: QueryFormatter<NodeNewsStory, NewsStory> = (
  entity: NodeNewsStory
) => {
  return {
    ...entityBaseFields(entity),
    image: queries.formatData('media--image', entity.field_media),
    caption: entity.field_image_caption,
    author: entity.field_author,
    introText: entity.field_intro_text,
    bodyContent: entity.field_full_story,
    date: entity.created,
    socialLinks: {
      path: entity.path.alias,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
    administration: {
      id: entity.field_administration?.drupal_internal__tid || null,
      name: entity.field_administration?.name || null,
    },
  }
}
```

It takes the `entity` returned from the data function, which is in the shape of `NodeNewsStory` and it outputs a generic `NewsStory` object.

You'll notice that all of the object keys are generic names, mapped to the Drupal field names on the entity. This is how the front-end prop names stay agnostic to their data source.

News Story also re-uses a formatter defined elsewhere for its image field: `image: queries.formatData('media--image', entity.field_media),`
This says, go find the formatter function previously defined for the `media--image` resource and use it to shape the data from this field: `entity.field_media`. We don't need to re-request the media data, but we do want it in a consistent shape for the front-end component to ingest.

`entityBaseFields` is a helper function that returns fields common to all node types. They would be tedious to type out manually each time a new node type is migrated, but potentially build-breaking to forget. e.g. CMS Preview functionality will not work correctly without the `published` key being present.

```js
// Helper function to return a consistent set of base fields for resources.
export const entityBaseFields = (entity: NodeTypes): PublishedEntity => {
  return {
    id: entity.id,
    entityId: entity.drupal_internal__nid,
    entityPath: entity.path.alias,
    type: entity.type,
    published: entity.status,
    moderationState: entity.moderation_state,
    title: entity.title,
    metatags: entity.metatag,
    breadcrumbs: entity.breadcrumbs,
    lastUpdated: entity.field_last_saved_by_an_editor || entity.created,
  }
}
```

Ultimately, the normalized `NewsStory` object returned by the formatter is the `resource` used by [\[\[...slug\]\]](/src/pages/[[...slug]].tsx). That resource then gets passed to the [\<NewsStory\> template](/src/templates/layouts/newsStory/index.tsx), **so the formatter's object keys and the prop names should almost always match**! There may be slight differences, say if a component also depends on a parent template's state, but this is largely one-way differences. If a template doesn't need the formatted data... why include it?

## Additional reading

- [Drupal JSON:API docs](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/api-overview).
- [next-drupal: fetching data](https://next-drupal.org/docs/fetching-resources)
- [next-drupal: jsonapi-params](https://next-drupal.org/guides/jsonapi-params)
- [drupal-jsonapi-params](https://github.com/d34dman/drupal-jsonapi-params)
