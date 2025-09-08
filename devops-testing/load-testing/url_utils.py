"""
URL loading utilities for Locust load testing
"""
import json
import os
import random
from typing import Dict, List, Any, Optional

class URLLoader:
    """Utility class for loading and managing URLs from JSON configuration"""
    
    def __init__(self, config_file: str = 'urls.json'):
        """
        Initialize URLLoader with configuration file
        
        Args:
            config_file: Path to JSON configuration file
        """
        self.config_file = config_file
        self.urls = self._load_urls()
        self.advanced_config = self._load_advanced_config()
    
    def _load_urls(self) -> Dict[str, List[str]]:
        """Load simple URL configuration"""
        try:
            json_path = os.path.join(os.path.dirname(__file__), self.config_file)
            with open(json_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Warning: Could not load {self.config_file}: {e}. Using defaults.")
            return self._get_default_urls()
    
    def _load_advanced_config(self) -> Optional[Dict]:
        """Load advanced URL configuration if available"""
        try:
            advanced_path = os.path.join(os.path.dirname(__file__), 'advanced_urls.json')
            with open(advanced_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None
    
    def _get_default_urls(self) -> Dict[str, List[str]]:
        """Return default URLs if configuration file is not available"""
        return {
            "homepage": ["/"],
            "pages": ["/page1.html", "/page2.html", "/page3.html"],
            "search": ["/search?q=test"],
            "api_endpoints": ["/api/health"],
            "heavy_endpoints": ["/reports/monthly"],
            "forms": ["/contact/submit"]
        }
    
    def get_random_url(self, category: str) -> str:
        """
        Get a random URL from a category
        
        Args:
            category: URL category (e.g., 'homepage', 'pages', 'search')
            
        Returns:
            Random URL string from the category
        """
        urls = self.urls.get(category, ["/"])
        return random.choice(urls)
    
    def get_weighted_url(self, category: str) -> Dict[str, Any]:
        """
        Get a weighted URL configuration from advanced config
        
        Args:
            category: URL category
            
        Returns:
            URL configuration dictionary with method, params, etc.
        """
        if not self.advanced_config:
            return {"url": self.get_random_url(category), "method": "GET"}
        
        url_group = self.advanced_config.get("url_groups", {}).get(category, {})
        urls = url_group.get("urls", [])
        
        if not urls:
            return {"url": self.get_random_url(category), "method": "GET"}
        
        # Weight-based selection
        weights = [url_config.get("weight", 1) for url_config in urls]
        selected_config = random.choices(urls, weights=weights)[0]
        
        return selected_config
    
    def get_scenario_categories(self, scenario: str) -> List[str]:
        """
        Get URL categories for a specific load scenario
        
        Args:
            scenario: Load scenario name ('normal', 'peak', 'spike')
            
        Returns:
            List of URL categories for the scenario
        """
        if not self.advanced_config:
            return list(self.urls.keys())
        
        scenarios = self.advanced_config.get("load_scenarios", {})
        return scenarios.get(scenario, list(self.urls.keys()))
    
    def make_request(self, client, category: str, use_advanced: bool = True):
        """
        Make an HTTP request using URL configuration
        
        Args:
            client: Locust HTTP client
            category: URL category
            use_advanced: Whether to use advanced configuration
        """
        if use_advanced and self.advanced_config:
            config = self.get_weighted_url(category)
            url = config.get("url", "/")
            method = config.get("method", "GET").upper()
            params = config.get("params", {})
            data = config.get("data", {})
            expected_status = config.get("expected_status", [200])
            
            # Ensure expected_status is a list
            if not isinstance(expected_status, list):
                expected_status = [expected_status]
            
            # Make the request based on method
            if method == "GET":
                response = client.get(url, params=params)
            elif method == "POST":
                response = client.post(url, json=data, params=params)
            elif method == "PUT":
                response = client.put(url, json=data, params=params)
            elif method == "DELETE":
                response = client.delete(url, params=params)
            else:
                response = client.get(url, params=params)
            
            # Check if response status is expected
            if response.status_code not in expected_status:
                response.failure(f"Unexpected status: {response.status_code}")
                
        else:
            # Simple request using basic URL
            url = self.get_random_url(category)
            client.get(url)

# Global URL loader instance
url_loader = URLLoader()
