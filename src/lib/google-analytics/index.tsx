// log the pageview with its URL
export const pageview = (url, pageTitle) => {
  if (window && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_title: pageTitle,
      page_path: url,
    })
  }
}

// log specific event i.e.
// window.gtag('event', 'Navigation Secondary Button - ', {
//   event_category: 'Interactions',
//   event_label: 'nav-secondary-button-click',
//   value: value || '',
// })
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
