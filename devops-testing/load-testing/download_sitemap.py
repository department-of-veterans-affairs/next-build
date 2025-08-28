#!/usr/bin/env python3
"""
Download sitemap.xml from a running server for load testing
"""

import requests
import sys
import os
from urllib.parse import urljoin

def download_sitemap(base_url, output_file="sitemap.xml"):
    """
    Download sitemap.xml from a server
    
    Args:
        base_url: Base URL of the server (e.g., 'http://localhost:8080')
        output_file: Output filename
    """
    # Common sitemap locations
    sitemap_paths = [
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/robots.txt'  # Check robots.txt for sitemap location
    ]
    
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Locust Load Testing Bot 1.0'
    })
    
    # First, check robots.txt for sitemap location
    try:
        robots_url = urljoin(base_url, '/robots.txt')
        print(f"Checking robots.txt at: {robots_url}")
        
        response = session.get(robots_url, timeout=10)
        if response.status_code == 200:
            for line in response.text.split('\n'):
                if line.lower().startswith('sitemap:'):
                    sitemap_url = line.split(':', 1)[1].strip()
                    print(f"Found sitemap URL in robots.txt: {sitemap_url}")
                    
                    # Try to download the sitemap
                    sitemap_response = session.get(sitemap_url, timeout=30)
                    if sitemap_response.status_code == 200:
                        with open(output_file, 'w', encoding='utf-8') as f:
                            f.write(sitemap_response.text)
                        print(f"✅ Downloaded sitemap to: {output_file}")
                        return True
    except Exception as e:
        print(f"Could not check robots.txt: {e}")
    
    # Try common sitemap locations
    for path in sitemap_paths:
        if path == '/robots.txt':
            continue  # Already checked
            
        sitemap_url = urljoin(base_url, path)
        print(f"Trying: {sitemap_url}")
        
        try:
            response = session.get(sitemap_url, timeout=30)
            if response.status_code == 200:
                # Check if this looks like XML
                content = response.text.strip()
                if content.startswith('<?xml') or '<urlset' in content or '<sitemapindex' in content:
                    with open(output_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ Downloaded sitemap to: {output_file}")
                    
                    # Quick check of what we downloaded
                    lines = content.split('\n')[:10]
                    print("Preview of downloaded sitemap:")
                    for line in lines:
                        line = line.strip()
                        if line:
                            print(f"  {line}")
                    
                    return True
                else:
                    print(f"  Response doesn't look like XML sitemap")
            else:
                print(f"  HTTP {response.status_code}")
                
        except Exception as e:
            print(f"  Error: {e}")
    
    print("❌ Could not find or download sitemap")
    return False

def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python download_sitemap.py <base_url>")
        print("Example: python download_sitemap.py http://localhost:8080")
        sys.exit(1)
    
    base_url = sys.argv[1]
    if not base_url.startswith(('http://', 'https://')):
        base_url = 'http://' + base_url
    
    print(f"🔍 Looking for sitemap at: {base_url}")
    
    success = download_sitemap(base_url)
    
    if success:
        print("\n🎉 Success! You can now use the downloaded sitemap with:")
        print("  locust -f locustfile.py --host=" + base_url)
        print("\nOr test the sitemap loading with:")
        print("  python test_sitemap.py")
    else:
        print("\n❌ Failed to download sitemap. You can:")
        print("1. Check if the server is running")
        print("2. Manually create a sitemap.xml file")
        print("3. Use JSON configuration instead (urls.json)")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
