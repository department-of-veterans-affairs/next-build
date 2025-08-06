import { FieldOfficeHours } from '@/types/drupal/field_type'
import { WysiwygField } from '@/templates/components/wysiwyg'
import { Wysiwyg } from '@/types/formatted/wysiwyg'
import { HoursItem } from './HoursItem'

type HoursProps = {
  allHours: FieldOfficeHours[]
  headerType?: 'small' | 'standard' | 'clinical' | 'office'
  nonTraditionalMessage?: Wysiwyg
}

const normalizeHours = (allHours: FieldOfficeHours[]) => {
  const normalizedHours = [...allHours]

  // Add any missing days
  for (let day = 0; day < 7; day++) {
    if (allHours.find((hours) => hours.day === day)) {
      continue
    }
    normalizedHours.push({
      day,
      starthours: null,
      endhours: null,
    })
  }

  // sort hours so diplay order is monday-sunday
  normalizedHours.sort((a, b) => a.day - b.day)
  const sunday = normalizedHours.shift()
  if (sunday) normalizedHours.push(sunday)

  return normalizedHours
}

export const Hours = ({
  allHours,
  headerType,
  nonTraditionalMessage,
}: HoursProps) => {
  const renderHeader = () => {
    switch (headerType) {
      case 'small':
        return (
          <h3
            className="force-small-header vads-u-margin-top--0 vads-u-line-height--1 vads-u-margin-bottom--1"
            id="hours-heading"
          >
            Hours
          </h3>
        )
      case 'standard':
        return (
          <>
            <h3
              className="vads-u-margin-top--0 vads-u-margin-bottom--1"
              id="hours-heading"
            >
              Hours
            </h3>
            {nonTraditionalMessage && (
              <div id="field-cc-non-traditional-hours">
                <WysiwygField html={nonTraditionalMessage.html} />
              </div>
            )}
          </>
        )
      case 'clinical':
        return (
          <>
            <h3
              className="vads-u-margin-top--2p5 vads-u-margin-bottom--1"
              id="hours-heading"
            >
              Facility hours
            </h3>
            <p>
              Hours may vary for different services. Select a service on this
              page to check the hours.
            </p>
          </>
        )
      case 'office':
        return (
          <>
            <h3
              className="vads-u-margin-top--2p5 vads-u-margin-bottom--1"
              id="hours-heading"
            >
              Office hours
            </h3>
            <p>
              Hours may vary for different services. Select a service on this
              page to check the hours.
            </p>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="vads-u-margin-bottom--0" data-template="hours">
      <div className="clinicalhours">
        {renderHeader()}
        <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row vads-u-margin-bottom--0">
          <ul className="vads-u-flex--1 va-c-facility-hours-list vads-u-margin-top--0 vads-u-margin-bottom--1 mobile-lg:vads-u-margin-bottom--0 vads-u-margin-right--3">
            {normalizeHours(allHours).map((hoursItem, index) => (
              <HoursItem item={hoursItem} key={index} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
