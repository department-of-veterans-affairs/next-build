import { ParagraphReactWidget } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { ReactWidget } from '@/types/formatted/reactWidget'

export const formatter: QueryFormatter<ParagraphReactWidget, ReactWidget> = (
  entity: ParagraphReactWidget
) => {
  return {
    type: entity.type as ReactWidget['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    widgetType: entity.field_widget_type,
    ctaWidget: entity.field_cta_widget,
    loadingMessage: entity.field_loading_message,
    timeout: entity.field_timeout,
    errorMessage: entity.field_error_message.processed,
    defaultLink: entity.field_default_link
      ? {
          url: entity.field_default_link.url,
          title: entity.field_default_link.title,
        }
      : null,
    buttonFormat: entity.field_button_format,
  }
}
