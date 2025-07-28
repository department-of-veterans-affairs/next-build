from locust import HttpUser, task, between, LoadTestShape
import random
import json
import os

# Try to import advanced URL utilities
try:
    from url_utils import url_loader
    USE_ADVANCED_URLS = True
    print("Using advanced URL configuration")
except ImportError:
    USE_ADVANCED_URLS = False
    print("Using simple URL configuration")

# Load URLs from JSON file (fallback method)
def load_urls():
    """Load URLs from the JSON configuration file"""
    try:
        json_path = os.path.join(os.path.dirname(__file__), 'urls.json')
        with open(json_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Warning: urls.json not found. Using default URLs.")
        return {
            "homepage": ["/"],
            "pages": ["/page1.html", "/page2.html", "/page3.html"],
            "search": ["/search?q=test"],
            "api_endpoints": ["/api/health"],
            "heavy_endpoints": ["/reports/monthly"],
        }
    except json.JSONDecodeError:
        print("Warning: Invalid JSON in urls.json. Using default URLs.")
        return {
            "homepage": ["/"],
            "pages": ["/page1.html", "/page2.html", "/page3.html"],
            "search": ["/search?q=test"],
            "api_endpoints": ["/api/health"],
        }

# Load URLs at module level (fallback)
if not USE_ADVANCED_URLS:
    URLS = load_urls()


class WebsiteUser(HttpUser):
    """Base user class with common behaviors"""
    wait_time = between(1, 5)
    
    def on_start(self):
        """Called when a user starts"""
        pass
    
    def _make_request(self, category: str):
        """Helper method to make requests using available URL system"""
        if USE_ADVANCED_URLS:
            url_loader.make_request(self.client, category)
        else:
            url = random.choice(URLS.get(category, ["/"]))
            self.client.get(url)
    
    @task(4)
    def view_homepage(self):
        """Most common task - viewing homepage"""
        self._make_request("homepage")
    
    @task(3)
    def view_pages(self):
        """Browse various pages"""
        self._make_request("pages")
    
    @task(2)
    def search(self):
        """Search functionality"""
        self._make_request("search")
    
    @task(1)
    def view_details(self):
        """View detailed pages"""
        self._make_request("pages")  # Reuse pages for details


class NormalLoadUser(WebsiteUser):
    """User behavior during normal load conditions"""
    wait_time = between(2, 8)
    weight = 1


class PeakLoadUser(WebsiteUser):
    """User behavior during peak load conditions"""
    wait_time = between(1, 3)
    weight = 2
    
    @task(2)
    def rapid_browsing(self):
        """More aggressive browsing during peak times"""
        for _ in range(3):
            self._make_request("pages")
    
    @task(1)
    def api_calls(self):
        """API calls during peak load"""
        self._make_request("api_endpoints")


class SpikeLoadUser(WebsiteUser):
    """User behavior during spike load conditions"""
    wait_time = between(0.5, 2)
    weight = 3
    
    @task(3)
    def intensive_requests(self):
        """Intensive requests during spike"""
        # Make multiple API requests
        for _ in range(3):
            self._make_request("api_endpoints")
    
    @task(2)
    def heavy_data_requests(self):
        """Heavy data requests during spike load"""
        if USE_ADVANCED_URLS:
            url_loader.make_request(self.client, "heavy_endpoints")
        else:
            url = random.choice(URLS.get("heavy_endpoints", ["/reports/monthly"]))
            with self.client.get(url, catch_response=True) as response:
                if response.elapsed.total_seconds() > 10:
                    response.failure("Response too slow")

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
        {"duration": 60, "users": 10, "spawn_rate": 2},   # Ramp up to 10 users
        {"duration": 180, "users": 30, "spawn_rate": 2},  # Steady at 30 users
        {"duration": 300, "users": 50, "spawn_rate": 2},  # Increase to 50 users
        
        # Peak load phase (5 minutes)
        {"duration": 360, "users": 100, "spawn_rate": 5}, # Ramp to 100 users
        {"duration": 480, "users": 150, "spawn_rate": 3}, # Peak at 150 users
        {"duration": 600, "users": 150, "spawn_rate": 1}, # Hold peak
        
        # Spike load phase (3 minutes)
        {"duration": 630, "users": 250, "spawn_rate": 10}, # Spike to 250 users
        {"duration": 660, "users": 300, "spawn_rate": 5},  # Max spike at 300
        {"duration": 780, "users": 300, "spawn_rate": 1},  # Hold spike
        
        # Cool down phase (3 minutes)
        {"duration": 840, "users": 100, "spawn_rate": 5},  # Cool down to 100
        {"duration": 900, "users": 50, "spawn_rate": 3},   # Back to 50
        {"duration": 960, "users": 20, "spawn_rate": 2},   # Final cool down
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                tick_data = (stage["users"], stage["spawn_rate"])
                return tick_data
        
        return None  # End the test
