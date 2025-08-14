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
# TEST_URLS = filter_by_source(URLS, 'sitemap-test.xml')
NEXTBUILD_URLS = filter_by_source(URLS, 'sitemap-nb.xml')
CONTENTBUILD_URLS = filter_by_source(URLS, 'sitemap-cb.xml')
REACTROUTES_URLS = filter_by_source(URLS, 'sitemap-reactroutes.xml')


class TestUser(HttpUser):
    """User behavior for Test application"""
    wait_time = between(5, 15)
    weight = 1

    def on_start(self):
        """Called when a user starts"""
        pass

    @task(1)
    def request_random_url(self):
        category = random.choice(list(TEST_URLS.keys()))
        page = random.choice(TEST_URLS[category])
        self.client.get(page['url'])

class NextBuildUser(HttpUser):
    """User behavior for Next Build application"""
    wait_time = between(5, 15)
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
    wait_time = between(5, 15)
    weight = 2

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
    wait_time = between(5, 15)
    weight = 5

    def on_start(self):
        """Called when a user starts"""
        pass

    @task(1)
    def request_random_url(self):
        category = random.choice(list(REACTROUTES_URLS.keys()))
        page = random.choice(REACTROUTES_URLS[category])
        self.client.get(page['url'])

class NormalPeakShape(LoadTestShape):
    
    stages = [
        # Progressive load increase
        {"duration": 120, "users": 50, "spawn_rate": 5, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},
        {"duration": 240, "users": 500, "spawn_rate": 5, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},
        {"duration": 360, "users": 1200, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},
        {"duration": 960, "users": 2000, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Normal Max Users (Run for 10 mins)
        {"duration": 1080, "users": 2800, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Start Increasing to Peak
        {"duration": 1200, "users": 3600, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},
        {"duration": 1800, "users": 4400, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Peak (run for 10 mins)
        {"duration": 1920, "users": 3600, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # begin cooldowm
        {"duration": 2040, "users": 2800, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},
        {"duration": 2160, "users": 1500, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},
        {"duration": 2280, "users": 500, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
        
        return None


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
        
        # Peak load phase (5 minutes)
        {"duration": 120, "users": 75, "spawn_rate": 3, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]},  # Ramp to 75 users
        {"duration": 180, "users": 100, "spawn_rate": 3, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Peak at 100 users
        {"duration": 240, "users": 150, "spawn_rate": 5, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # High peak at 150 users
        
        # Spike load phase (3 minutes)
        {"duration": 300, "users": 200, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Spike to 200 users
        {"duration": 330, "users": 300, "spawn_rate": 15, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Maximum spike at 300 users
        {"duration": 360, "users": 250, "spawn_rate": 10, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Spike cooldown
        
        # Cool down phase (2 minutes)
        {"duration": 420, "users": 100, "spawn_rate": 5, "user_classes": [NextBuildUser, ContentBuildUser, ReactRouterUser]}, # Cool down to 100
        {"duration": 480, "users": 30, "spawn_rate": 3, "user_classes": [NextBuildUser, ContentBuildUser]},  # Back to normal
        {"duration": 510, "users": 10, "spawn_rate": 2, "user_classes": [NextBuildUser]},  # Final cooldown
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


class NormalLoadShape(LoadTestShape):
    """
    Baseline test for normal load conditions
    Duration: 10 minutes
    Users: 10-50 steady state
    Purpose: Establish baseline metrics for normal operations
    """
    
    stages = [
        {"duration": 60, "users": 10, "spawn_rate": 2},   # Ramp up (1 min)
        {"duration": 180, "users": 25, "spawn_rate": 1},  # Steady low (3 min)
        {"duration": 360, "users": 35, "spawn_rate": 1},  # Steady medium (6 min)
        {"duration": 540, "users": 50, "spawn_rate": 2},  # Steady high normal (9 min)
        {"duration": 600, "users": 25, "spawn_rate": 2},  # Cool down (10 min)
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
        
        return None


class PeakLoadShape(LoadTestShape):
    """
    Baseline test for peak load conditions
    Duration: 15 minutes
    Users: 50-150 users
    Purpose: Establish baseline metrics for peak traffic periods
    """
    
    stages = [
        # Ramp up phase
        {"duration": 120, "users": 50, "spawn_rate": 3},   # Start at normal peak (2 min)
        {"duration": 240, "users": 75, "spawn_rate": 2},   # Medium peak (4 min)
        {"duration": 420, "users": 100, "spawn_rate": 2},  # High peak (7 min)
        {"duration": 600, "users": 125, "spawn_rate": 3},  # Very high peak (10 min)
        {"duration": 720, "users": 150, "spawn_rate": 3},  # Maximum peak (12 min)
        
        # Cool down phase
        {"duration": 840, "users": 100, "spawn_rate": 5},  # Quick cooldown (14 min)
        {"duration": 900, "users": 50, "spawn_rate": 5},   # Back to normal peak (15 min)
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
        
        return None


class SpikeLoadShape(LoadTestShape):
    """
    Baseline test for spike load conditions
    Duration: 12 minutes
    Users: 150-400 users
    Purpose: Establish baseline metrics for traffic spikes and system limits
    """
    
    stages = [
        # Preparation phase
        {"duration": 60, "users": 50, "spawn_rate": 5},    # Start at normal (1 min)
        {"duration": 120, "users": 100, "spawn_rate": 5},  # Pre-spike (2 min)
        
        # Spike phase
        {"duration": 180, "users": 200, "spawn_rate": 15}, # Initial spike (3 min)
        {"duration": 240, "users": 300, "spawn_rate": 20}, # Major spike (4 min)
        {"duration": 300, "users": 400, "spawn_rate": 25}, # Maximum spike (5 min)
        {"duration": 360, "users": 350, "spawn_rate": 10}, # Sustain high load (6 min)
        {"duration": 420, "users": 300, "spawn_rate": 10}, # Gradual decline (7 min)
        
        # Recovery phase
        {"duration": 540, "users": 200, "spawn_rate": 10}, # Recovery (9 min)
        {"duration": 660, "users": 100, "spawn_rate": 10}, # Cool down (11 min)
        {"duration": 720, "users": 50, "spawn_rate": 5},   # Back to normal (12 min)
    ]
    
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
        
        return None


class StressTestShape(LoadTestShape):
    """
    Baseline stress test to find system breaking point
    Duration: 20 minutes
    Users: Progressive increase to find limits
    Purpose: Establish maximum capacity baseline
    """
    
    stages = [
        # Progressive load increase
        {"duration": 120, "users": 50, "spawn_rate": 5},   # Normal start (2 min)
        {"duration": 240, "users": 100, "spawn_rate": 5},  # (4 min)
        {"duration": 360, "users": 200, "spawn_rate": 10}, # (6 min)
        {"duration": 480, "users": 300, "spawn_rate": 10}, # (8 min)
        {"duration": 600, "users": 400, "spawn_rate": 15}, # (10 min)
        {"duration": 720, "users": 500, "spawn_rate": 15}, # (12 min)
        {"duration": 840, "users": 600, "spawn_rate": 20}, # (14 min)
        {"duration": 960, "users": 750, "spawn_rate": 25}, # (16 min)
        {"duration": 1080, "users": 900, "spawn_rate": 30}, # (18 min)
        {"duration": 1200, "users": 1000, "spawn_rate": 30}, # Maximum test (20 min)
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
        
        return None


class EnduranceTestShape(LoadTestShape):
    """
    Baseline endurance test for sustained load
    Duration: 60 minutes
    Users: Sustained moderate load
    Purpose: Test system stability over extended periods
    """
    
    stages = [
        # Ramp up
        {"duration": 300, "users": 100, "spawn_rate": 2},   # Slow ramp up (5 min)
        {"duration": 600, "users": 150, "spawn_rate": 1},   # Reach target (10 min)
        
        # Sustained load (45 minutes)
        {"duration": 3300, "users": 150, "spawn_rate": 1},  # Sustained load (55 min)
        
        # Cool down
        {"duration": 3600, "users": 50, "spawn_rate": 5},   # Cool down (60 min)
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
        
        return None

class ScriptTestShape(LoadTestShape):
    """
    Baseline stress test to find system breaking point
    Duration: 20 minutes
    Users: Progressive increase to find limits
    Purpose: Establish maximum capacity baseline
    """
    
    stages = [
        # Progressive load increase
        {"duration": 120, "users": 50, "spawn_rate": 5, "user_classes": [TestUser]},   # Normal start (2 min)
        {"duration": 240, "users": 500, "spawn_rate": 5, "user_classes": [TestUser]},  # (4 min)
        {"duration": 360, "users": 1200, "spawn_rate": 10, "user_classes": [TestUser]}, # (6 min)
        {"duration": 480, "users": 2000, "spawn_rate": 10, "user_classes": [TestUser]}, # (8 min)
        {"duration": 600, "users": 2800, "spawn_rate": 15, "user_classes": [TestUser]}, # (10 min)
        {"duration": 720, "users": 3800, "spawn_rate": 15, "user_classes": [TestUser]}, # (12 min)
        {"duration": 840, "users": 5000, "spawn_rate": 20, "user_classes": [TestUser]}, # (14 min)
        {"duration": 960, "users": 6100, "spawn_rate": 25, "user_classes": [TestUser]}, # (16 min)
        {"duration": 1080, "users": 7500, "spawn_rate": 25, "user_classes": [TestUser]}, # (18 min)
        {"duration": 1200, "users": 8800, "spawn_rate": 25, "user_classes": [TestUser]}, # (20 min)
        {"duration": 1320, "users": 10000, "spawn_rate": 25, "user_classes": [TestUser]}, # (22 min)
    ]
    
    def tick(self):
        run_time = self.get_run_time()
        
        for stage in self.stages:
            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])
        
        return None
    
# Profile selection based on environment variable
def get_load_test_shape():
    """
    Select load test shape based on LOAD_PROFILE environment variable
    """
    profile = os.environ.get('LOAD_PROFILE', 'normal').lower()
    
    profiles = {
        'normal': NormalLoadShape,
        'peak': PeakLoadShape,
        'spike': SpikeLoadShape,
        'stress': StressTestShape,
        'endurance': EnduranceTestShape,
        'custom': CustomLoadTestShape,
        'full': CustomLoadTestShape,  # Alias for custom
    }
    
    shape_class = profiles.get(profile, NormalLoadShape)
    print(f"Using load profile: {profile} ({shape_class.__name__})")
    return shape_class


# Set the active load test shape
# LoadTestShape = get_load_test_shape()


"""
USAGE INSTRUCTIONS:

To run different baseline load test profiles, set the LOAD_PROFILE environment variable:

1. Normal Load Baseline (10 minutes):
   LOAD_PROFILE=normal locust -f locustfile.py --host=https://your-app.com

2. Peak Load Baseline (15 minutes):
   LOAD_PROFILE=peak locust -f locustfile.py --host=https://your-app.com

3. Spike Load Baseline (12 minutes):
   LOAD_PROFILE=spike locust -f locustfile.py --host=https://your-app.com

4. Stress Test Baseline (20 minutes):
   LOAD_PROFILE=stress locust -f locustfile.py --host=https://your-app.com

5. Endurance Test Baseline (60 minutes):
   LOAD_PROFILE=endurance locust -f locustfile.py --host=https://your-app.com

6. Custom Full Test (8.5 minutes):
   LOAD_PROFILE=custom locust -f locustfile.py --host=https://your-app.com

BASELINE METRICS TO COLLECT:

Normal Load Baseline:
- Response times (95th percentile)
- Throughput (requests per second)
- Error rates
- Resource utilization (CPU, Memory, Network)

Peak Load Baseline:
- Performance degradation under peak load
- Queue lengths and wait times
- Database connection pool usage
- Cache hit rates

Spike Load Baseline:
- System recovery time after spikes
- Auto-scaling behavior
- Circuit breaker activations
- Rate limiting effectiveness

Stress Test Baseline:
- Breaking point identification
- Graceful degradation behavior
- Error handling under extreme load
- System recovery capabilities

Endurance Test Baseline:
- Memory leaks detection
- Performance consistency over time
- Connection pool exhaustion
- Cache efficiency over time

RECOMMENDED MONITORING:
- Application Performance Monitoring (APM)
- Infrastructure metrics (CPU, Memory, Disk, Network)
- Database performance metrics
- Load balancer metrics
- Cache performance metrics
- Error logs and patterns

EXAMPLE COMMANDS:

# Run normal baseline with specific parameters
LOAD_PROFILE=normal locust -f locustfile.py --host=https://staging.va.gov --users=50 --spawn-rate=2 --run-time=600s --html=normal_baseline_report.html

# Run peak baseline headless
LOAD_PROFILE=peak locust -f locustfile.py --host=https://staging.va.gov --headless --users=150 --spawn-rate=5 --run-time=900s --csv=peak_baseline

# Run spike test with custom spawn rate
LOAD_PROFILE=spike locust -f locustfile.py --host=https://staging.va.gov --headless --users=400 --spawn-rate=25 --run-time=720s --html=spike_baseline_report.html

# Run stress test to find limits
LOAD_PROFILE=stress locust -f locustfile.py --host=https://staging.va.gov --headless --users=1000 --spawn-rate=30 --run-time=1200s --csv=stress_baseline
"""