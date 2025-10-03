import { ParagraphReactWidget } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { ReactWidget } from '@/components/reactWidget/formatted-type'

const toBoolean = (value: string | boolean) => {
  if (typeof value === 'string') {
    return value === '1'
  }
  return value
}

export const formatter: QueryFormatter<ParagraphReactWidget, ReactWidget> = (
  entity: ParagraphReactWidget
) => {
  return {
    type: entity.type as ReactWidget['type'],
    id: entity.id ?? null,
    entityId: entity.drupal_internal__id ?? null,
    widgetType: entity.field_widget_type,
    ctaWidget: toBoolean(entity.field_cta_widget),
    loadingMessage: entity.field_loading_message,
    // TODO: Until we come across an example of a react widget that isn't pulled in via
    // entity_field_fetch, we won't know if the regular Drupal API parses these number
    // and boolean values automatically or if we'll always need to parse them manually.
    // For now, we'll just expect either type. This formatter was created before it was
    // actually used.
    timeout:
      typeof entity.field_timeout === 'string'
        ? parseInt(entity.field_timeout, 10)
        : entity.field_timeout,
    errorMessage: entity.field_error_message.processed,
    defaultLink: entity.field_default_link
      ? {
          url: entity.field_default_link.url,
          title: entity.field_default_link.title,
        }
      : null,
    buttonFormat: toBoolean(entity.field_button_format),
  }
}
