// Test module for getLastHeadingLevelFromHtml

import { getLastHeadingLevelFromHtml } from './getLastHeadingLevelFromHtml'

describe('getLastHeadingLevelFromHtml', () => {
  describe('basic functionality', () => {
    test('returns the last heading level found', () => {
      const html = '<h2>Hello</h2><h3>World</h3>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })

    test('returns the heading level when only one heading exists', () => {
      const html = '<h1>Single Heading</h1>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h1')
    })

    test('returns the last heading level when multiple headings exist', () => {
      const html = '<h1>First</h1><h2>Second</h2><h4>Third</h4><h2>Fourth</h2>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })
  })

  describe('different heading levels', () => {
    test('handles h1 headings', () => {
      const html = '<h1>Main Title</h1>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h1')
    })

    test('handles h2 headings', () => {
      const html = '<h2>Section Title</h2>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('handles h3 headings', () => {
      const html = '<h3>Subsection Title</h3>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })

    test('handles h4 headings', () => {
      const html = '<h4>Minor Heading</h4>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h4')
    })

    test('handles h5 headings', () => {
      const html = '<h5>Small Heading</h5>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h5')
    })

    test('handles h6 headings', () => {
      const html = '<h6>Smallest Heading</h6>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h6')
    })

    test('handles all heading levels in sequence', () => {
      const html =
        '<h1>1</h1><h2>2</h2><h3>3</h3><h4>4</h4><h5>5</h5><h6>6</h6>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h6')
    })
  })

  describe('headings with attributes', () => {
    test('handles headings with class attributes', () => {
      const html = '<h2 class="custom-class">Heading with class</h2>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('handles headings with id attributes', () => {
      const html = '<h3 id="my-heading">Heading with id</h3>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })

    test('handles headings with multiple attributes', () => {
      const html =
        '<h4 class="test" id="heading" data-value="123">Complex heading</h4>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h4')
    })

    test('handles headings with self-closing attributes', () => {
      const html = '<h5 class="test" disabled>Self-closing heading</h5>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h5')
    })

    test('handles simple headings without attributes', () => {
      const html = '<h2>Simple heading</h2>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('handles mixed simple and complex headings', () => {
      const html =
        '<h1>Simple</h1><h2 class="complex">Complex</h2><h3>Another simple</h3>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })

    test('returns last heading when it has attributes', () => {
      const html =
        '<h1>Simple</h1><h2>Another simple</h2><h3 class="last" id="final">Last with attrs</h3>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })
  })

  describe('complex HTML structures', () => {
    test('handles headings within nested divs', () => {
      const html = '<div><div><h2>Nested heading</h2></div></div>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('handles headings within other elements', () => {
      const html =
        '<section><article><h3>Article heading</h3></article></section>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })

    test('handles multiple headings in complex structure', () => {
      const html = `
        <div>
          <h1>Main title</h1>
          <section>
            <h2>Section title</h2>
            <div>
              <h3>Subsection</h3>
              <p>Some text</p>
              <h4>Final heading</h4>
            </div>
          </section>
        </div>
      `
      expect(getLastHeadingLevelFromHtml(html)).toBe('h4')
    })

    test('handles headings with content and closing tags', () => {
      const html = '<h2>This is a heading with content</h2>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })
  })

  describe('whitespace and formatting', () => {
    test('handles HTML with extra whitespace', () => {
      const html = '  <h3>  Spaced heading  </h3>  '
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })

    test('handles HTML with newlines and tabs', () => {
      const html = '\n\t<h4>\n\t\tFormatted heading\n\t</h4>\n'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h4')
    })

    test('handles HTML with multiple spaces between tags', () => {
      const html = '<h5>   Heading   </h5>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h5')
    })
  })

  describe('edge cases', () => {
    test('returns undeinfed for empty string', () => {
      expect(getLastHeadingLevelFromHtml('')).toBeUndefined()
    })

    test('returns undeinfed for HTML without headings', () => {
      const html = '<p>This is a paragraph</p><div>Some content</div>'
      expect(getLastHeadingLevelFromHtml(html)).toBeUndefined()
    })

    test('returns undeinfed for whitespace-only string', () => {
      expect(getLastHeadingLevelFromHtml('   \n\t  ')).toBeUndefined()
    })

    test('handles malformed HTML with unclosed tags', () => {
      const html = '<h2>Unclosed heading'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('handles HTML with text before headings', () => {
      const html = 'Some text before <h1>Heading</h1>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h1')
    })

    test('handles HTML with text after headings', () => {
      const html = '<h2>Heading</h2>Some text after'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })
  })

  describe('invalid patterns', () => {
    test('ignores invalid heading patterns', () => {
      const html =
        '<h7>Invalid heading</h7><h0>Another invalid</h0><h2>Valid heading</h2>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('ignores headings with invalid syntax', () => {
      const html = '<h>Invalid</h><h2>Valid</h2>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('handles mixed valid and invalid headings', () => {
      const html = '<h1>Valid</h1><h9>Invalid</h9><h3>Also valid</h3>'
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })
  })

  describe('real-world examples', () => {
    test('handles typical article structure', () => {
      const html = `
        <article>
          <h1>Article Title</h1>
          <p>Introduction paragraph</p>
          <h2>First Section</h2>
          <p>Section content</p>
          <h3>Subsection</h3>
          <p>Subsection content</p>
          <h2>Second Section</h2>
          <p>More content</p>
        </article>
      `
      expect(getLastHeadingLevelFromHtml(html)).toBe('h2')
    })

    test('handles FAQ structure', () => {
      const html = `
        <div class="faq">
          <h2>Frequently Asked Questions</h2>
          <h3>What is this?</h3>
          <p>Answer 1</p>
          <h3>How does it work?</h3>
          <p>Answer 2</p>
          <h3>Where can I get help?</h3>
          <p>Answer 3</p>
        </div>
      `
      expect(getLastHeadingLevelFromHtml(html)).toBe('h3')
    })

    test('handles complex nested structure', () => {
      const html = `
        <div class="content">
          <header>
            <h1>Page Title</h1>
          </header>
          <main>
            <section class="intro">
              <h2>Introduction</h2>
              <p>Some intro text</p>
            </section>
            <section class="details">
              <h2>Details</h2>
              <div class="subsection">
                <h3>Technical Details</h3>
                <h4>Implementation</h4>
                <h5>Code Examples</h5>
                <h6>Final Note</h6>
              </div>
            </section>
          </main>
        </div>
      `
      expect(getLastHeadingLevelFromHtml(html)).toBe('h6')
    })
  })
})
