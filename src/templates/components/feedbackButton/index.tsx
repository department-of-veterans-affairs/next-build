import { MedalliaAssets } from '@/templates/common/medallia'

export function FeedbackButton({ surveyNumber }: { surveyNumber: number }) {
  const handleClick = () => {
    window.KAMPYLE_ONSITE_SDK.showForm(surveyNumber)
  }
  return (
    <>
      <MedalliaAssets />
      <va-button
        data-testid="feedback-button"
        id="mdFormButton"
        label="Give feeback"
        onClick={handleClick}
        text="Feedback"
      />
    </>
  )
}
