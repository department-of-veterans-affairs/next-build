import { placeholders } from '../placeholders.temp'

export const BenefitCategories = () => {
  return (
    placeholders.fieldBenefitCategories &&
    placeholders.fieldBenefitCategories.length > 0 && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              VA Benefits
            </p>
            <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
              Learn more about related VA benefits
            </h2>
          </div>
        </div>

        <div className="vads-l-row medium-screen:vads-u-margin-x--neg6">
          {placeholders.fieldBenefitCategories.map((benefitCategory, index) => (
            <div
              key={index}
              className={`vads-l-col--12 medium-screen:vads-l-col--6 ${index > 0 ? 'vads-u-margin-top--2 medium-screen:vads-u-margin-top--0' : ''}`}
            >
              <div className="medium-screen:vads-u-margin-left--6 medium-screen:vads-u-margin-right--5">
                <div className="vads-u-display--flex vads-u-align-items--center">
                  {/* TODO: getHubIcon filter - need helper function to render icon based on fieldTitleIcon */}
                  <va-icon
                    icon={benefitCategory.entity.fieldTitleIcon}
                    size="3"
                    className="vads-u-margin-right--1"
                  ></va-icon>
                  <h3 className="vads-u-margin--0 vads-u-font-size--h4">
                    <va-link
                      href={benefitCategory.entity.entityUrl.path}
                      text={benefitCategory.entity.title}
                    ></va-link>
                  </h3>
                </div>
                <p className="vads-u-margin-top--1">
                  {benefitCategory.entity.fieldTeaserText}
                </p>
              </div>
            </div>
          ))}
        </div>
        <va-back-to-top></va-back-to-top>
        {/* TODO: include statement - render above-footer-elements component */}
      </div>
    )
  )
}
