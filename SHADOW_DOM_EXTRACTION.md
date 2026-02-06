# Shadow DOM Extraction Guide

This guide explains how to extract CSS and HTML from va- custom elements for server-side rendering.

## Quick Start

1. **Open the page in your browser:**
   ```
   http://localhost:3999/education/benefit-rates/post-9-11-gi-bill-rates/past-rates-2021-2022/
   ```

2. **Open DevTools Console (F12 or Cmd+Option+I)**

3. **Copy and paste the entire contents of `extract-for-templates.js` into the console**

4. **Copy the output CSS** into the corresponding files:
   - `src/assets/styles/va-on-this-page.css`
   - `src/assets/styles/va-back-to-top.css`
   - `src/assets/styles/va-additional-info.css` (if found)
   - `src/assets/styles/va-accordion.css` (if found)

5. **Copy the HTML structures** into the template files, replacing the placeholder comments.

## Manual Extraction (Alternative)

If the script doesn't work, you can extract manually:

### For each va- element:

1. **Select the element in DevTools** (click on it in Elements panel)

2. **Extract CSS:**
   ```javascript
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
           console.warn("Could not access CSS rules:", e);
         }
       });
     }
     return allRules;
   }
   extractCssRules($0);
   ```

3. **Extract HTML:**
   - Inspect the shadow DOM in DevTools
   - Copy the innerHTML from `$0.shadowRoot.innerHTML`

## Files to Update

After extraction, update these files with the extracted HTML:

- `src/components/benefitsDetailPage/template.tsx` - va-on-this-page and va-back-to-top
- `src/components/alertBlock/template.tsx` - va-additional-info (if used)
- `src/components/expandableText/template.tsx` - va-additional-info (if used)
- `src/components/accordion/template.tsx` - va-accordion (if used)

## Pattern to Follow

The pattern established in `breadcrumbs/template.tsx` and `contentFooter/template.tsx`:

1. Hide the web component: `<div style={{ display: 'none' }}><va-component></va-component></div>`
2. Add static HTML next to it with the extracted shadow DOM content
3. Import the CSS file in `globals.css`

## Notes

- Only extract elements that are actually on the page
- Skip header/footer elements (outside our control)
- Keep web component declarations hidden (not removed) so scripts still load
