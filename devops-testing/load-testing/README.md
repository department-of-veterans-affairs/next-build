# Load Testing with Locust.io

This directory contains comprehensive load testing scenarios using Locust.io for testing different load patterns on the application.

## Files Overview

- `locustfile.py` - Main load testing file with JSON URL loading
- `locustfile_enhanced.py` - Enhanced version with advanced URL configuration
- `load_scenarios.py` - Flexible scenarios with tagged tests for specific load types
- `urls.json` - Simple URL configuration file
- `advanced_urls.json` - Advanced URL configuration with weights and parameters
- `url_utils.py` - URL loading utilities for advanced configuration
- `docker-compose.yml` - Docker setup for distributed load testing
- `Dockerfile` - Container configuration for Locust

## URL Configuration

### URL Loading Priority

The load testing system tries to load URLs in this order:

1. **Sitemap.xml** (if available and dependencies installed)
2. **Simple JSON Configuration** (`urls.json`)
3. **Advanced JSON Configuration** (`advanced_urls.json`)
4. **Default hardcoded URLs** (fallback)

### Sitemap.xml Loading

Load URLs automatically from your website's sitemap:

**From URL:**

```bash
export SITEMAP_URL="http://localhost:8080/sitemap.xml"
locust -f locustfile.py --host=http://localhost:8080
```

**From local file:**

```bash
# Place sitemap.xml in the same directory as locustfile.py
curl http://localhost:8080/sitemap.xml > sitemap.xml
locust -f locustfile.py --host=http://localhost:8080
```

**Dependencies for sitemap loading:**

```bash
pip install requests
```

**Sitemap features:**

- Automatically categorizes URLs based on patterns
- Supports standard sitemap.xml format
- Handles sitemap index files (sitemaps containing other sitemaps)
- Limits URLs per category to reasonable numbers for load testing
- Falls back gracefully if sitemap is unavailable

**URL categorization from sitemap:**

- `homepage`: Root paths (/, /index.html, /home)
- `pages`: General content pages
- `search`: URLs containing 'search', 'find', 'query'
- `api_endpoints`: URLs containing '/api/' or 'api.'
- `heavy_endpoints`: URLs with 'report', 'export', 'download', 'analytics'
- `forms`: URLs with 'contact', 'submit', 'form', 'apply'
- `media`: Image, video, PDF files
- `admin`: Admin and dashboard URLs

### Simple Configuration (`urls.json`)

The basic `urls.json` file contains URL categories:

```json
{
  "homepage": ["/", "/index.html"],
  "pages": ["/page1.html", "/page2.html", "/page3.html"],
  "search": ["/search?q=veterans", "/search?q=benefits"],
  "api_endpoints": ["/api/health", "/api/status"],
  "heavy_endpoints": ["/reports/monthly", "/data/export/csv"],
  "forms": ["/contact/submit", "/feedback/submit"]
}
```

### Advanced Configuration (`advanced_urls.json`)

The advanced configuration includes weights, HTTP methods, parameters, and expected status codes:

```json
{
  "url_groups": {
    "homepage": {
      "urls": [
        { "url": "/", "weight": 5, "method": "GET" },
        { "url": "/index.html", "weight": 2, "method": "GET" }
      ]
    },
    "forms": {
      "urls": [
        {
          "url": "/contact/submit",
          "weight": 2,
          "method": "POST",
          "data": { "name": "Test User", "email": "test@example.com" },
          "expected_status": [200, 201]
        }
      ]
    }
  }
}
```

## Quick Start

```bash
# Basic Docker setup
docker-compose up --scale worker=4  # Starts 1 master and 4 workers

# Access the Locust web interface at http://localhost:8089
```

## Running Tests

### With JSON URL Configuration

```bash
# Simple URL configuration
locust -f locustfile.py --host=http://localhost:8080

# Enhanced configuration (with advanced URLs if available)
locust -f locustfile_enhanced.py --host=http://localhost:8080
```

### Tagged Scenario Tests

```bash
# Normal Load Only
locust -f load_scenarios.py --tags normal --host=http://localhost:8080

# Peak Load Only
locust -f load_scenarios.py --tags peak --host=http://localhost:8080

# Spike Load Only
locust -f load_scenarios.py --tags spike --host=http://localhost:8080
```

## Testing Sitemap Functionality

Test the sitemap loading before running your load tests:

```bash
# Test sitemap loading functionality
python test_sitemap.py

# This will:
# - Test loading from local sitemap.xml
# - Verify URL categorization
# - Create test_sitemap_urls.json for inspection
# - Show integration examples
```

## Customizing URLs

### Method 1: Edit JSON Files

1. **Simple URLs**: Edit `urls.json` to add/modify URL categories
2. **Advanced URLs**: Edit `advanced_urls.json` for weighted URLs with parameters

### Method 2: Create Environment-Specific Configs

Create separate JSON files for different environments:

```bash
# Development URLs
locust -f locustfile.py --host=http://localhost:3000
# (uses urls.json)

# Staging URLs
cp urls.json urls_staging.json
# Edit urls_staging.json for staging endpoints
# Modify locustfile.py to load 'urls_staging.json'
```

## Load Test Parameters

### Normal Load

- **Users**: 10-50 concurrent users
- **Wait Time**: 2-8 seconds between requests
- **Pattern**: Steady browsing, search, page views

### Peak Load

- **Users**: 50-150 concurrent users
- **Wait Time**: 1-3 seconds between requests
- **Pattern**: Rapid browsing, API calls, form submissions

### Spike Load

- **Users**: 150-300+ concurrent users
- **Wait Time**: 0.5-2 seconds between requests
- **Pattern**: Intensive requests, concurrent operations

## Monitoring

Monitor these key metrics during tests:

- Response Time (average, 95th percentile)
- Throughput (requests per second)
- Error Rate (% of failed requests)
- Resource Utilization (CPU, memory)
