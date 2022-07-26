import {
  ParagraphMetaInfo,
  ParagraphProps,
  ParagraphResourceType,
} from '@/types/paragraph'
import {
  VaAccordion,
  VaAccordionItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { isEmpty } from 'lodash'

export function ExpandableText({ paragraph }: ParagraphProps) {
  if (!paragraph || isEmpty(paragraph.field_text_expander)) return

  return (
    <VaAccordion open-single>
      <VaAccordionItem
        header={paragraph.field_text_expander}
        id={paragraph.id}
        dangerouslySetInnerHTML={{
          __html: paragraph.field_wysiwyg?.processed,
        }}
      ></VaAccordionItem>
    </VaAccordion>
  )
}

export const Meta: ParagraphMetaInfo = {
  resource: ParagraphResourceType.ExpandableText,
  component: ExpandableText,
}
