The accuracy & accessibility of the content on VA.gov is paramount. To ensure content is not directing people to pages that don't exist, we run an HTML scan on every page using the [linkinator](https://github.com/JustinBeckwith/linkinator) npm package.

run `SITE_URL="https://va.gov" node scripts/check-broken-links.mjs` to perform a scan. Change SITE_URL to any environment you want. It uses the
