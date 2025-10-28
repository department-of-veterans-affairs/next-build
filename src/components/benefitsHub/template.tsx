import { getHubIcon } from '@/lib/utils/benefitsHub'
import { BenefitsHub as FormattedBenefitsHub } from './formatted-type'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/template'

export function BenefitsHub({
  title,
  titleIcon,
  intro,
  spokes,
}: FormattedBenefitsHub) {
  const iconConfig = getHubIcon(titleIcon)

  return (
    <div className="usa-grid usa-grid-full">
      <article className="usa-width-two-thirds">
        {iconConfig ? (
          <div className="tablet:vads-u-display--flex vads-u-margin-y--1 vads-u-align-items--flex-start">
            <span className="vads-u-margin-top--1">
              <va-icon
                icon={iconConfig.icon}
                size="3"
                class={iconConfig.className}
              />
            </span>
            <h1 className="vads-u-margin-top--1 tablet:vads-u-margin-left--1 tablet:vads-u-margin-y--0">
              {title}
            </h1>
          </div>
        ) : (
          <h1>{title}</h1>
        )}
        <div className="va-introtext">
          <p>{intro}</p>
        </div>
        {spokes?.map((spokeSection) => (
          <div key={spokeSection.id}>
            <section className="usa-grid">
              <div className="va-h-ruled--stars"></div>
            </section>
            <ListOfLinkTeasers {...spokeSection} isHubPage={true} />
          </div>
        ))}
      </article>
    </div>
  )
}
