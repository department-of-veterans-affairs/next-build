import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { AudienceTopics } from '@/types/formatted/audienceTopics'
import { LinkTeaser } from '@/types/formatted/linkTeaser'
import { Button } from '@/types/formatted/button'

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
