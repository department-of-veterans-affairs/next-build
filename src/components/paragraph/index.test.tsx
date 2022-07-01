import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { Paragraph } from './index'
import {
  ParagraphButton,
  ParagraphEmailContact,
  ParagraphExpandableText,
  ParagraphLinkTeaser,
  ParagraphStaffProfile,
} from '@/types/paragraph'
import { ExpandableText } from '@/components/paragraph/expandable_text'
import { LinkTeaser } from '@/components/paragraph/link_teaser'

describe('<Paragraph> component renders', () => {
  test('<Button> component', () => {
    const MOCK_PARAGRAPH: ParagraphButton = {
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      type: 'paragraph--button',
      created: '2020-10-16T20:09:53+00:00',
      parent_id: '8475',
      parent_type: 'paragraph',
      parent_field_name: 'field_buttons',
      field_button_label: 'Sign in now',
      field_button_link: {
        uri: 'https://www.va.gov/?next=sign-in-faq',
        title: 'test',
        options: null,
      },
      drupal_internal__id: 123,
      drupal_internal__revision_id: 1,
      langcode: 'en',
      status: true,
    }

    render(<Paragraph paragraph={MOCK_PARAGRAPH} />)

    expect(screen.queryByText(/Sign in now/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.va.gov/?next=sign-in-faq'
    )
  })

  test('<EmailContact> component', () => {
    const MOCK_PARAGRAPH: ParagraphEmailContact = {
      type: 'paragraph--email_contact',
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      created: '2020-10-16T20:09:53+00:00',
      parent_id: '8475',
      parent_type: 'paragraph',
      field_email_address: 'test.veteran@va.gov',
      field_email_label: 'Minority Veterans Program',
      drupal_internal__id: 123,
      drupal_internal__revision_id: 1,
      langcode: 'en',
      status: true,
    }
    render(<Paragraph paragraph={MOCK_PARAGRAPH} />)

    expect(screen.queryByText(/Minority Veterans Program/)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'mailto:test.veteran@va.gov'
    )
  })

  test('<ExpandableText> component', () => {
    const MOCK_PARAGRAPH: ParagraphExpandableText = {
      type: 'paragraph--expandable_text',
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      created: '2020-10-16T20:09:53+00:00',
      parent_id: '8475',
      parent_type: 'paragraph',
      field_text_expander: 'Show more',
      field_wysiwyg: {
        format: 'rich_text',
        processed: 'If you need support...',
        value: 'If you need support...',
      },
      drupal_internal__id: 123,
      drupal_internal__revision_id: 1,
      langcode: 'en',
      status: true,
    }

    render(<ExpandableText paragraph={MOCK_PARAGRAPH} />)

    expect(screen.queryByText(/Show more/)).toBeInTheDocument()
    expect(screen.queryByText(/If you need support.../)).toBeInTheDocument()
  })

  test('<LinkTeaser> component', () => {
    const MOCK_PARAGRAPH: ParagraphLinkTeaser = {
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      type: 'paragraph--link_teaser',
      created: '2020-10-16T20:09:53+00:00',
      parent_id: '8475',
      parent_type: 'paragraph',
      parent_field_name: 'field_spokes',
      field_link: {
        uri: '/health-care/eligibility/',
        title: 'Health Care Benefits Eligibility',
        options: null,
      },
      field_link_summary: 'Find out if you can get VA health care benefits.',
      drupal_internal__id: 123,
      drupal_internal__revision_id: 1,
      langcode: 'en',
      status: true,
    }

    const { container } = render(
      <LinkTeaser
        paragraph={MOCK_PARAGRAPH}
        componentParams={[{ boldTitle: false }, { sectionHeader: '' }]}
      />
    )

    const aEl = container.querySelector('a')
    const spanEl = container.querySelector('span')
    const imageEl = container.querySelector('img')

    expect(aEl).toHaveAttribute('href', '/health-care/eligibility/')
    expect(spanEl).toHaveAttribute('class', 'hub-page-link-list__header')
    expect(imageEl).toHaveAttribute(
      'src',
      'data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2715%27%20height=%2715%27/%3e'
    )
    expect(
      screen.queryByText(/Health Care Benefits Eligibility/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Find out if you can get VA health care benefits./)
    ).toBeInTheDocument()
  })

  test('<StaffProfile> component', () => {
    const MOCK_PARAGRAPH: ParagraphStaffProfile = {
      type: 'paragraph--staff_profile',
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      created: '2020-10-16T20:09:53+00:00',
      parent_id: '8475',
      parent_type: 'node',
      field_staff_profile: {
        type: 'node--person_profile',
        id: '7783e76f-5aca-4d14-9f5e-fb00cc11e4da',
        drupal_internal__nid: 789,
        drupal_internal__vid: 9362,
        langcode: 'en',
        revision_timestamp: '2019-08-27T17:49:44+00:00',
        revision_log: 'Bulk operation publish revision',
        status: true,
        title: 'William Smathers',
        created: '2019-08-14T22:45:49+00:00',
        changed: '2019-08-27T17:49:44+00:00',
        promote: false,
        sticky: false,
        default_langcode: true,
        revision_translation_affected: true,
        moderation_state: 'published',
        metatag: null,
        path: {
          alias: '/pittsburgh-health-care/staff-profiles/william-smathers',
          pid: 1421,
          langcode: 'en',
        },
        field_description: 'Chief of Chaplain Service',
        field_email_address: 'william.smathers@aol.com',
        field_intro_text: null,
        field_last_name: 'Smathers',
        field_meta_tags: null,
        field_name_first: 'William',
        field_phone_number: '412-551-9651',
        field_photo_allow_hires_download: false,
        field_suffix: 'Mr',
        field_body: null,
        field_complete_biography_create: true,
        field_entity: {
          entityUrl: {
            path: 'http:va.gov',
          },
        },
        resourceIdObjMeta: {
          drupal_internal__target_id: 789,
        },
        field_media: {
          type: 'media--image',
          id: '0f4057fa-a1f5-4835-a47a-26d7fb244e17',
          drupal_internal__mid: '502',
          drupal_internal__vid: '502',
          langcode: 'en',
          revision_created: '2019-08-14T22:46:45+00:00',
          revision_log_message: null,
          status: true,
          name: 'William_W_Smathers.jpg',
          created: '2019-08-14T22:46:32+00:00',
          changed: '2019-08-14T22:46:32+00:00',
          default_langcode: true,
          revision_translation_affected: true,
          metatag: null,
          field_description: null,
          thumbnail: {
            type: 'file--file',
            id: '0fbda294-d6ed-41c3-9ed0-dd3c236f2e7f',
            drupal_internal__fid: 592,
            langcode: 'en',
            filename: 'William_W_Smathers.jpg',
            uri: {
              value: 'public://2019-08/William_W_Smathers.jpg',
              url: '/sites/default/files/2019-08/William_W_Smathers.jpg',
            },
            resourceIdObjMeta: {
              alt: 'William W Smathers Headshot',
              title: 'William W Smathers',
              width: 110,
              height: 136,
              drupal_internal__target_id: 592,
            },
            filemime: 'image/jpeg',
            filesize: 7488,
            status: true,
            created: '2019-08-14T22:46:32+00:00',
            changed: '2019-08-14T22:46:45+00:00',
            relationshipNames: ['uid'],
          },
          field_owner: null,
          image: {
            type: 'file--file',
            id: '0fbda294-d6ed-41c3-9ed0-dd3c236f2e7f',
            drupal_internal__fid: '592',
            langcode: 'en',
            filename: 'William_W_Smathers.jpg',
            uri: {
              value: 'public://2019-08/William_W_Smathers.jpg',
              url: '/sites/default/files/2019-08/William_W_Smathers.jpg',
            },
            filemime: 'image/jpeg',
            filesize: 7488,
            status: true,
            created: '2019-08-14T22:46:32+00:00',
            changed: '2019-08-14T22:46:45+00:00',
            relationshipNames: ['uid'],
          },
          relationshipNames: [
            'bundle',
            'revision_user',
            'uid',
            'thumbnail',
            'field_owner',
            'image',
          ],
        },
        field_office: null,
        field_complete_biography: null,
        relationshipNames: [
          'node_type',
          'revision_uid',
          'uid',
          'field_media',
          'field_office',
          'field_administration',
          'field_complete_biography',
        ],
      },
      field_complete_biography_create: true,
      field_description: 'Chief of Chaplain Service',
      field_suffix: 'DMin, BCC-MH',
      field_name_first: 'Anna',
      field_last_name: 'Dordal',
      field_phone_number: '412-822-1551',
      field_email_address: 'test.veteran@va.gov',
      field_email_label: 'Minority Veterans Program',
      field_media: null,
      field_entity: null,
      drupal_internal__id: 123,
      drupal_internal__revision_id: 1,
      langcode: 'en',
      status: true,
      meta: { title: 'This is the title' },
    }
    render(<Paragraph paragraph={MOCK_PARAGRAPH} />)

    expect(screen.queryByText(/Chief of Chaplain Service/)).toBeInTheDocument()
  })
})
