# Caching

Next-build interacts with several different caching layers during its operations. Some of these layers it can control and others it lives with.

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

## drupalClient integration

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
