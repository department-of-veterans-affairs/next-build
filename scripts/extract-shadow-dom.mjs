#!/usr/bin/env node
/**
 * Script to extract shadow DOM CSS and HTML from va- custom elements
 * Usage: node scripts/extract-shadow-dom.mjs [url]
 */

import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../');

const url = process.argv[2] || 'http://localhost:3999/education/benefit-rates/post-9-11-gi-bill-rates/past-rates-2021-2022/';

async function extractShadowDOM() {
  console.log(`Extracting shadow DOM from: ${url}\n`);
  
  // Try to find the chromium executable
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true,
      channel: 'chrome' // Try system Chrome first
    });
  } catch (e) {
    // Fallback to chromium
    browser = await chromium.launch({ 
      headless: false // Use headed mode as fallback
    });
  }
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for custom elements to load
    await page.waitForTimeout(2000);
    
    const results = await page.evaluate(() => {
      function extractCssRules(element) {
        const shadowRoot = element.shadowRoot;
        let allRules = "";

        if (shadowRoot && shadowRoot.adoptedStyleSheets) {
          shadowRoot.adoptedStyleSheets.forEach(sheet => {
            try {
              Array.from(sheet.cssRules).forEach(rule => {
                allRules += rule.cssText + "\n";
              });
            } catch (e) {
              console.warn("Could not access CSS rules for a stylesheet:", e);
            }
          });
        }
        return allRules;
      }

      function extractShadowHTML(element) {
        const shadowRoot = element.shadowRoot;
        if (!shadowRoot) {
          return null;
        }
        return shadowRoot.innerHTML;
      }

      // Find all va- custom elements (excluding header/footer)
      const allElements = document.querySelectorAll('*');
      const vaElements = [];
      
      allElements.forEach(el => {
        if (el.tagName && el.tagName.toLowerCase().startsWith('va-')) {
          // Skip header/footer elements
          const isInHeader = el.closest('header, [role="banner"]');
          const isInFooter = el.closest('footer, [role="contentinfo"]');
          
          if (!isInHeader && !isInFooter) {
            vaElements.push({
              tagName: el.tagName.toLowerCase(),
              element: el,
              id: el.id || null,
              classes: el.className || null
            });
          }
        }
      });
      
      const results = {};
      
      vaElements.forEach(({ tagName, element }) => {
        if (!results[tagName]) {
          results[tagName] = {
            css: '',
            html: [],
            attributes: []
          };
        }
        
        const css = extractCssRules(element);
        const html = extractShadowHTML(element);
        const attributes = Array.from(element.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {});
        
        if (css) {
          results[tagName].css = css;
        }
        if (html) {
          results[tagName].html.push(html);
        }
        results[tagName].attributes.push(attributes);
      });
      
      return results;
    });
    
    console.log('Found elements:', Object.keys(results));
    console.log('\n');
    
    // Write CSS files and prepare HTML data
    const htmlData = {};
    
    for (const [tagName, data] of Object.entries(results)) {
      const cssFileName = tagName + '.css';
      const cssPath = join(projectRoot, 'src/assets/styles', cssFileName);
      
      if (data.css) {
        writeFileSync(cssPath, data.css.trim() + '\n', 'utf8');
        console.log(`✓ Wrote CSS to ${cssFileName}`);
      } else {
        console.log(`⚠ No CSS found for ${tagName}`);
      }
      
      // Store HTML for later use
      if (data.html.length > 0) {
        htmlData[tagName] = data.html[0];
        console.log(`✓ Found HTML for ${tagName}`);
      }
    }
    
    // Write HTML data to a JSON file for reference
    const htmlDataPath = join(projectRoot, 'extracted-shadow-dom-html.json');
    writeFileSync(htmlDataPath, JSON.stringify(htmlData, null, 2), 'utf8');
    console.log(`\n✓ Wrote HTML data to extracted-shadow-dom-html.json`);
    
    console.log('\nExtraction complete!');
    
  } catch (error) {
    console.error('Error extracting shadow DOM:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

extractShadowDOM();
