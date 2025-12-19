'use client'

import { useState } from 'react'
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import {
  OutreachMaterials as OutreachMaterialsProps,
  OutreachAsset,
  OutreachTopic,
} from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { DEFAULT_PAGE_LIST_LENGTH } from '@/lib/constants/pagination'
import {
  formatFileSize,
  getFileExtension,
  getYouTubeThumbnail,
  getTopicImagePath,
} from './utils'
import { MediaResourceType } from '@/types/drupal/media'
import { FilterForm } from './FilterForm'
import { ResultsSummary } from './ResultsSummary'

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
  topics: OutreachTopic[]
}

function AssetCard({ asset, index, topics }: AssetCardProps) {
  const firstCategoryTopicId = asset.categories[0]
  const firstCategory = topics.find((t) => t.topicId === firstCategoryTopicId)
  const isEven = index % 2 === 0

  const renderMediaImage = () => {
    if (asset.media.type === MediaResourceType.Document) {
      // For documents, show topic-based illustration
      const topicId = firstCategoryTopicId
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
  const topicsString = asset.categories.join(' ')

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
  topics,
  lastUpdated,
}: OutreachMaterialsProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('select')
  const [selectedType, setSelectedType] = useState<FilterType>('select')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter assets based on selected topic and type
  const filteredAssets = outreachAssets.filter((asset) => {
    // Filter by topic
    if (selectedTopic !== 'select') {
      const hasTopic = asset.categories.includes(selectedTopic)
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
            <FilterForm
              topics={topics}
              selectedTopic={selectedTopic}
              selectedType={selectedType}
              onTopicChange={handleTopicChange}
              onTypeChange={handleTypeChange}
            />

            <ResultsSummary
              filteredCount={filteredAssets.length}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
            />

            {paginatedAssets.length > 0 ? (
              <>
                {paginatedAssets.map((asset, index) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                    topics={topics}
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
