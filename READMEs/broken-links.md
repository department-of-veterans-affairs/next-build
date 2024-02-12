The accuracy & accessibility of the content on VA.gov is paramount.

Separately from the [testing suite](./testing.md), we run an HTML scan on every page using the [linkinator](https://github.com/JustinBeckwith/linkinator) npm package to ensure content is not directing people to pages that don't exist.

# Quickstart

Run `SITE_URL="https://va.gov" node scripts/check-broken-links.mjs` to perform a scan. Change SITE_URL to any environment you want. It uses the proxy-fetcher package from this repo, so it is A-OK to check environments behind the VA network.

# Additional Options

A number of different options can be passed as environment variables to change this script's behavior.

- `SITE_URL`: The site to run a scan on. It must provide a sitemap.xml. Defaults to https://www.va.gov
- `BATCH_SIZE`: The number of batches the list of links found in the sitemap should be split into for processing. Defaults to 20.
- `TOTAL_INSTANCES`: When running multiple instances, this is total number being used. Each instance gets a slice of the total pages, `sitemap_urls.length / TOTAL_INSTANCES` roughly.
- `INSTANCE_NUMBER`: When running multiple instances, this is the particular slice being run. These two vars can also be used locally to restrict the scan to a subset of the total set, which is useful for development purposes.
- `VERBOSE`: Enable dot reporting of each link checked. Defaults to false, gets very noisy with large sitemaps.
- `NODE_EXTRA_CA_CERTS`: If you see a lot of STATUS: 0 errors, it likely means there was an SSL error with certificates. You can generate the `certs/VA-mozilla-combined.pem` file via `yarn certs` to resolve the vast majority of these.

Example with additional option usage:
`TOTAL_INSTANCES=64 INSTANCE_NUMBER=15 NODE_EXTRA_CA_CERTS=./certs/VA-mozilla-combined.pem SITE_URL="https://va.gov" BATCH_SIZE=15 VERBOSE=true node scripts/check-broken-links.mjs`

# Reporting

The full report metrics & list of broken links are written to a file `broken-links-report.json` upon completion.

# Github Action

This script is run against va.gov via a [Broken Links Check Github Action](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/broken-links-check.yml). Each individual run spreads the page scans across 64 instances. Once those are complete, the 64 reports are combined into a single report, and saved as files attached to the workflow run in json, markdown, and csv formats. Slack is informed after a workflow run with statistics on the scan and links to the full reports.

Currently the scan runs nightly and can be run manually as well.

TODOs:

- Upload the GHA run's broken-links-report.json to S3
