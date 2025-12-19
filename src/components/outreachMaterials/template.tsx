'use client'

import { useState } from 'react'
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import {
  OutreachMaterials as OutreachMaterialsProps,
  OutreachAsset,
} from './formatted-type'
import { SideNavLayout } from '@/components/sideNavLayout/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { DEFAULT_PAGE_LIST_LENGTH } from '@/lib/constants/pagination'
import {
  formatFileSize,
  getFileExtension,
  getYouTubeThumbnail,
  getTopicImagePath,
  buildTopicList,
} from './utils'
import { MediaResourceType } from '@/types/drupal/media'

const ITEMS_PER_PAGE = 10

type FilterType =
  | 'select'
  | 'newsletter_content'
  | 'document'
  | 'social_share'
  | 'video'

interface AssetCardProps {
  asset: OutreachAsset
  index: number
}

function AssetCard({ asset, index }: AssetCardProps) {
  const firstCategory = asset.categories[0]
  const isEven = index % 2 === 0

  const renderMediaImage = () => {
    if (asset.media.type === MediaResourceType.Document) {
      // For documents, show topic-based illustration
      const topicId = firstCategory?.topicId
      const imagePath = getTopicImagePath(topicId)
      return (
        <img
          alt={
            asset.title.length > 36
              ? `${asset.title.substring(0, 36)}...`
              : asset.title
          }
          src={imagePath}
        />
      )
    } else if (asset.media.type === MediaResourceType.Image) {
      // For images, show the actual image
      const imageUrl = asset.absoluteUrl || asset.media.imageUrl
      return <img src={imageUrl} alt={asset.media.imageAlt || asset.title} />
    } else if (asset.media.type === MediaResourceType.Video) {
      // For videos, show thumbnail or YouTube thumbnail
      const thumbnailUrl =
        asset.media.videoThumbnailUrl ||
        getYouTubeThumbnail(asset.media.videoEmbedUrl || undefined) ||
        ''
      return (
        <img
          alt={
            asset.title.length > 36
              ? `${asset.title.substring(0, 36)}...`
              : asset.title
          }
          src={thumbnailUrl}
        />
      )
    }
    return null
  }

  const renderDownloadLink = () => {
    if (asset.media.type === MediaResourceType.Document) {
      const url = asset.absoluteUrl || asset.media.documentUrl || ''
      const extension = getFileExtension(url)
      const filesize = asset.media.documentFilesize || asset.fileSize
      const sizeText = filesize ? formatFileSize(filesize) : ''
      const linkText = `Download ${extension}${sizeText ? ` (${sizeText})` : ''}`

      return <va-link download href={url} text={linkText} />
    } else if (asset.media.type === MediaResourceType.Image) {
      const url = asset.absoluteUrl || asset.media.imageUrl || ''
      const extension = getFileExtension(url)
      const filesize = asset.media.imageFilesize || asset.fileSize
      const sizeText = filesize ? formatFileSize(filesize) : ''
      const linkText = `Download ${extension}${sizeText ? ` (${sizeText})` : ''}`

      return <va-link download={url} href={url} text={linkText} />
    } else if (asset.media.type === MediaResourceType.Video) {
      return (
        <>
          <va-icon
            className="vads-u-color--link-default"
            icon="youtube"
            size="3"
          />
          <va-link href={asset.media.videoEmbedUrl || ''} text="Go to video" />
        </>
      )
    }
    return null
  }

  // Build topics string for data attribute (space-separated topic IDs)
  const topicsString = asset.categories.map((cat) => cat.topicId).join(' ')

  return (
    <div
      data-topic={topicsString}
      data-type={asset.format}
      data-number={index + 1}
      className={`vads-l-col--12 vads-l-row medium-card-utility large-screen:vads-l-col--6 ${
        isEven ? 'desktop-lg:vads-u-margin-right--3' : ''
      } vads-u-margin-bottom--3 asset-card show-type show-topic`}
    >
      <div className="card-inside-wrap clearfix vads-u-padding--3">
        <div
          className={`asset-head-wrap medium-screen:vads-l-col--4 medium-head-utility large-screen:vads-l-col--12 ${
            asset.media.type === MediaResourceType.Document
              ? 'document-asset-wrap'
              : asset.media.type === MediaResourceType.Image
                ? 'image-asset-wrap'
                : 'video-asset-wrap'
          }`}
        >
          {renderMediaImage()}
        </div>

        <div className="asset-body-wrap vads-u-display--flex vads-u-flex-direction--column vads-u-padding-top--1p5 medium-screen:vads-u-padding-left--3 desktop-lg:vads-u-padding-left--0 medium-screen:vads-l-col--8 medium-body-utility large-screen:vads-l-col--12">
          {firstCategory && <i>{firstCategory.name}</i>}
          <h2 className="vads-u-margin-y--1 vads-u-font-size--lg">
            {asset.title.length > 36
              ? `${asset.title.substring(0, 36)}...`
              : asset.title}
          </h2>
          <div className="asset-body-text">
            {asset.description.length > 81
              ? `${asset.description.substring(0, 81)}...`
              : asset.description}
          </div>

          <div className="va-c-margin-top--auto vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--0 desktop-lg:vads-u-margin-bottom--3">
            {renderDownloadLink()}
          </div>
        </div>
      </div>
    </div>
  )
}

