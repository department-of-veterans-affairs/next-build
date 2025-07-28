"""
Sitemap XML parser for Locust load testing
"""
import xml.etree.ElementTree as ET
import requests
import random
import os
from urllib.parse import urlparse, urljoin
from typing import List, Dict, Set, Optional
import json

class SitemapLoader:
    """Load and parse URLs from sitemap.xml files"""
    
    def __init__(self, sitemap_url: Optional[str] = None, sitemap_file: Optional[str] = None):
        """
        Initialize SitemapLoader
        
        Args:
            sitemap_url: URL to fetch sitemap from (e.g., 'http://example.com/sitemap.xml')
            sitemap_file: Local path to sitemap.xml file
        """
        self.sitemap_url = sitemap_url
        self.sitemap_file = sitemap_file
        self.urls = []
        self.categorized_urls = {}
        
    def fetch_sitemap(self, url: str) -> str:
        """
        Fetch sitemap content from URL
        
        Args:
            url: Sitemap URL
            
        Returns:
            XML content as string
        """
        try:
            headers = {
                'User-Agent': 'Locust Load Testing Bot 1.0'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Error fetching sitemap from {url}: {e}")
            return ""
    
    def load_sitemap_file(self, file_path: str) -> str:
        """
        Load sitemap content from local file
        
        Args:
            file_path: Path to sitemap.xml file
            
        Returns:
            XML content as string
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"Sitemap file not found: {file_path}")
            return ""
        except Exception as e:
            print(f"Error reading sitemap file {file_path}: {e}")
            return ""
    
    def parse_sitemap(self, xml_content: str) -> List[str]:
        """
        Parse XML sitemap content and extract URLs
        
        Args:
            xml_content: XML content as string
            
        Returns:
            List of URLs from sitemap
        """
        urls = []
        
        if not xml_content.strip():
            return urls
            
        try:
            # Parse XML
            root = ET.fromstring(xml_content)
            
            # Handle different sitemap formats
            # Standard sitemap namespace
            namespaces = {
                'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'
            }
            
            # Try with namespace first
            url_elements = root.findall('.//sitemap:url/sitemap:loc', namespaces)
            
            # If no results with namespace, try without
            if not url_elements:
                url_elements = root.findall('.//url/loc')
            
            # If still no results, try finding all 'loc' elements
            if not url_elements:
                url_elements = root.findall('.//loc')
            
            # Extract URLs
            for url_elem in url_elements:
                if url_elem.text:
                    urls.append(url_elem.text.strip())
            
            # Handle sitemap index files (sitemaps that contain other sitemaps)
            sitemap_elements = root.findall('.//sitemap:sitemap/sitemap:loc', namespaces)
            if not sitemap_elements:
                sitemap_elements = root.findall('.//sitemap/loc')
            
            # If this is a sitemap index, fetch child sitemaps
            for sitemap_elem in sitemap_elements:
                if sitemap_elem.text:
                    child_sitemap_url = sitemap_elem.text.strip()
                    print(f"Found child sitemap: {child_sitemap_url}")
                    child_xml = self.fetch_sitemap(child_sitemap_url)
                    child_urls = self.parse_sitemap(child_xml)
                    urls.extend(child_urls)
                    
        except ET.ParseError as e:
            print(f"Error parsing XML sitemap: {e}")
        except Exception as e:
            print(f"Unexpected error parsing sitemap: {e}")
            
        return urls
    
    def categorize_urls(self, urls: List[str], base_url: str = "") -> Dict[str, List[str]]:
        """
        Categorize URLs based on their paths and patterns
        
        Args:
            urls: List of URLs to categorize
            base_url: Base URL to remove from paths
            
        Returns:
            Dictionary with categorized URLs
        """
        categories = {
            "homepage": [],
            "pages": [],
            "search": [],
            "api_endpoints": [],
            "heavy_endpoints": [],
            "forms": [],
            "media": [],
            "admin": []
        }
        
        for url in urls:
            # Convert to relative path if base_url provided
            if base_url and url.startswith(base_url):
                path = url[len(base_url):]
            else:
                parsed = urlparse(url)
                path = parsed.path
            
            # Skip empty paths
            if not path or path == '/':
                categories["homepage"].append(path or '/')
                continue
                
            path_lower = path.lower()
            
            # Categorize based on patterns
            if any(keyword in path_lower for keyword in ['search', 'find', 'query']):
                categories["search"].append(path)
            elif any(keyword in path_lower for keyword in ['/api/', 'api.']):
                categories["api_endpoints"].append(path)
            elif any(keyword in path_lower for keyword in ['report', 'export', 'download', 'analytics']):
                categories["heavy_endpoints"].append(path)
            elif any(keyword in path_lower for keyword in ['contact', 'submit', 'form', 'apply']):
                categories["forms"].append(path)
            elif any(keyword in path_lower for keyword in ['.jpg', '.png', '.gif', '.pdf', '.mp4', 'media/', 'images/']):
                categories["media"].append(path)
            elif any(keyword in path_lower for keyword in ['admin', 'dashboard', 'manage']):
                categories["admin"].append(path)
            else:
                categories["pages"].append(path)
        
        # Remove empty categories and limit URLs per category
        filtered_categories = {}
        for category, url_list in categories.items():
            if url_list:
                # Limit to reasonable number of URLs per category for load testing
                max_urls = 50 if category == "pages" else 20
                filtered_categories[category] = url_list[:max_urls]
        
        return filtered_categories
    
    def load_urls(self) -> Dict[str, List[str]]:
        """
        Load and categorize URLs from sitemap
        
        Returns:
            Dictionary with categorized URLs
        """
        xml_content = ""
        
        # Try to load from URL first, then file
        if self.sitemap_url:
            print(f"Fetching sitemap from URL: {self.sitemap_url}")
            xml_content = self.fetch_sitemap(self.sitemap_url)
        
        if not xml_content and self.sitemap_file:
            print(f"Loading sitemap from file: {self.sitemap_file}")
            xml_content = self.load_sitemap_file(self.sitemap_file)
        
        if not xml_content:
            print("No sitemap content available")
            return {}
        
        # Parse URLs from sitemap
        self.urls = self.parse_sitemap(xml_content)
        print(f"Found {len(self.urls)} URLs in sitemap")
        
        # Categorize URLs
        base_url = ""
        if self.sitemap_url:
            parsed = urlparse(self.sitemap_url)
            base_url = f"{parsed.scheme}://{parsed.netloc}"
        
        self.categorized_urls = self.categorize_urls(self.urls, base_url)
        
        # Print summary
        for category, url_list in self.categorized_urls.items():
            print(f"  {category}: {len(url_list)} URLs")
        
        return self.categorized_urls
    
    def save_urls_to_json(self, output_file: str = "sitemap_urls.json"):
        """
        Save categorized URLs to JSON file
        
        Args:
            output_file: Output file path
        """
        if not self.categorized_urls:
            print("No URLs to save. Run load_urls() first.")
            return
            
        try:
            output_path = os.path.join(os.path.dirname(__file__), output_file)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(self.categorized_urls, f, indent=2, ensure_ascii=False)
            print(f"URLs saved to {output_path}")
        except Exception as e:
            print(f"Error saving URLs to JSON: {e}")
    
    def get_random_url(self, category: str = "pages") -> str:
        """
        Get a random URL from a category
        
        Args:
            category: URL category
            
        Returns:
            Random URL from category
        """
        if not self.categorized_urls:
            return "/"
            
        url_list = self.categorized_urls.get(category, [])
        if not url_list:
            # Fallback to any available category
            all_urls = []
            for urls in self.categorized_urls.values():
                all_urls.extend(urls)
            return random.choice(all_urls) if all_urls else "/"
        
        return random.choice(url_list)


def load_sitemap_urls(sitemap_source: str = None) -> Dict[str, List[str]]:
    """
    Convenience function to load URLs from sitemap
    
    Args:
        sitemap_source: URL or file path to sitemap
        
    Returns:
        Dictionary with categorized URLs
    """
    if not sitemap_source:
        # Try to find sitemap.xml in current directory
        local_sitemap = os.path.join(os.path.dirname(__file__), 'sitemap.xml')
        if os.path.exists(local_sitemap):
            sitemap_source = local_sitemap
        else:
            print("No sitemap source provided and no local sitemap.xml found")
            return {}
    
    # Determine if it's a URL or file path
    if sitemap_source.startswith(('http://', 'https://')):
        loader = SitemapLoader(sitemap_url=sitemap_source)
    else:
        loader = SitemapLoader(sitemap_file=sitemap_source)
    
    return loader.load_urls()
