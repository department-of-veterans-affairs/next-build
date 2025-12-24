import { getHubIcon } from '@/lib/utils/benefitsHub'
import { ContentFooter } from '@/components/contentFooter/template'
import { CampaignLandingPageProps } from './template'

export const BenefitCategories = ({
  benefitCategories,
  lastUpdated,
}: CampaignLandingPageProps) => {
  if (!benefitCategories || benefitCategories.length === 0) {
    return null
  }

  return (
    <div
      data-testid="benefit-categories"
      className="vads-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0"
    >
      <div className="vads-grid-row">
        <div className="vads-grid-col-12 tablet:vads-grid-col-9">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            VA Benefits
          </p>
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
            Learn more about related VA benefits
          </h2>
        </div>
      </div>

      <div className="vads-grid-row tablet:vads-u-margin-x--neg6">
        {benefitCategories.map((benefitCategory, index) => {
          const iconConfig = getHubIcon(benefitCategory.titleIcon)

          return (
            <div
              key={index}
              className={`vads-grid-col-12 tablet:vads-grid-col-6 ${index > 0 ? 'vads-u-margin-top--2 tablet:vads-u-margin-top--0' : ''}`}
            >
              <div className="tablet:vads-u-margin-left--6 tablet:vads-u-margin-right--5">
                <div className="vads-u-display--flex vads-u-align-items--center">
                  {iconConfig && (
                    <va-icon
                      icon={iconConfig.icon}
                      size="3"
                      class={`${iconConfig.className} vads-u-margin-right--1`}
                    ></va-icon>
                  )}
                  <h3 className="vads-u-margin--0 vads-u-font-size--h4">
                    <va-link
                      href={benefitCategory.path}
                      text={benefitCategory.title}
                    ></va-link>
                  </h3>
                </div>
                <p className="vads-u-margin-top--1">
                  {benefitCategory.teaserText}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <va-back-to-top></va-back-to-top>
      <ContentFooter lastUpdated={lastUpdated} />
    </div>
  )
}
