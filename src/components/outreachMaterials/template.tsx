'use client'

import { useState } from 'react'
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { OutreachMaterials as OutreachMaterialsProps } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { DEFAULT_PAGE_LIST_LENGTH } from '@/lib/constants/pagination'
import { FilterForm } from './FilterForm'
import { ResultsSummary } from './ResultsSummary'
import { AssetCard } from './AssetCard'
import { MediaResourceType } from '@/types/drupal/media'

const ITEMS_PER_PAGE = 10

type FilterType =
  | 'select'
  | 'newsletter_content'
  | 'document'
  | 'social_share'
  | 'video'

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
  const filteredAssets = outreachAssets.filter(({ categories, format }) => {
    // Filter by topic
    if (selectedTopic !== 'select' && !categories.includes(selectedTopic)) {
      return false
    }

    // Filter by type
    if (selectedType !== 'select' && format !== selectedType) {
      return false
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

  // This is just so we can test the theoretical performance of using the old template's strategy of rendering every item into the document
  const oldContent = outreachAssets.map((asset, index) => {
    const topicsString = asset.categories.join(',')
    const isEven = index % 2 === 0
    const url =
      asset.absoluteUrl ||
      (asset.media.type === MediaResourceType.Document
        ? asset.media.documentUrl
        : asset.media.type === MediaResourceType.Image
          ? asset.media.imageUrl
          : asset.media.videoEmbedUrl)

    return (
      <div
        key={asset.id}
        data-topic={topicsString}
        data-type={asset.format}
        data-number={index}
        className={`vads-l-col--12 vads-l-row medium-card-utility large-screen:vads-l-col--6 ${isEven ? 'desktop-lg:vads-u-margin-right--3' : ''} vads-u-margin-bottom--3 asset-card show-type show-topic`}
      >
        <div className="card-inside-wrap clearfix vads-u-padding--3">
          <div className="asset-head-wrap medium-screen:vads-l-col--4 medium-head-utility large-screen:vads-l-col--12 video-asset-wrap">
            <img
              alt={asset.title.substring(0, 36)}
              src="/img/hub-illustrations/records.png"
            />
          </div>
          <div className="asset-body-wrap vads-u-display--flex vads-u-flex-direction--column vads-u-padding-top--1p5 medium-screen:vads-u-padding-left--3 desktop-lg:vads-u-padding-left--0 medium-screen:vads-l-col--8 medium-body-utility large-screen:vads-l-col--12">
            <i>[PLACEHOLDER]</i>
            <h2 className="vads-u-margin-y--1 vads-u-font-size--lg">
              {asset.title.substring(0, 36)}
            </h2>
            <div className="asset-body-text">
              {asset.description.substring(0, 81)}
            </div>
            <div className="va-c-margin-top--auto vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--0 desktop-lg:vads-u-margin-bottom--3">
              <va-icon
                className="vads-u-color--link-default"
                icon="youtube"
                size="3"
              />
              <va-link href={url} text="Go to video" />
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className="vads-grid-container">
      <article className="usa-content va-l-facility-detail vads-u-padding-bottom--0">
        <h1>{title}</h1>
        {introText && (
          <div className="va-introtext">
            <p id="office-benefits-description">{introText}</p>
          </div>
        )}

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
            <div className="vads-grid-row vads-grid-gap-3">
              {paginatedAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} topics={topics} />
              ))}
            </div>

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

        <div style={{ display: 'none' }}>{oldContent}</div>

        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </div>
  )
}
