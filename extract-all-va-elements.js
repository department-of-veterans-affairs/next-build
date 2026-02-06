// Complete extraction script for browser console
// Run this on: http://localhost:3999/education/benefit-rates/post-9-11-gi-bill-rates/past-rates-2021-2022/

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
function findAllVaElements() {
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
  
  return vaElements;
}

// Main extraction function
function extractAllVaElements() {
  const elements = findAllVaElements();
  const results = {};
  
  console.log(`Found ${elements.length} va- elements to extract`);
  
  elements.forEach(({ tagName, element, id, classes }) => {
    if (!results[tagName]) {
      results[tagName] = [];
    }
    
    const css = extractCssRules(element);
    const html = extractShadowHTML(element);
    
    results[tagName].push({
      id,
      classes,
      css,
      html,
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {})
    });
  });
  
  // Output formatted results
  console.log('\n=== EXTRACTION RESULTS ===\n');
  
  Object.keys(results).forEach(tagName => {
    console.log(`\n## ${tagName}`);
    results[tagName].forEach((result, index) => {
      console.log(`\n### Instance ${index + 1}`);
      console.log('CSS:', result.css || '(no CSS found)');
      console.log('HTML:', result.html || '(no HTML found)');
      console.log('Attributes:', result.attributes);
    });
  });
  
  // Also output as copyable format
  console.log('\n\n=== COPYABLE CSS (paste into va-{name}.css) ===\n');
  Object.keys(results).forEach(tagName => {
    const css = results[tagName].map(r => r.css).filter(Boolean).join('\n');
    if (css) {
      console.log(`\n/* ${tagName} */\n${css}`);
    }
  });
  
  return results;
}

// Run extraction
extractAllVaElements();
