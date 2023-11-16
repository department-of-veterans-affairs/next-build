import { PublishedEntity } from './publishedEntity'
import { AudienceTopic } from './audienceTopics'
import { LinkTeaser } from './linkTeaser'
import { Button } from './button'

export type QuestionAnswer = PublishedEntity & {
  title: string
  answers: string
  buttons: Button[]
  tags: AudienceTopic[]
  teasers: LinkTeaser[]
  className?: string
  entityId: number
  entityPath: string
}
