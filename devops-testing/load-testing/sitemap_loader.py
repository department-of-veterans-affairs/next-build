"""
Sitemap XML parser for Locust load testing
"""
import xml.etree.ElementTree as ET
import requests
import random
import os
import glob
from urllib.parse import urlparse, urljoin
from typing import List, Dict, Set, Optional
import json

class SitemapLoader:
    """Load and parse URLs from sitemap.xml files"""
    
    def __init__(self, sitemap_url: Optional[str] = None, sitemap_file: Optional[str] = None, sitemap_directory: Optional[str] = None):
        """
        Initialize SitemapLoader
        
        Args:
            sitemap_url: URL to fetch sitemap from (e.g., 'http://example.com/sitemap.xml')
            sitemap_file: Local path to sitemap.xml file
            sitemap_directory: Directory containing multiple sitemap files
        """
        self.sitemap_url = sitemap_url
        self.sitemap_file = sitemap_file
        self.sitemap_directory = sitemap_directory
        self.urls = []
        self.categorized_urls = {}
        self.url_sources = {}  # Track which sitemap each URL came from
        
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
    
    def discover_sitemap_files(self, directory: str) -> List[str]:
        """
        Discover all sitemap files in a directory
        
        Args:
            directory: Directory path to search for sitemap files
            
        Returns:
            List of sitemap file paths
        """
        sitemap_files = []
        
        if not os.path.exists(directory):
            print(f"Sitemap directory not found: {directory}")
            return sitemap_files
        
        # Common sitemap file patterns
        patterns = [
            "sitemap*.xml",
            "*.xml",
            "sitemap*.txt"
        ]
        
        for pattern in patterns:
            file_pattern = os.path.join(directory, pattern)
            found_files = glob.glob(file_pattern)
            sitemap_files.extend(found_files)
        
        # Remove duplicates and sort
        sitemap_files = sorted(list(set(sitemap_files)))
        
        print(f"Found {len(sitemap_files)} sitemap files in {directory}:")
        for file_path in sitemap_files:
            print(f"  - {os.path.basename(file_path)}")
        
        return sitemap_files
    
    def load_multiple_sitemaps(self, sitemap_files: List[str]) -> List[str]:
        """
        Load and parse URLs from multiple sitemap files
        
        Args:
            sitemap_files: List of sitemap file paths
            
        Returns:
            Combined list of URLs from all sitemaps
        """
        all_urls = []
        
        for sitemap_file in sitemap_files:
            sitemap_name = os.path.basename(sitemap_file)
            print(f"Processing sitemap: {sitemap_name}")
            xml_content = self.load_sitemap_file(sitemap_file)
            if xml_content:
                urls = self.parse_sitemap(xml_content)
                print(f"  Found {len(urls)} URLs")
                
                # Track source for each URL
                for url in urls:
                    self.url_sources[url] = sitemap_name
                
                all_urls.extend(urls)
            else:
                print(f"  Skipped (no content)")
        
        # Remove duplicates while preserving order
        seen = set()
        unique_urls = []
        for url in all_urls:
            if url not in seen:
                seen.add(url)
                unique_urls.append(url)
        
        print(f"Total unique URLs from all sitemaps: {len(unique_urls)}")
        return unique_urls
    
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
            Dictionary with categorized URLs including source information
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
            
            # Create URL entry with source information
            url_entry = {
                "url": path or '/',
                "full_url": url,
                "source": self.url_sources.get(url, "unknown")
            }
            
            # Skip empty paths
            if not path or path == '/':
                # categories["homepage"].append(url_entry)
                continue
                
            path_lower = path.lower()
            
            # Categorize based on patterns
            if any(keyword in path_lower for keyword in ['search', 'find', 'query']):
                categories["search"].append(url_entry)
            elif any(keyword in path_lower for keyword in ['/api/', 'api.']):
                categories["api_endpoints"].append(url_entry)
            elif any(keyword in path_lower for keyword in ['report', 'export', 'download', 'analytics']):
                categories["heavy_endpoints"].append(url_entry)
            elif any(keyword in path_lower for keyword in ['contact', 'submit', 'form', 'apply']):
                categories["forms"].append(url_entry)
            elif any(keyword in path_lower for keyword in ['.jpg', '.png', '.gif', '.pdf', '.mp4', 'media/', 'images/']):
                categories["media"].append(url_entry)
            elif any(keyword in path_lower for keyword in ['admin', 'dashboard', 'manage']):
                categories["admin"].append(url_entry)
            else:
                categories["pages"].append(url_entry)

        # Remove empty categories
        filtered_categories = {}
        for category, url_list in categories.items():
            if url_list:
                # Limit to reasonable number of URLs per category for load testing
                # not using the max number
                # max_urls = 50 if category == "pages" else 20
                filtered_categories[category] = url_list
        
        return filtered_categories
    
    def load_urls(self) -> Dict[str, List[str]]:
        """
        Load and categorize URLs from sitemap
        
        Returns:
            Dictionary with categorized URLs
        """
        xml_content = ""
        all_urls = []
        
        # Try to load from directory first (multiple sitemaps)
        if self.sitemap_directory:
            print(f"Loading sitemaps from directory: {self.sitemap_directory}")
            sitemap_files = self.discover_sitemap_files(self.sitemap_directory)
            if sitemap_files:
                all_urls = self.load_multiple_sitemaps(sitemap_files)
        
        # If no directory or no files found, try URL
        if not all_urls and self.sitemap_url:
            print(f"Fetching sitemap from URL: {self.sitemap_url}")
            xml_content = self.fetch_sitemap(self.sitemap_url)
            if xml_content:
                all_urls = self.parse_sitemap(xml_content)
                # Track source for URL-based sitemap
                for url in all_urls:
                    self.url_sources[url] = self.sitemap_url
        
        # If still no URLs, try single file
        if not all_urls and self.sitemap_file:
            print(f"Loading sitemap from file: {self.sitemap_file}")
            xml_content = self.load_sitemap_file(self.sitemap_file)
            if xml_content:
                all_urls = self.parse_sitemap(xml_content)
                # Track source for file-based sitemap
                sitemap_name = os.path.basename(self.sitemap_file)
                for url in all_urls:
                    self.url_sources[url] = sitemap_name
        
        if not all_urls:
            print("No sitemap content available")
            return {}
        
        # Store URLs and print summary
        self.urls = all_urls
        print(f"Total URLs loaded: {len(self.urls)}")
        
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
            if all_urls:
                selected = random.choice(all_urls)
                return selected["url"] if isinstance(selected, dict) else selected
            return "/"
        
        selected = random.choice(url_list)
        return selected["url"] if isinstance(selected, dict) else selected
    
    def get_urls_by_source(self, source_name: str) -> List[Dict]:
        """
        Get all URLs from a specific sitemap source
        
        Args:
            source_name: Name of the sitemap source
            
        Returns:
            List of URL entries from the specified source
        """
        source_urls = []
        for category, url_list in self.categorized_urls.items():
            for url_entry in url_list:
                if isinstance(url_entry, dict) and url_entry.get("source") == source_name:
                    source_urls.append({
                        **url_entry,
                        "category": category
                    })
        return source_urls
    
    def get_sources_summary(self) -> Dict[str, int]:
        """
        Get a summary of URLs per source
        
        Returns:
            Dictionary with source names and URL counts
        """
        sources = {}
        for category, url_list in self.categorized_urls.items():
            for url_entry in url_list:
                if isinstance(url_entry, dict):
                    source = url_entry.get("source", "unknown")
                    sources[source] = sources.get(source, 0) + 1
        return sources


