import { render, screen } from '@testing-library/react'
import { AudienceTopics } from './index'
import { ParagraphAudienceTopics } from '@/types/paragraph'

describe('AudienceTopics with valid data', () => {
  const paragraph: ParagraphAudienceTopics = {
    type: 'paragraph--audience_topics',
    id: '0f0561f5-6af7-4511-870f-7bc42347cbdf',
    drupal_internal__id: 13394,
    drupal_internal__revision_id: 153608,
    changed: 'string',
    default_langcode: true,
    description: 'string',
    weight: 1,
    langcode: 'en',
    status: true,
    parent_id: '8420',
    parent_type: 'node',
    parent_field_name: 'field_tags',
    field_audience_selection: 'beneficiares',
    field_audience_beneficiares: {
      type: 'taxonomy_term--audience_beneficiares',
      id: '386eb70d-696c-4af3-8986-306ce63d90de',
      drupal_internal__tid: '268',
      drupal_internal__revision_id: 268,
      langcode: 'en',
      revision_created: '2020-09-10T22:27:56+00:00',
      revision_log_message: null,
      status: true,
      name: 'All Veterans',
      description: null,
      weight: 0,
      changed: '2021-01-13T20:20:40+00:00',
      default_langcode: true,
      revision_translation_affected: true,
      metatag: null,
      path: {
        alias: '/resources/tag/all-veterans',
        pid: 11290,
        langcode: 'en',
      },
      field_audience_rs_homepage: true,
      resourceIdObjMeta: { drupal_internal__target_id: 268 },
      revision_user: null,
      relationshipNames: ['vid', 'revision_user', 'parent'],
    },
    field_non_beneficiares: null,
    field_topics: [
      {
        type: 'taxonomy_term--topics',
        id: '8360523e-a4bb-4d36-851f-1c445501c8bf',
        drupal_internal__tid: '294',
        drupal_internal__revision_id: 294,
        langcode: 'en',
        changed: 'string',
        default_langcode: true,
        description: 'string',
        weight: 1,
        status: true,
        name: 'Payments and debt',
        path: {
          alias: '/resources/tag/payments-and-debt',
          pid: 11288,
          langcode: 'en',
        },
        relationshipNames: ['vid', 'revision_user', 'parent'],
      },
    ],
    relationshipNames: [
      'paragraph_type',
      'field_audience_beneficiares',
      'field_non_beneficiares',
      'field_topics',
    ],
  }

  test('renders component', () => {
    const { container } = render(<AudienceTopics paragraph={paragraph} />)

    const aEl = container.querySelectorAll('a')

    expect(aEl[0]).toHaveAttribute(
      'href',
      '/resources/tag/all-veterans/All%20Veterans'
    )
    expect(aEl[1]).toHaveAttribute(
      'href',
      '/resources/tag/payments-and-debt/Payments%20and%20debt'
    )

    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).toBeInTheDocument()
  })
})

describe('AudienceTopics without field_topics', () => {
  const paragraph: ParagraphAudienceTopics = {
    type: 'paragraph--audience_topics',
    id: '0f0561f5-6af7-4511-870f-7bc42347cbdf',
    drupal_internal__id: 13394,
    drupal_internal__revision_id: 153608,
    langcode: 'en',
    status: true,
    parent_id: '8420',
    parent_type: 'node',
    parent_field_name: 'field_tags',
    field_audience_selection: 'beneficiares',
    field_audience_beneficiares: {
      type: 'taxonomy_term--audience_beneficiares',
      id: '386eb70d-696c-4af3-8986-306ce63d90de',
      drupal_internal__tid: '268',
      drupal_internal__revision_id: 268,
      changed: 'string',
      default_langcode: true,
      description: 'string',
      weight: 1,
      langcode: 'en',
      status: true,
      name: 'All Veterans',
      path: {
        alias: '/resources/tag/all-veterans',
        pid: 11290,
        langcode: 'en',
      },
      field_audience_rs_homepage: true,
      resourceIdObjMeta: { drupal_internal__target_id: 268 },
      revision_user: null,
      relationshipNames: ['vid', 'revision_user', 'parent'],
    },
    field_non_beneficiares: null,
    field_topics: [],
    relationshipNames: [
      'paragraph_type',
      'field_audience_beneficiares',
      'field_non_beneficiares',
      'field_topics',
    ],
  }

  test('does not render Topics category within component', () => {
    render(<AudienceTopics paragraph={paragraph} />)

    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).not.toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).toBeInTheDocument()
  })
})

describe('AudienceTopics without field_audience_beneficiares', () => {
  const paragraph: ParagraphAudienceTopics = {
    type: 'paragraph--audience_topics',
    id: '0f0561f5-6af7-4511-870f-7bc42347cbdf',
    drupal_internal__id: 13394,
    drupal_internal__revision_id: 153608,
    langcode: 'en',
    status: true,
    parent_id: '8420',
    parent_type: 'node',
    parent_field_name: 'field_tags',
    field_audience_selection: 'beneficiares',
    field_audience_beneficiares: null,
    field_non_beneficiares: null,
    field_topics: [
      {
        type: 'taxonomy_term--topics',
        id: '8360523e-a4bb-4d36-851f-1c445501c8bf',
        drupal_internal__tid: '29',
        drupal_internal__revision_id: 294,
        changed: 'string',
        default_langcode: true,
        description: 'string',
        weight: 1,
        langcode: 'en',
        status: true,
        name: 'Payments and debt',
        path: {
          alias: '/resources/tag/payments-and-debt',
          pid: 11288,
          langcode: 'en',
        },
        relationshipNames: ['vid', 'revision_user', 'parent'],
      },
    ],
    relationshipNames: [
      'paragraph_type',
      'field_audience_beneficiares',
      'field_non_beneficiares',
      'field_topics',
    ],
  }

  test('does not render Audience category within component', () => {
    render(<AudienceTopics paragraph={paragraph} />)

    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).not.toBeInTheDocument()
  })
})

describe('AudienceTopics without field_topics and field_audience_beneficiares', () => {
  const paragraph: ParagraphAudienceTopics = {
    type: 'paragraph--audience_topics',
    id: '0f0561f5-6af7-4511-870f-7bc42347cbdf',
    drupal_internal__id: 13394,
    drupal_internal__revision_id: 153608,
    langcode: 'en',
    status: true,
    parent_id: '8420',
    parent_type: 'node',
    parent_field_name: 'field_tags',
    field_audience_selection: 'beneficiares',
    field_audience_beneficiares: null,
    field_non_beneficiares: null,
    field_topics: [],
    relationshipNames: [
      'paragraph_type',
      'field_audience_beneficiares',
      'field_non_beneficiares',
      'field_topics',
    ],
  }

  test('does not render the component', () => {
    render(<AudienceTopics paragraph={paragraph} />)

    expect(screen.queryByText(/Tags/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).not.toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).not.toBeInTheDocument()
  })
})
