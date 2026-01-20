# Caching

Next-build interacts with several different caching layers during its operations. Some of these layers it can control and others it lives with.

## Redis

One of the caching layers that next-build does control is [drupalClient's](/src/lib/drupal/drupalClient.ts) cache. For this layer, we use [redis](https://redis.io/).

To use the redis cache during your local static builds, start redis locally using `yarn redis`.

```sh
docker run --name next-redis -p 6379:6379 -d redis
```

Either approach will start [redis](https://redis.io/) in a docker container (`next-redis`) that exposes the internal port from the container to your localhost via `redis://localhost:6379` or `redis://127.0.0.1:6379` or `redis-cli` (if installed).

You can also interact with redis directly inside the container using `yarn redis:cli`.

```
docker exec -it next-redis redis-cli
```

Once redis has started, running `yarn export` will generate all static pages and cache certain repeated requests.

We intentionally do not use this cache when running `yarn dev` (TODO: or `yarn build:preview`) so that every page
always receives fresh data.

There are several ways the cache can be emptied.
`yarn redis:stop` will stop the running container and destroy it. Running `yarn redis` again will recreate it in a fresh state.

If you don't want to destroy the container, run `yarn redis:cli` and enter `FLUSHALL` as the prompt.

```
yarn redis:cli
127.0.0.1:6379> KEYS *
1) "menu:header-megamenu"
2) "menu:footer-bottom-rail"
3) "menu:va-gov-footer"
127.0.0.1:6379> flushall
OK
127.0.0.1:6379> KEYS *
(empty array)
127.0.0.1:6379>
```

Either approach will ensure a clean cache for a new build.

### drupalClient integration

The drupalClient from `next-drupal` expects a cache it is provided to implement this interface:

```ts
export interface DataCache {
  get(key: any): Promise<unknown>
  set(key: any, value: any, ttl?: number): Promise<unknown>
  del?(keys: any): Promise<unknown>
}
```

We construct this wrapper around node-redis in [redisCache.ts](src/lib/utils/redisCache.ts). It is passed to the drupalClient instance as an option.

Individual resource or menu requests can make use of the cache by providing a cacheKey:

```ts
export async function getMenu(name: string, params: QueryParams<null>) {
  const menu = await drupalClient.getMenu(name, {
    params: params().getQueryObject(),

    // Cache resource during build, not dev.
    withCache: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
    cacheKey: `menu:${name}`,
  })

  return menu
}
```

See [next-drupal's docs](https://next-drupal.org/docs/cache) for more information.

## Other Caches that next-build interacts with

- Drupal's cache (updated when a user saves a node, can effect what data is returned from JSON:API)
- Browser cache (downloaded CSS & assets, local session storage for banners, etc.)
- [next.js caching](https://nextjs.org/docs/app/building-your-application/caching). This will be more relevant when ISR is implemented.

---

# Build-side caching discovery - January 2026

[Ticket #23044](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/23044)

This is me trying to give a comprehensive summary of the things I've tried, the problems I've encountered, and the conclusions I've made regarding build-side caching.

**TL;DR:** After testing Redis caching and in-memory caching approaches, build-side caching does not meaningfully reduce Next.js build times. Initial apparent wins were due to Varnish caching on the Drupal side, not our implementation. The core bottleneck is page-specific queries that can't be cached, which dominate build time. Redis caching does not help in production builds, and lower-environment builds gain far more from Varnish caching on the Drupal side than Redis caching on the build side.

## A false start

I set out to implement build-side query caching for [the content-release workflow](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/content-release.yml) to see if it would shorten Next.js build times. The first thing I did was collect a couple recent historical staging-environment build times as a baseline:

| Build link                                                                                    | Total time | Build step time |
| --------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [#590](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20277110097) | 38m39s     | 30m32s          |
| [#600](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20277110097) | 36m59s     | 28m51s          |

What I didn't realize was that right after those builds, [the staging-environment config was changed](https://github.com/department-of-veterans-affairs/next-build/commit/e53064fc3c559a6f8dc7d816152b5adb11b97a10) so that requests would be made against `mirror.cms.va.gov`, which uses Varnish to cache requests on the Drupal side. This meant that when I implemented my first set of changes, I was not comparing apples to apples anymore, so I got some funny results that threw me off for a bit until I realized what happened.

The first change I made was to implement a Redis cache, which is something we were already doing for local builds. When I then saw the following results, I believed that the cache was persisting between builds and went on a wild goose chase to solve that problem:

| Build link                                                                                                    | Total time | Build step time | Notes                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#606](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20585012027/job/59119805701) | 26m6s      | 17m52s          |                                                                                                                                                                                                                                                                                    |
| [#607](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20585498558/job/59121259049) | 20m33s     | 7m38s           | I think the cache might not be clearing                                                                                                                                                                                                                                            |
| [#609](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20585932800/job/59122331736) | 14m12s     | 5m0s            | Tried to have the cache flushed first                                                                                                                                                                                                                                              |
| [#610](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20586156432/job/59122949172) | 11m45s     | 3m9s            | Tried giving each redis container a unique name                                                                                                                                                                                                                                    |
| [#611](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20602296022)                 | 40m2s      | 31m7s           | Cold start the next day                                                                                                                                                                                                                                                            |
| [#612](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20603192564)                 | 14m46s     | 5m54s           | Immediately following 611. Tested a menu change, and the change was deployed correctly rather than the old menu being pulled from the previous cache                                                                                                                               |
| [#613](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20603540069)                 | 15m38s     | 7m15s           | Tested another menu change, a VAMC System page intro text change, and a news story change. The changes to the VAMC System page take, including the teaser for the news story that is embedded on that page. However, the news story's own page does not get updated correctly. the |

When I learned that it was actually Varnish that was caching requests on the Drupal side, I switched to a data source without Varnish so I could compare apples to apples.

## Comparing without Varnish

Collected a new baseline (arguably the same as the first, and the results are pretty similar):

| Build link                                                                                                    | Total time | Build step time | Notes                                                                   |
| ------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | ----------------------------------------------------------------------- |
| [#614](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20604607541/job/59177617142) | 36m25s     | 27m53s          | Using content-build tugboat instance, no cache                          |
| [#615](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20605392406/job/59180066981) | 35m35s     | 26m52s          | Updated VAMC system intro and menu. Changes showed up in deployed page. |

Then I re-tested my two Redis branches with a Varnish-less data source:

| Build link                                                                                                    | Total time | Build step time | Notes                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#616](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20606139712)                 | 35m35s     | 26m39s          | [pwolfert/redis-on](https://github.com/department-of-veterans-affairs/next-build/compare/pwolfert/redis-on)                                       |
| [#620](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20624883317/job/59233719807) | 36m36s     | 27m45s          | [pwolfert/redis-on-with-query-changes](https://github.com/department-of-veterans-affairs/next-build/compare/pwolfert/redis-on-with-query-changes) |

The second branch _with query changes_ was an attempt to take advantage of the caching by making separate requests for repeated data like VAMC Systems. Menu data was automatically cached in the base Redis branch, but this went a step farther to try to achieve speed gains. As you can see, however, neither branch resulted in any real gains.

I think the reason why we're not seeing gains is that the page queries take so long that the added menu and VAMC System data is nominal in comparison. We can only build the page once we've received the response for the primary page data, which is something that can't be cached because it's unique to each page. The content type that would have been most impacted by splitting the VAMC and menu queries out would have been the `node--health_care_region_detail_page` pages, which total 6,219. The second highest page count is for the `node--news_story` pages, and that can't benefit at all from build-side caching.

## Pivoting to an in-Memory cache

The Redis cache is implemented as a separate server in a container on the network. I thought, what if the network request overhead is the difference here between beating the regular, non-cached requests and tying them? Would the cached requests come back faster if I did it in memory?

The problem with an in-memory cache is that Next.js splits the build into multiple processes. I counted 12 of them in the GitHub Actions build. These processes don't share memory by default. Therefore if I implemented my cache within my JavaScript code, we'd end up having 12 different versions of the cache, which drains it of all usefulness. And indeed I saw no gains by that implementation:

| Build link                                                                                                    | Total time | Build step time | Notes                                      |
| ------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | ------------------------------------------ |
| [#622](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20628658345/job/59243279037) | 35m58s     | 27m38s          | Memory caching with query modifications    |
| [#625](https://github.com/department-of-veterans-affairs/next-build/actions/runs/20629332928/job/59244831657) | 35m15s     | 27m44s          | Memory caching without query modifications |

Node is designed to not share memory between processes. Working around that would introduce complexity that nobody will want to maintain. If we used low-level system interfaces to access shared memory, it would be unwieldy, fragile, complex, and arcane. If we try to implement it more simply with writing to the file system, I don't think there's any chance that it'll be faster than network requests to and from the Redis server. The juice isn't worth the squeeze, especially since we don't even know if there's juice.

## Conclusion

After multiple iterations, false starts, and controlled comparisons, the evidence strongly suggests that build-side caching is not an effective lever for meaningfully reducing our Next.js build times.

The initial apparent wins were the result of an environmental change (Varnish-backed Drupal responses) rather than the introduction of Redis or in-memory caching. Once the data source was normalized and Varnish removed from the equation, both Redis-based caching and more aggressive query splitting produced build times that were statistically indistinguishable from the baseline. In other words, the caching mechanisms themselves were working correctly—but they were not solving the right problem.

The core constraint appears to be the cost of fetching page-unique data. Each page build is gated on its primary query, which cannot be cached or reused across pages. Shared data such as menus and VAMC system metadata does benefit from caching, but those gains are overwhelmed by the sheer volume and latency of page-specific queries. Given the distribution of content types—especially the large number of pages that cannot benefit from query reuse at all—build-side caching only addresses a small fraction of total build time.

The in-memory cache experiment further reinforces this conclusion. Next.js’s multi-process build model makes process-local caching ineffective, and any attempt to introduce shared memory or filesystem-based coordination would add significant complexity for, at best, theoretical gains. At that point, the solution becomes harder to maintain than the problem warrants.

Further optimization efforts are likely to be more productive if they focus on reducing the cost of page-specific queries or generally improving upstream response times. Build-side caching is does not help us improve build times.
