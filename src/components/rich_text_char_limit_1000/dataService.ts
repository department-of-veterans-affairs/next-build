import {
  ParagraphResourceType,
  ParagraphRichTextCharLimit1000,
  ParagraphWysiwyg,
} from '@/types/paragraph'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { wysiwygDataService } from '@/components/wysiwyg/dataService'
import RichTextCharLimit1000 from './index'

export const transformRichTextCharLimit1000Data = () => {
  return wysiwygDataService
}

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.RichTextCharLimit1000,
  component: RichTextCharLimit1000,
  dataService: transformRichTextCharLimit1000Data,
}
