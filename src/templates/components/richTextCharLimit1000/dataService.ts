import { ParagraphResourceType } from '@/types/paragraph'
import { EntityMetaInfo } from 'data/delegators/entityMetaProvider'
import { wysiwygDataService } from 'templates/components/wysiwyg/dataService'
import { RichTextCharLimit1000 } from '.'

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.RichTextCharLimit1000,
  component: RichTextCharLimit1000,
  dataService: wysiwygDataService,
}
