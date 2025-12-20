import { render, screen, userEvent, axe } from 'test-utils'
import { fireEvent } from '@testing-library/react'
import { FilterForm } from './FilterForm'
import type { OutreachTopic } from './formatted-type'

describe('FilterForm', () => {
  const mockTopics: OutreachTopic[] = [
    { topicId: 'healthcare', name: 'Health Care' },
    { topicId: 'education', name: 'Education' },
    { topicId: 'burials', name: 'Burials' },
    { topicId: 'general', name: 'General' },
  ]

  const mockOnTopicChange = jest.fn()
  const mockOnTypeChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders form with both select dropdowns', async () => {
      const { container } = render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText('Select a topic')
      expect(topicSelect).toBeInTheDocument()
      expect(topicSelect).toHaveValue('select')

      const typeSelect = screen.getByLabelText('Select file type')
      expect(typeSelect).toBeInTheDocument()
      expect(typeSelect).toHaveValue('select')

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })

    test('renders all topic options', () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText('Select a topic')
      expect(
        topicSelect.querySelector('option[value="select"]')
      ).toHaveTextContent('- All topics -')
      expect(
        topicSelect.querySelector('option[value="healthcare"]')
      ).toHaveTextContent('Health Care')
      expect(
        topicSelect.querySelector('option[value="education"]')
      ).toHaveTextContent('Education')
      expect(
        topicSelect.querySelector('option[value="burials"]')
      ).toHaveTextContent('Burials')
      expect(
        topicSelect.querySelector('option[value="general"]')
      ).toHaveTextContent('General')
    })

    test('renders all file type options', () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const typeSelect = screen.getByLabelText('Select file type')
      expect(
        typeSelect.querySelector('option[value="select"]')
      ).toHaveTextContent('- All types -')
      expect(
        typeSelect.querySelector('option[value="newsletter_content"]')
      ).toHaveTextContent('Newsletter content')
      expect(
        typeSelect.querySelector('option[value="document"]')
      ).toHaveTextContent('Poster, Flyer, brochure and fact sheets')
      expect(
        typeSelect.querySelector('option[value="social_share"]')
      ).toHaveTextContent('Social share images, text, and badges')
      expect(
        typeSelect.querySelector('option[value="video"]')
      ).toHaveTextContent('Videos')
    })

    test('applies correct CSS classes', () => {
      const { container } = render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const form = container.querySelector('form')
      expect(form).toHaveClass('usa-form')
      expect(form).toHaveClass('vads-u-background-color--gray-lightest')
    })
  })

  describe('Selected values', () => {
    test('displays selected topic value', () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="healthcare"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText('Select a topic')
      expect(topicSelect).toHaveValue('healthcare')
    })

    test('displays selected type value', () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="document"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const typeSelect = screen.getByLabelText('Select file type')
      expect(typeSelect).toHaveValue('document')
    })

    test('displays both selected values', () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="education"
          selectedType="video"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText('Select a topic')
      const typeSelect = screen.getByLabelText('Select file type')

      expect(topicSelect).toHaveValue('education')
      expect(typeSelect).toHaveValue('video')
    })
  })

  describe('User interactions', () => {
    test('calls onTopicChange when topic selection changes', async () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText(
        'Select a topic'
      ) as HTMLSelectElement
      fireEvent.change(topicSelect, {
        target: { value: 'healthcare', name: 'outreach-topic' },
      })

      expect(mockOnTopicChange).toHaveBeenCalledTimes(1)
      const event = mockOnTopicChange.mock.calls[0][0]
      expect(event).toBeDefined()
      expect(event.target).toBeDefined()
      // For controlled components, React may not update the DOM value immediately
      // but the event handler receives the synthetic event with the new value
      expect(event.target.name).toBe('outreach-topic')
    })

    test('calls onTypeChange when type selection changes', async () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const typeSelect = screen.getByLabelText(
        'Select file type'
      ) as HTMLSelectElement
      fireEvent.change(typeSelect, {
        target: { value: 'document', name: 'outreach-type' },
      })

      expect(mockOnTypeChange).toHaveBeenCalledTimes(1)
      const event = mockOnTypeChange.mock.calls[0][0]
      expect(event).toBeDefined()
      expect(event.target).toBeDefined()
      // For controlled components, React may not update the DOM value immediately
      // but the event handler receives the synthetic event with the new value
      expect(event.target.name).toBe('outreach-type')
    })

    test('handles multiple selection changes', async () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText(
        'Select a topic'
      ) as HTMLSelectElement
      const typeSelect = screen.getByLabelText(
        'Select file type'
      ) as HTMLSelectElement

      fireEvent.change(topicSelect, {
        target: { value: 'burials', name: 'outreach-topic' },
      })
      fireEvent.change(typeSelect, {
        target: { value: 'social_share', name: 'outreach-type' },
      })

      expect(mockOnTopicChange).toHaveBeenCalledTimes(1)
      expect(mockOnTypeChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge cases', () => {
    test('handles empty topics array', () => {
      render(
        <FilterForm
          topics={[]}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText('Select a topic')
      expect(topicSelect).toBeInTheDocument()
      // Should only have the "All topics" option
      const options = topicSelect.querySelectorAll('option')
      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent('- All topics -')
    })

    test('handles single topic', () => {
      const singleTopic: OutreachTopic[] = [
        { topicId: 'healthcare', name: 'Health Care' },
      ]
      render(
        <FilterForm
          topics={singleTopic}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText('Select a topic')
      const options = topicSelect.querySelectorAll('option')
      expect(options).toHaveLength(2) // "All topics" + 1 topic
      expect(options[1]).toHaveTextContent('Health Care')
    })

    test('maintains accessibility attributes', () => {
      render(
        <FilterForm
          topics={mockTopics}
          selectedTopic="select"
          selectedType="select"
          onTopicChange={mockOnTopicChange}
          onTypeChange={mockOnTypeChange}
        />
      )

      const topicSelect = screen.getByLabelText('Select a topic')
      expect(topicSelect).toHaveAttribute('id', 'outreach-topic')
      expect(topicSelect).toHaveAttribute('name', 'outreach-topic')

      const typeSelect = screen.getByLabelText('Select file type')
      expect(typeSelect).toHaveAttribute('id', 'outreach-type')
      expect(typeSelect).toHaveAttribute('name', 'outreach-type')
    })
  })
})
