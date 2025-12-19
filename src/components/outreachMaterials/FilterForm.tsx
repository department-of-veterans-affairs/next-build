import { OutreachTopic } from './formatted-type'

type FilterType =
  | 'select'
  | 'newsletter_content'
  | 'document'
  | 'social_share'
  | 'video'

interface FilterFormProps {
  topics: OutreachTopic[]
  selectedTopic: string
  selectedType: FilterType
  onTopicChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function FilterForm({
  topics,
  selectedTopic,
  selectedType,
  onTopicChange,
  onTypeChange,
}: FilterFormProps) {
  return (
    <form className="usa-form vads-u-background-color--gray-lightest vads-u-max-width--100 vads-u-padding-y--3 vads-u-padding-x--1p5 vads-u-margin-bottom--2">
      <div className="vads-l-row vads-u-justify-content--space-between">
        <div className="vads-l-col--12 medium-screen:vads-l-col--12 small-desktop-screen:vads-l-col--12 large-screen:vads-l-col--6 vads-u-padding-x--1p5">
          <label
            className="vads-u-margin-top--0"
            htmlFor="outreach-topic"
          >
            Select a topic
          </label>
          <select
            className="vads-u-max-width--100 usa-select"
            name="outreach-topic"
            id="outreach-topic"
            value={selectedTopic}
            onChange={onTopicChange}
          >
            <option value="select">- All topics -</option>
            {topics.map((topic) => (
              <option key={topic.topicId} value={topic.topicId}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col--12 small-desktop-screen:vads-l-col--12 large-screen:vads-l-col--6 vads-u-padding-x--1p5">
          <label
            className="vads-u-margin-top--0"
            htmlFor="outreach-type"
          >
            Select file type
          </label>
          <select
            className="vads-u-max-width--100 usa-select"
            name="outreach-type"
            id="outreach-type"
            value={selectedType}
            onChange={onTypeChange}
          >
            <option value="select">- All types -</option>
            <option value="newsletter_content">
              Newsletter content
            </option>
            <option value="document">
              Poster, Flyer, brochure and fact sheets
            </option>
            <option value="social_share">
              Social share images, text, and badges
            </option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>
    </form>
  )
}

