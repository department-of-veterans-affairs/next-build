#!/usr/bin/env python3
"""
Test script for sitemap URL loading functionality
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from sitemap_loader import SitemapLoader, load_sitemap_urls
    print("✅ Sitemap loader imported successfully")
except ImportError as e:
    print(f"❌ Failed to import sitemap loader: {e}")
    print("Installing required dependencies...")
    os.system("pip install requests")
    try:
        from sitemap_loader import SitemapLoader, load_sitemap_urls
        print("✅ Sitemap loader imported after installing dependencies")
    except ImportError as e:
        print(f"❌ Still failed to import: {e}")
        sys.exit(1)

def test_local_sitemap():
    """Test loading from local sitemap.xml file"""
    print("\n=== Testing Local Sitemap Loading ===")
    
    sitemap_file = os.path.join(os.path.dirname(__file__), 'sitemap.xml')
    if not os.path.exists(sitemap_file):
        print(f"❌ Sitemap file not found: {sitemap_file}")
        return False
    
    try:
        loader = SitemapLoader(sitemap_file=sitemap_file)
        urls = loader.load_urls()
        
        if urls:
            print(f"✅ Successfully loaded {sum(len(v) for v in urls.values())} URLs")
            for category, url_list in urls.items():
                print(f"   {category}: {len(url_list)} URLs")
                for url in url_list[:3]:  # Show first 3 URLs
                    print(f"     - {url}")
                if len(url_list) > 3:
                    print(f"     ... and {len(url_list) - 3} more")
            
            # Save to JSON for inspection
            loader.save_urls_to_json("test_sitemap_urls.json")
            return True
        else:
            print("❌ No URLs loaded from sitemap")
            return False
            
    except Exception as e:
        print(f"❌ Error loading sitemap: {e}")
        return False

def test_url_sitemap():
    """Test loading from URL (using a public sitemap)"""
    print("\n=== Testing URL Sitemap Loading ===")
    
    # Test with a well-known public sitemap
    test_url = "https://www.sitemaps.org/sitemap.xml"
    print(f"Testing with: {test_url}")
    
    try:
        loader = SitemapLoader(sitemap_url=test_url)
        urls = loader.load_urls()
        
        if urls:
            print(f"✅ Successfully loaded {sum(len(v) for v in urls.values())} URLs from URL")
            for category, url_list in urls.items():
                print(f"   {category}: {len(url_list)} URLs")
            return True
        else:
            print("❌ No URLs loaded from URL sitemap")
            return False
            
    except Exception as e:
        print(f"❌ Error loading sitemap from URL: {e}")
        return False

def test_convenience_function():
    """Test the convenience function"""
    print("\n=== Testing Convenience Function ===")
    
    try:
        # Test with local file
        sitemap_file = os.path.join(os.path.dirname(__file__), 'sitemap.xml')
        urls = load_sitemap_urls(sitemap_file)
        
        if urls:
            print(f"✅ Convenience function loaded {sum(len(v) for v in urls.values())} URLs")
            return True
        else:
            print("❌ Convenience function returned no URLs")
            return False
            
    except Exception as e:
        print(f"❌ Error with convenience function: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Sitemap URL Loading Functionality")
    print("=" * 50)
    
    tests = [
        test_local_sitemap,
        test_convenience_function,
        # test_url_sitemap,  # Commented out to avoid network dependency
    ]
    
    passed = 0
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
    
    print(f"\n📊 Test Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All tests passed! Sitemap loading is working correctly.")
        
        # Show integration example
        print("\n📝 Integration Example:")
        print("To use sitemap URLs in your load test:")
        print("1. Set environment variable: export SITEMAP_URL='http://yoursite.com/sitemap.xml'")
        print("2. Or place sitemap.xml in the same directory as locustfile.py")
        print("3. Run locust normally: locust -f locustfile.py --host=http://localhost:8080")
        
    else:
        print("❌ Some tests failed. Check the error messages above.")
        return 1
        
    return 0

if __name__ == "__main__":
    sys.exit(main())
