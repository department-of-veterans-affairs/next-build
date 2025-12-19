'use client'

import { useState } from 'react'
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { OutreachMaterials as OutreachMaterialsProps } from './formatted-type'
import { ContentFooter } from '@/components/contentFooter/template'
import { DEFAULT_PAGE_LIST_LENGTH } from '@/lib/constants/pagination'
import { FilterForm } from './FilterForm'
import { ResultsSummary } from './ResultsSummary'
import { AssetCard } from './AssetCard'

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
              {paginatedAssets.map((asset, index) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                  topics={topics}
                />
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
        <ContentFooter lastUpdated={lastUpdated} />
      </article>
    </div>
  )
}
