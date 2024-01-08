The accuracy & accessibility of the content on VA.gov is paramount.

Separately from the [testing suite](./testing.md), we run an HTML scan on every page using the [linkinator](https://github.com/JustinBeckwith/linkinator) npm package to ensure content is not directing people to pages that don't exist.

Run `SITE_URL="https://va.gov" node scripts/check-broken-links.mjs` to perform a scan. Change SITE_URL to any environment you want. It uses the proxy-fetcher package from this repo, so it is A-OK to check environments behind the VA network.

You can also pass `BATCH_SIZE=` as a variable to change the number of processes that should be checking links at once. Currently defaults to **20** batches.

This script will output results to the terminal for each link it scans in the form of dot notation (**.** for success, **?** is skipped, **!** for broken). A human-readable list of all broken links discovered is output at the end of a scan. Additionally, the full report metrics & list of broken links is written to a file `broken-link-report.json`

TODOs:

- Import the list of ignored links from the CMS (`config/sync/node_link_report.settings.yml` in va.gov-cms repo)
- Run this script in GHA on some cadence
- Upload that broken-link-report.json to S3
- Notify slack when broken links are found
- Clean up this documentation