def load_sitemap_urls(sitemap_source: str = None) -> Dict[str, List[str]]:
    """
    Convenience function to load URLs from sitemap
    
    Args:
        sitemap_source: URL, file path, or directory path to sitemap(s)
        
    Returns:
        Dictionary with categorized URLs
    """
    if not sitemap_source:
        # Try to find sitemap directory first
        local_sitemap_dir = os.path.join(os.path.dirname(__file__), 'sitemaps')
        if os.path.exists(local_sitemap_dir) and os.path.isdir(local_sitemap_dir):
            print(f"Using local sitemap directory: {local_sitemap_dir}")
            loader = SitemapLoader(sitemap_directory=local_sitemap_dir)
            return loader.load_urls()
        
        # Fallback to single sitemap.xml file
        local_sitemap = os.path.join(os.path.dirname(__file__), 'sitemap.xml')
        if os.path.exists(local_sitemap):
            sitemap_source = local_sitemap
        else:
            print("No sitemap source provided and no local sitemap.xml or sitemap/ directory found")
            return {}
    
    # Determine if it's a URL, directory, or file path
    if sitemap_source.startswith(('http://', 'https://')):
        loader = SitemapLoader(sitemap_url=sitemap_source)
    elif os.path.isdir(sitemap_source):
        loader = SitemapLoader(sitemap_directory=sitemap_source)
    else:
        loader = SitemapLoader(sitemap_file=sitemap_source)
    
    return loader.load_urls()


# Example usage and testing
if __name__ == "__main__":
    import sys
    
    # Example 1: Load from sitemap directory
    print("=== Loading from sitemap directory ===")
    sitemap_dir = "./sitemap"
    if os.path.exists(sitemap_dir):
        loader = SitemapLoader(sitemap_directory=sitemap_dir)
        urls = loader.load_urls()
        loader.save_urls_to_json("sitemap_urls_from_directory.json")
    else:
        print(f"Directory {sitemap_dir} not found, creating example...")
        os.makedirs(sitemap_dir, exist_ok=True)
        print(f"Created {sitemap_dir} directory. Add your sitemap files here.")
    
    # Example 2: Load using convenience function (auto-detects directory)
    print("\n=== Using convenience function ===")
    urls = load_sitemap_urls()
    
    # Example 3: Load from specific directory
    print("\n=== Loading from specific directory ===")
    if len(sys.argv) > 1:
        custom_dir = sys.argv[1]
        urls = load_sitemap_urls(custom_dir)
        print(f"Loaded URLs from {custom_dir}")
    
    print("\nDone!")
