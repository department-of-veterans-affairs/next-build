The accuracy & accessibility of the content on VA.gov is paramount.

Separately from the [testing suite](./testing.md), we run an HTML scan on every page using the [linkinator](https://github.com/JustinBeckwith/linkinator) npm package to ensure content is not directing people to pages that don't exist.

# Quickstart

Run `SITE_URL="https://va.gov" node scripts/check-broken-links.mjs` to perform a scan. Change SITE_URL to any environment you want. It uses the proxy-fetcher package from this repo, so it is A-OK to check environments behind the VA network.

# Additional Options

A number of different options can be passed as environment variables to change this script's behavior.

- `SITE_URL`: The site to run a scan on. It must provide a sitemap.xml. Defaults to https://www.va.gov
- `BATCH_SIZE`: The number of batches the list of links found in the sitemap should be split into for processing. Defaults to 32.
- `VERBOSE`: Enable dot reporting of each link checked. Defaults to false, gets very noisy with large sitemaps.
- `SKIP_IMAGES`: Whether to verify if image links resolve or not.
- `NODE_EXTRA_CA_CERTS`: If you see a lot of STATUS: 0 errors, it likely means there was an SSL error with certificates. You can generate the `certs/VA-mozilla-combined.pem` file via `yarn certs` to resolve the vast majority of these.

Example with additional option usage:
`NODE_EXTRA_CA_CERTS=./certs/VA-mozilla-combined.pem SITE_URL="https://va.gov" BATCH_SIZE=15 VERBOSE=true node scripts/check-broken-links.mjs`

# Reporting

A human-readable list of all broken links discovered is output at the end of a scan. The full report metrics & list of broken links are written to a file `broken-links-report.json` upon completion.

Additionally, if the `VERBOSE` flag is true, this script will output results to the terminal for each link it scans in the form of dot notation (**.** for success, **-** is skipped, **x** for broken). This can be very noisy, not recommended for large sitemaps.

TODOs:

- Wire up option to skip checking image links
- Run this script in GHA on some cadence
- Upload the GHA run's broken-links-report.json to S3
- Notify slack when broken links are found
- Clean up this documentation