export function OutreachMaterials({
  title,
  introText,
  outreachAssets,
  lastUpdated,
}: OutreachMaterialsProps) {
  console.log('outreachAssets', outreachAssets)
  const [selectedTopic, setSelectedTopic] = useState<string>('select')
  const [selectedType, setSelectedType] = useState<FilterType>('select')
  const [currentPage, setCurrentPage] = useState(1)

  // Build unique topic list for dropdown
  const topics = buildTopicList(outreachAssets)

  // Filter assets based on selected topic and type
  const filteredAssets = outreachAssets.filter((asset) => {
    // Filter by topic
    if (selectedTopic !== 'select') {
      const hasTopic = asset.categories.some(
        (cat) => cat.topicId === selectedTopic
      )
      if (!hasTopic) return false
    }

    // Filter by type
    if (selectedType !== 'select') {
      // Normalize format for comparison (handle both taxonomy term names and values)
      const normalizedFormat = asset.format.toLowerCase().replace(/\s+/g, '_')

      // Check if format matches selected type exactly
      if (normalizedFormat !== selectedType) {
        return false
      }
    }

    return true
  })

  // Paginate filtered assets
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedAssets = filteredAssets.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(e.target.value)
    setCurrentPage(1)
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as FilterType)
    setCurrentPage(1)
  }

  const handlePageSelect = (event: { detail: { page: number } }) => {
    setCurrentPage(event.detail.page)
    // Scroll to top of results
    const searchEntry = document.getElementById('search-entry')
    if (searchEntry) {
      searchEntry.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="vads-grid-container">
      <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
        <div className="vads-l-grid-container--full">
          <h1>{title}</h1>
          <div className="vads-l-grid-container--full">
            {introText && (
              <div className="va-introtext">
                <p id="office-benefits-description">{introText}</p>
              </div>
            )}
          </div>
          <div
            className="vads-l-grid-container--full asset-component-library"
            id="search-entry"
          >
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
                    onChange={handleTopicChange}
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
                    onChange={handleTypeChange}
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

            <div id="total-pages-div" className="vads-u-margin-bottom--1">
              <div
                aria-live="polite"
                aria-atomic="true"
                id="pager-focus"
                role="status"
                tabIndex={-1}
              >
                <span>
                  Showing{' '}
                  <span aria-hidden="true" id="total-pages">
                    {filteredAssets.length > 0
                      ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          filteredAssets.length
                        )}`
                      : '0'}
                  </span>
                  <span className="usa-sr-only" id="total-pages-sr">
                    {filteredAssets.length > 0
                      ? `Page ${currentPage} of ${totalPages}, showing items ${
                          (currentPage - 1) * ITEMS_PER_PAGE + 1
                        } through ${Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          filteredAssets.length
                        )} of ${filteredAssets.length}`
                      : 'No results'}
                  </span>
                  <span id="total-all">
                    {' '}
                    of {filteredAssets.length} results
                  </span>
                </span>
              </div>
            </div>

            {paginatedAssets.length > 0 ? (
              <>
                {paginatedAssets.map((asset, index) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                  />
                ))}

                {totalPages > 1 && (
                  <div className="va-pagination" id="va-pager-div">
                    <VaPagination
                      page={currentPage}
                      pages={totalPages}
                      maxPageListLength={DEFAULT_PAGE_LIST_LENGTH}
                      onPageSelect={handlePageSelect}
                    />
                  </div>
                )}
              </>
            ) : (
              <div id="no-results">
                <div>
                  <p>
                    <b>Select a different topic or file type</b>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </div>
  )
}
