import React from 'react'
import { getOppositeChildVariant } from '@/lib/drupal/lovell/utils'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

type LovellSwitcherProps = {
  currentVariant: LovellChildVariant
  switchPath: string
}

export function LovellSwitcher({
  currentVariant,
  switchPath,
}: LovellSwitcherProps) {
  if (!switchPath || !currentVariant) {
    return <></>
  }

  const switchVariant = getOppositeChildVariant(currentVariant)

  return (
    <va-alert
      status="warning"
      class="vads-u-margin-bottom--2"
      id="va-info-alert"
    >
      <h2 slot="headline">
        You are viewing this page as a {currentVariant.toUpperCase()}{' '}
        beneficiary.
      </h2>
      <div>
        <p className="vads-u-margin-y--0">
          <>
            <va-link
              active="true"
              href={switchPath}
              text={`View this page as a ${switchVariant.toUpperCase()} beneficiary`}
            />
          </>
        </p>
      </div>
    </va-alert>
  )
}
