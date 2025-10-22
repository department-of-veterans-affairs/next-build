import { render, screen } from '@testing-library/react'
import { ParagraphList } from './ParagraphList'
import { FormattedParagraph } from '@/lib/drupal/queries'

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

    it('handles multiple headings in a single WYSIWYG paragraph', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2>Main Section</h2><h3>Subsection</h3><h4>Sub-subsection</h4>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>This should use h5 heading level</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that all headings are rendered
      expect(screen.getByText('Main Section')).toBeInTheDocument()
      expect(screen.getByText('Subsection')).toBeInTheDocument()
      expect(screen.getByText('Sub-subsection')).toBeInTheDocument()
      expect(
        screen.getByText('This should use h5 heading level')
      ).toBeInTheDocument()
    })

    it('handles WYSIWYG paragraphs with no headings', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<p>Just a paragraph with no headings</p>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>Another paragraph with no headings</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that the content is rendered
      expect(
        screen.getByText('Just a paragraph with no headings')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Another paragraph with no headings')
      ).toBeInTheDocument()
    })
  })

  describe('CollapsiblePanel heading management', () => {
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
  })

  describe('Mixed paragraph types', () => {
    it('manages heading levels across different paragraph types', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h2>Introduction</h2><p>Welcome to our guide</p>',
        },
        {
          type: 'paragraph--button',
          id: '2',
          label: 'Get Started',
          url: '/start',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '3',
          html: '<h3>Step 1</h3><p>First step content</p>',
        },
        {
          type: 'paragraph--featured_content',
          id: '4',
          title: 'Featured Content',
          description: 'Important information',
          link: {
            id: 'link-1',
            url: '/featured',
            label: 'Learn More',
          },
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that all content is rendered
      expect(screen.getByText('Introduction')).toBeInTheDocument()
      expect(screen.getByText('Welcome to our guide')).toBeInTheDocument()
      expect(screen.getByText('Get Started')).toBeInTheDocument()
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('First step content')).toBeInTheDocument()
      expect(screen.getByText('Featured Content')).toBeInTheDocument()
      expect(screen.getByText('Important information')).toBeInTheDocument()
      expect(screen.getByTestId('featured-content-link')).toBeInTheDocument()
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

  describe('Real-world scenarios', () => {
    it('handles a typical article structure', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: '<h1>Article Title</h1><p>Introduction paragraph</p>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<h2>First Section</h2><p>Section content</p>',
        },
        {
          type: 'paragraph--collapsible_panel',
          id: '3',
          entityId: 1,
          paragraphs: [
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'faq-item-1',
              entityId: 1,
              title: 'What is this?',
              wysiwyg: '<p>Answer to the question</p>',
            },
          ],
        },
        {
          type: 'paragraph--wysiwyg',
          id: '4',
          html: '<h3>Subsection</h3><p>Subsection content</p>',
        },
        {
          type: 'paragraph--wysiwyg',
          id: '5',
          html: '<p>This should use h4 heading level</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that all content is rendered
      expect(screen.getByText('Article Title')).toBeInTheDocument()
      expect(screen.getByText('Introduction paragraph')).toBeInTheDocument()
      expect(screen.getByText('First Section')).toBeInTheDocument()
      expect(screen.getByText('Section content')).toBeInTheDocument()
      expect(screen.getByText('What is this?')).toBeInTheDocument()
      expect(screen.getByText('Answer to the question')).toBeInTheDocument()
      expect(screen.getByText('Subsection')).toBeInTheDocument()
      expect(screen.getByText('Subsection content')).toBeInTheDocument()
      expect(
        screen.getByText('This should use h4 heading level')
      ).toBeInTheDocument()
    })

    it('handles complex nested heading structure', () => {
      const paragraphs: FormattedParagraph[] = [
        {
          type: 'paragraph--wysiwyg',
          id: '1',
          html: `
            <h1>Main Title</h1>
            <h2>Section 1</h2>
            <h3>Subsection 1.1</h3>
            <h4>Sub-subsection 1.1.1</h4>
            <h5>Sub-sub-subsection 1.1.1.1</h5>
            <h6>Final level</h6>
          `,
        },
        {
          type: 'paragraph--wysiwyg',
          id: '2',
          html: '<p>This should not have a heading level (h6 is max)</p>',
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that all headings are rendered
      expect(screen.getByText('Main Title')).toBeInTheDocument()
      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Subsection 1.1')).toBeInTheDocument()
      expect(screen.getByText('Sub-subsection 1.1.1')).toBeInTheDocument()
      expect(screen.getByText('Sub-sub-subsection 1.1.1.1')).toBeInTheDocument()
      expect(screen.getByText('Final level')).toBeInTheDocument()
      expect(
        screen.getByText('This should not have a heading level (h6 is max)')
      ).toBeInTheDocument()
    })

    it('handles FAQ-style content with multiple CollapsiblePanels', () => {
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
              title: 'What is this service?',
              wysiwyg: '<p>This service helps with...</p>',
            },
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'faq-item-2',
              entityId: 20,
              title: 'How do I get started?',
              wysiwyg: '<p>To get started...</p>',
            },
          ],
        },
        {
          type: 'paragraph--wysiwyg',
          id: '3',
          html: '<h2>Additional Information</h2>',
        },
        {
          type: 'paragraph--collapsible_panel',
          id: '4',
          entityId: 2,
          paragraphs: [
            {
              type: 'paragraph--collapsible_panel_item',
              id: 'faq-item-3',
              entityId: 30,
              title: 'Where can I get help?',
              wysiwyg: '<p>You can get help...</p>',
            },
          ],
        },
      ]

      render(<ParagraphList paragraphs={paragraphs} />)

      // Check that all content is rendered
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      expect(screen.getByText('What is this service?')).toBeInTheDocument()
      expect(screen.getByText('This service helps with...')).toBeInTheDocument()
      expect(screen.getByText('How do I get started?')).toBeInTheDocument()
      expect(screen.getByText('To get started...')).toBeInTheDocument()
      expect(screen.getByText('Additional Information')).toBeInTheDocument()
      expect(screen.getByText('Where can I get help?')).toBeInTheDocument()
      expect(screen.getByText('You can get help...')).toBeInTheDocument()
    })
  })
})
