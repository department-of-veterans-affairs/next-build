import { PublishedEntity } from './publishedEntity'
import { AudienceTopics } from './audienceTopics'
import { LinkTeaser } from './linkTeaser'
import { Button } from './button'

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
