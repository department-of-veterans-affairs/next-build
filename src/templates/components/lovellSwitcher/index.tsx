import React from 'react'
import {
  LOVELL,
  LovellVariant,
  getOppositeVariant,
  isLovellTricarePath,
  isLovellVaPath,
} from '@/lib/drupal/lovell'
import { LovellSwitcherType } from '@/types/index'

export function LovellSwitcher({
  currentVariant,
  switchPath,
}: LovellSwitcherType) {
  if (!switchPath || !currentVariant) {
    return <></>
  }

  const switchVariant = getOppositeVariant(currentVariant)

  return (
    <va-alert
      status="warning"
      className="vads-u-margin-bottom--2"
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
