import { render, screen } from '@testing-library/react'
import { BlockAlert } from '@/types/block'
import { AlertBlock } from './index'

const blockContent: BlockAlert = {
  type: 'block_content--alert',
  id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
  drupal_internal__id: 50,
  drupal_internal__revision_id: 425,
  langcode: 'en',
  revision_created: '2020-11-03T20:51:50+00:00',
  revision_log: 'publishing',
  status: true,
  info: 'Changes based on Blue Water Navy Vietnam Veterans Act of 2019',
  changed: '2020-11-03T20:51:50+00:00',
  reusable: true,
  default_langcode: true,
  revision_translation_affected: true,
  moderation_state: 'published',
  metatag: null,
  field_alert_title:
    'Changes based on Blue Water Navy Vietnam Veterans Act of 2019',
  field_alert_type: 'information',
  field_reusability: 'reusable',
  links: { self: null },
  block_content_type: {
    type: 'block_content_type--block_content_type',
    id: '278a3f4b-8d89-4768-ab03-869b8cc98613',
    resourceIdObjMeta: [Object],
  },
  revision_user: {
    type: 'user--user',
    id: '38daa8d4-3d05-48a3-bb95-a9c75988e382',
    resourceIdObjMeta: [Object],
  },
  field_alert_content: {
    type: 'paragraph--wysiwyg',
    id: '9693f52f-a5a6-409c-8dae-fc0e500c5964',
    drupal_internal__id: 11169,
    drupal_internal__revision_id: 160840,
    langcode: 'en',
    status: true,
    created: '2020-07-10T20:03:34+00:00',
    parent_id: '50',
    parent_type: 'block_content',
    parent_field_name: 'field_alert_content',
    behavior_settings: [],
    default_langcode: true,
    revision_translation_affected: true,
    field_text_expander: 'Learn how to sign in',
    field_wysiwyg: {
      format: 'rich_text',
      processed:
        "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
      value:
        "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>\\r\\n",
    },
    links: null,
  },
  field_owner: {
    type: 'taxonomy_term--administration',
    id: 'c20f3989-e93e-49bd-8c95-ad3821042a02',
    resourceIdObjMeta: null,
  },
  relationshipNames: [
    'block_content_type',
    'revision_user',
    'field_alert_content',
    'field_owner',
  ],
}

describe('<Alert> with valid data and with field_text_expander', () => {
  test('renders info <Alert> component', () => {
    blockContent.field_alert_type = 'info'
    render(<AlertBlock blockContent={blockContent} />)

    const vaAlertExpandableEl = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandableEl).toHaveAttribute(
      'trigger',
      'Learn how to sign in'
    )
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'info')
  })

  test('renders error <Alert> component', () => {
    blockContent.field_alert_type = 'error'
    render(<AlertBlock blockContent={blockContent} />)

    const vaAlertExpandableEl = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandableEl).toHaveAttribute(
      'trigger',
      'Learn how to sign in'
    )
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'error')
  })

  test('renders success <Alert> component', () => {
    blockContent.field_alert_content.field_text_expander =
      'Learn how to sign in'
    blockContent.field_alert_type = 'success'
    render(<AlertBlock blockContent={blockContent} />)

    const vaAlertExpandableEl = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandableEl).toHaveAttribute(
      'trigger',
      'Learn how to sign in'
    )
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'success')
  })

  test('renders <Alert> component without field_wysiwyg', () => {
    blockContent.field_alert_content.field_text_expander =
      'Learn how to sign in'
    blockContent.field_alert_content.field_wysiwyg = null
    render(<AlertBlock blockContent={blockContent} />)

    const vaAlertExpandableEl = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandableEl).toHaveAttribute(
      'trigger',
      'Learn how to sign in'
    )
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
  })
})

describe('<Alert> with valid data and without field_text_expander', () => {
  test('renders info <Alert> component', () => {
    blockContent.field_alert_content.field_text_expander = null
    blockContent.field_alert_type = 'info'
    render(<AlertBlock blockContent={blockContent} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'info')
  })

  test('renders error <Alert> component', () => {
    blockContent.field_alert_content.field_text_expander = null
    blockContent.field_alert_type = 'error'
    render(<AlertBlock blockContent={blockContent} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'error')
  })

  test('renders success <Alert> component', () => {
    blockContent.field_alert_content.field_text_expander = null
    blockContent.field_alert_type = 'success'
    render(<AlertBlock blockContent={blockContent} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveAttribute('status', 'success')
  })

  test('renders <Alert> component without field_wysiwyg', () => {
    blockContent.field_alert_content.field_text_expander = null
    blockContent.field_alert_content.field_wysiwyg = null
    render(<AlertBlock blockContent={blockContent} />)

    expect(
      document.querySelector('va-alert-expandable')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).not.toBeInTheDocument()
  })
})

describe('<Alert> with invalid data', () => {
  test('does not render <Alert> component when deta is not present', () => {
    render(<AlertBlock blockContent={null} />)

    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).not.toBeInTheDocument()
  })
})
