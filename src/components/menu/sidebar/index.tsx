import Link from 'next/link'
import { _ } from 'lodash'

const rejectBy = (data, filterBy, valueFilter) => {
  if (!data) return null
  if (typeof valueFilter === 'string' && valueFilter.includes('|')) {
    const filterArray = valueFilter.split('|')
    return data.filter((e) => {
      const targetValue = _.get(e, filterBy)
      return targetValue && !filterArray.includes(targetValue.toString())
    })
  }
  return data.filter((e) => {
    const targetValue = _.get(e, filterBy)
    return targetValue && targetValue !== valueFilter
  })
}

const filterSidebarData = (sidebarData, isPreview = false) => {
  const setData = sidebarData.map((e) => {
    if (e.children) {
      e.children = filterSidebarData(e.children, isPreview)
    }
    return e
  })

  console.log('setData', setData)

  if (!sidebarData || !sidebarData.links[0]?.links) return null

  const findLocationsArr = () => {
    const servicesAndLocationsObj = _.find(sidebarData.links[0].links, [
      'label',
      'SERVICES AND LOCATIONS',
    ])
    if (servicesAndLocationsObj && servicesAndLocationsObj.links) {
      const locationsObj = _.find(servicesAndLocationsObj.links, [
        'label',
        'Locations',
      ])
      if (locationsObj && locationsObj.links.length) {
        return locationsObj.links
      } else return null
    } else return null
  }

  const locationsArr = findLocationsArr()
  const locationsPath = 'links[0]links[0]links[1]links'

  if (isPreview && locationsArr) {
    const publishedAndDraftFacilities = rejectBy(
      locationsArr,
      'entity.linkedEntity.moderationState',
      'archived'
    )
    return setData(sidebarData, locationsPath, publishedAndDraftFacilities)
  } else if (!isPreview && locationsArr) {
    const publishedFacilities = rejectBy(
      locationsArr,
      'entity.linkedEntity.entityPublished',
      false
    )
    return setData(sidebarData, locationsPath, publishedFacilities)
  } else {
    return sidebarData
  }
}

export const SideBar = ({ sidebarData }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>
          <Link href="/">Placeholder</Link>
        </h3>
      </div>
      <div className="sidebar-body">
        <ul>
          <li>
            <Link href="/">{sidebarData[0]}</Link>
          </li>
          <li>
            <Link href="/about">{sidebarData[1]}</Link>
          </li>
          <li>
            <Link href="/contact">{sidebarData[2]}</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
