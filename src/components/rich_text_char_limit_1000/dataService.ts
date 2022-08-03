import { ParagraphResourceType } from '@/types/paragraph'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { RichTextCharLimit1000 } from './index'
import { wysiwygDataService } from '@/components/wysiwyg/dataService'

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.RichTextCharLimit1000,
  component: RichTextCharLimit1000,
  dataService: wysiwygDataService,
}
