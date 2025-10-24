import { render, screen } from '@testing-library/react'
import { ParagraphList } from './ParagraphList'
import { FormattedParagraph } from '@/lib/drupal/queries'
import { nestedQaParagraphs } from './mock.formatted'

describe('ParagraphList Component', () => {
  describe('Basic functionality', () => {
    it('renders paragraphs without heading levels when no previous headings exist', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--button',
          id: '1',
          label: 'First Button',
          url: '/button1',
        },
        {
          type: 'paragraph--button',
          id: '2',
          label: 'Second Button',
          url: '/button2',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that both buttons are rendered
      expect(screen.getByText('First Button')).toBeInTheDocument()
      expect(screen.getByText('Second Button')).toBeInTheDocument()
    })

    it('renders empty array when no paragraphs provided', () => {
      const { container } = render(<ParagraphList paragraphs={[]} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Heading level progression', () => {
    it('manages heading levels correctly through WYSIWYG paragraphs', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2>First Section</h2><p>Some content</p>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>This should use h3 heading level</p>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '3',
          html: '<h3>Subsection</h3><p>More content</p>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '4',
          html: '<p>This should use h4 heading level</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that the headings are rendered correctly
      expect(screen.getByText('First Section')).toBeInTheDocument()
      expect(screen.getByText('Subsection')).toBeInTheDocument()
      expect(
        screen.getByText('This should use h3 heading level')
      ).toBeInTheDocument()
      expect(
        screen.getByText('This should use h4 heading level')
      ).toBeInTheDocument()
    })

    it('passes correct heading level to CollapsiblePanel after WYSIWYG with headings', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2>Section Title</h2><p>Some content</p>',
        },
        {
          type: 'paragraph--collapsible_panel',
          id: '2',
          entityId: 1,
          paragraphs: [
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'item-1',
              entityId: 10,
              title: 'FAQ Item 1',
              wysiwyg: '<p>Answer 1</p>',
            },
          ],
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that the WYSIWYG content is rendered
      expect(screen.getByText('Section Title')).toBeInTheDocument()
      expect(screen.getByText('Some content')).toBeInTheDocument()

      // Check that the CollapsiblePanel is rendered with the correct heading level
      // The CollapsiblePanel should use h3 (next level after h2)
      const faqHeading = screen.getByText('FAQ Item 1')
      expect(faqHeading.tagName).toBe('H3')
    })

    it('passes correct heading level to CollapsiblePanel after WYSIWYG with multiple headings', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2>Main Section</h2><h3>Subsection</h3>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>No heading here</p>',
        },
        {
          type: 'paragraph--collapsible_panel',
          id: '2',
          entityId: 1,
          paragraphs: [
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'item-1',
              entityId: 10,
              title: 'FAQ Item 1',
              wysiwyg: '<p>Answer 1</p>',
            },
          ],
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that the CollapsiblePanel is rendered with the correct heading level
      // The CollapsiblePanel should use h4 (next level after h3)
      const faqHeading = screen.getByText('FAQ Item 1')
      expect(faqHeading.tagName).toBe('H4')
    })

    it('handles CollapsiblePanel without previous headings', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--collapsible_panel',
          id: '1',
          entityId: 1,
          paragraphs: [
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'item-1',
              entityId: 10,
              title: 'FAQ Item 1',
              wysiwyg: '<p>Answer 1</p>',
            },
          ],
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that the CollapsiblePanel is rendered with default heading level (h4)
      const faqHeading = screen.getByText('FAQ Item 1')
      expect(faqHeading.tagName).toBe('H2')
    })

    it('handles multiple CollapsiblePanels at different heading levels', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2>Frequently Asked Questions</h2>',
        },
        {
          type: 'paragraph--collapsible_panel',
          id: '2',
          entityId: 1,
          paragraphs: [
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'faq-item-1',
              entityId: 10,
              title: 'FAQ Item 1',
              wysiwyg: '<p>This service helps with...</p>',
            },
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'faq-item-2',
              entityId: 20,
              title: 'FAQ Item 2',
              wysiwyg: '<p>To get started...</p>',
            },
          ],
        },
        {
          type: 'paragraph--wysiwyg',
          id: '3',
          html: '<h3>Additional Information</h3>',
        },
        {
          type: 'paragraph--collapsible_panel',
          id: '4',
          entityId: 2,
          paragraphs: [
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'info-item-1',
              entityId: 30,
              title: 'Info Item 1',
              wysiwyg: '<p>Info content 1</p>',
            },
          ],
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that all content is rendered
      expect(
        screen.getByText('Frequently Asked Questions', { selector: 'h2' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('FAQ Item 1', { selector: 'h3' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('FAQ Item 2', { selector: 'h3' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('Additional Information', { selector: 'h3' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('Info Item 1', { selector: 'h4' })
      ).toBeInTheDocument()
    })

    it('handles complex nested QA structure', () => {
      render(<ParagraphList paragraphs={nestedQaParagraphs} />)

      expect(
        screen.getByText('What is mpox?', { selector: 'h2' })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /Mpox is a rare disease caused by infection with the mpox virus/
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText('What are signs and symptoms of mpox?', {
          selector: 'h2',
        })
      ).toBeInTheDocument()
      expect(screen.getByText('Sign and symptoms')).toBeInTheDocument()

      expect(
        screen.getByText('Symptoms of mpox', { selector: 'h3' })
      ).toBeInTheDocument()
      expect(screen.getByText('Fever')).toBeInTheDocument()

      expect(
        screen.getByText('How does it spread?', { selector: 'h2' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('Mpox spreads in a few ways.')
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          'Through close, personal, often skin-to-skin contact',
          { selector: 'h3' }
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText('Direct contact', { selector: 'h3' })
      ).toBeInTheDocument()
      expect(
        screen.getByText('Pregnancy', { selector: 'h3' })
      ).toBeInTheDocument()

      expect(
        screen.getByText('How can I protect myself and others?', {
          selector: 'h2',
        })
      ).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles paragraphs with malformed HTML', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2>Valid heading</h2><h>Invalid heading</h>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>This should use h3 heading level</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that content is rendered
      expect(screen.getByText('Valid heading')).toBeInTheDocument()
      expect(
        screen.getByText('This should use h3 heading level')
      ).toBeInTheDocument()
    })

    it('handles paragraphs with headings containing attributes', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2 class="custom-class">Heading with class</h2>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>This should not have a heading level</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that content is rendered
      expect(screen.getByText('Heading with class')).toBeInTheDocument()
      expect(
        screen.getByText('This should not have a heading level')
      ).toBeInTheDocument()
    })

    it('handles empty WYSIWYG content', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>This should not have a heading level</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that the second paragraph content is rendered
      expect(
        screen.getByText('This should not have a heading level')
      ).toBeInTheDocument()
    })

    it('handles whitespace-only WYSIWYG content', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '   \n\t  ',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>This should not have a heading level</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that the second paragraph content is rendered
      expect(
        screen.getByText('This should not have a heading level')
      ).toBeInTheDocument()
    })
  })
})
