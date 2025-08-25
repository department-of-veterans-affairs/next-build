import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { AudienceTopics } from '@/components/audienceTopics/formatted-type'
import { LinkTeaser } from '@/components/linkTeaser/formatted-type'
import { Button } from '@/components/button/formatted-type'

export type QuestionAnswer = PublishedEntity & {
  title: string
  answers: string
  buttons: Button[]
  tags: AudienceTopics
  teasers: LinkTeaser[]
  className?: string
  entityId: number
  entityPath: string
}
