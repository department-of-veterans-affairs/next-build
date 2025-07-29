from locust import HttpUser, task, between, LoadTestShape
import random
import json
import os

# Try to import sitemap loader
try:
    from sitemap_loader import load_sitemap_urls
    SITEMAP_AVAILABLE = True
    print("Sitemap loader available")
except ImportError:
    SITEMAP_AVAILABLE = False
    print("Sitemap loader not available (missing dependencies)")

# Load URLs from JSON file
def load_urls():
    """Load URLs from the JSON configuration file"""
    try:
        json_path = os.path.join(os.path.dirname(__file__), 'urls.json')
        with open(json_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Warning: urls.json not found. Using default URLs.")
        return get_default_urls()
    except json.JSONDecodeError:
        print("Warning: Invalid JSON in urls.json. Using default URLs.")
        return get_default_urls()

def get_default_urls():
    """Get default URLs if no configuration is available"""
    return {
        "pages": ["/page1.html", "/page2.html", "/page3.html"],
    }

def load_urls_with_sitemap():
    """Load URLs with sitemap support if available"""
    urls = {}
    
    # First try to load from sitemap
    if SITEMAP_AVAILABLE:
        print("Attempting to load URLs from sitemap...")
        
        # Try different sitemap sources in order of preference:
        # 1. Environment variable
        # 2. Local sitemap.xml file
        # 3. Common sitemap URLs if base URL is known
        
        
        sitemap_source = os.environ.get('SITEMAP_URL')
        print(f"Using sitemap source: {sitemap_source}")
        sitemap_urls = load_sitemap_urls(sitemap_source)
        if sitemap_urls:
            urls.update(sitemap_urls)
            print(f"Loaded {sum(len(v) for v in sitemap_urls.values())} URLs from sitemap")
    
    # Fall back to JSON configuration
    if not urls:
        print("Loading URLs from JSON configuration...")
        urls = load_urls()
    
    # Ensure we have at least default URLs
    if not urls:
        print("Using default hardcoded URLs...")
        urls = get_default_urls()
    
    return urls


def filter_by_source(data, target_source):
    print(f"Filtering URLs by source: {target_source}")
    try:
        source_urls =  {
            key: [item for item in items if item.get('source') == target_source]
            for key, items in data.items()
        }
        # Remove empty categories
        filtered_categories = {}
        for category, url_list in source_urls.items():
            if url_list:
                filtered_categories[category] = url_list
    except Exception as e:
        print(f"Error filtering URLs by source '{target_source}': {e}")
        return None

    return filtered_categories

# Load URLs at module level with sitemap support
URLS = load_urls_with_sitemap()
NEXTBUILD_URLS = filter_by_source(URLS, 'sitemap-nb.xml')
CONTENTBUILD_URLS = filter_by_source(URLS, 'sitemap-cb.xml')
REACTROUTES_URLS = filter_by_source(URLS, 'sitemap-reactroutes.xml')
class NextBuildUser(HttpUser):
    """User behavior for Next Build application"""
    wait_time = between(1, 5)
    weight = 1

    def on_start(self):
        """Called when a user starts"""
        pass

    @task(1)
    def request_random_url(self):
        category = random.choice(list(NEXTBUILD_URLS.keys()))
        page = random.choice(NEXTBUILD_URLS[category])
        self.client.get(page['url'])

class ContentBuildUser(HttpUser):
    """User behavior for Content Build application"""
    wait_time = between(1, 5)
    weight = 1

    def on_start(self):
        """Called when a user starts"""
        pass

    @task(1)
    def request_random_url(self):
        category = random.choice(list(CONTENTBUILD_URLS.keys()))
        page = random.choice(CONTENTBUILD_URLS[category])
        self.client.get(page['url'])

class ReactRouterUser(HttpUser):
    """User behavior for React Router application"""
    wait_time = between(1, 5)
    weight = 1

    def on_start(self):
        """Called when a user starts"""
        pass

    @task(1)
    def request_random_url(self):
        category = random.choice(list(REACTROUTES_URLS.keys()))
        page = random.choice(REACTROUTES_URLS[category])
        self.client.get(page['url'])

class CustomLoadTestShape(LoadTestShape):
    """
    Custom load shape that simulates:
    - Normal load: 10-50 users for 5 minutes
    - Peak load: 50-150 users for 5 minutes  
    - Spike load: 150-300 users for 3 minutes
    - Cool down: back to normal load
    """
    
    stages = [
        # Normal load phase (5 minutes)
        {"duration": 30, "users": 10, "spawn_rate": 2, "user_classes": [NextBuildUser]},   # Ramp up to 10 users
        {"duration": 60, "users": 30, "spawn_rate": 2, "user_classes": [NextBuildUser, ContentBuildUser]},  # Steady at 30 users
        {"duration": 90, "users": 50, "spawn_rate": 2, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},  # Increase to 50 users
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                try:
                    tick_data = (stage["users"], stage["spawn_rate"], stage["user_classes"])
                except:
                    tick_data = (stage["users"], stage["spawn_rate"])
                return tick_data
        
        return None  # End the test