import { ReactWidget as FormattedReactWidget } from '@/types/formatted/reactWidget'
import { ParagraphComponent } from '@/types/formatted/paragraph'

const CtaWidget = ({ entityId, widgetType }) => {
  return (
    <div
      data-next-component="templates/components/reactWidget"
      data-entity-id={entityId}
      className="cta-widget"
      data-widget-type="cta"
      data-app-id={widgetType}
    ></div>
  )
}

const LoadingIndicator = ({ loadingMessage, slowLoadingMessage }) => {
  return (
    <div className="loading-indicator-container">
      <div
        aria-label={loadingMessage}
        aria-valuetext="Loading your application..."
        className="loading-indicator"
        role="progressbar"
      ></div>
      <span className="loading-indicator-message loading-indicator-message--normal">
        {loadingMessage}
      </span>
      <span
        className="loading-indicator-message loading-indicator-message--slow vads-u-display--none"
        aria-hidden="true"
      >
        {slowLoadingMessage}
      </span>
    </div>
  )
}

const StaticWidgetContent = ({ defaultLink, buttonFormat }) => {
  return (
    <span
      className="static-widget-content vads-u-display--none"
      aria-hidden="true"
    >
      {defaultLink && (
        <a
          href={defaultLink.url}
          className={buttonFormat ? 'usa-button-primary va-button-primary' : ''}
        >
          {defaultLink.title}
        </a>
      )}
    </span>
  )
}

const ErrorMessage = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div
      className="usa-alert usa-alert-error sip-application-error vads-u-display--none"
      aria-hidden="true"
    >
      <div className="usa-alert-body">{errorMessage}</div>
    </div>
  )
}

const DefaultWidget = ({
  entityId,
  widgetType,
  timeout,
  loadingMessage,
  slowLoadingMessage,
  errorMessage,
  defaultLink,
  buttonFormat,
}) => {
  return (
    <div
      data-template="paragraphs/react_widget"
      data-entity-id={entityId}
      data-widget-type={widgetType}
      data-widget-timeout={timeout}
    >
      <LoadingIndicator
        loadingMessage={loadingMessage}
        slowLoadingMessage={slowLoadingMessage}
      />
      <StaticWidgetContent
        defaultLink={defaultLink}
        buttonFormat={buttonFormat}
      />
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  )
}

export const ReactWidget = ({
  entityId,
  ctaWidget = false,
  widgetType,
  loadingMessage = 'Loading...',
  slowLoadingMessage = 'Sorry, this is taking longer than expected.',
  timeout = 20,
  errorMessage,
  defaultLink,
  buttonFormat,
}: ParagraphComponent<FormattedReactWidget>) => {
  if (ctaWidget) {
    return <CtaWidget entityId={entityId} widgetType={widgetType} />
  } else {
    return (
      <DefaultWidget
        entityId={entityId}
        widgetType={widgetType}
        loadingMessage={loadingMessage}
        slowLoadingMessage={slowLoadingMessage}
        timeout={timeout}
        errorMessage={errorMessage}
        defaultLink={defaultLink}
        buttonFormat={buttonFormat}
      />
    )
  }
}
