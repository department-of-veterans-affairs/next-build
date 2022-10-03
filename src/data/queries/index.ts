import { createQueries } from 'next-drupal-query'
import * as NewsStory from './newsStory'
import * as NewsStoryTeaser from './newsStoryTeaser'
import * as StoryListing from './storyListing'
import * as QuestionAnswer from './questionAnswer'
import * as ExpandableText from './expandableText'
import * as LinkTeaser from './linkTeaser'
import * as MediaImage from './mediaImage'
import * as Banner from './banners'
import * as PersonProfile from './personProfile'
import * as Button from './button'
import * as AudienceTopics from './audienceTopics'
import * as Alert from './alert'
import * as EmailContact from './emailContact'
import * as BenefitsHub from './benefitsHub'
import * as Wysiwyg from './wysiwyg'

export const queries = createQueries({
  'node--news_story': NewsStory,
  'node--news_story--teaser': NewsStoryTeaser,
  'node--story_listing': StoryListing,
  'node--q_a': QuestionAnswer,
  'node--person_profile': PersonProfile,
  'node--landing_page': BenefitsHub, // "Benefits Hub Landing Page"
  'paragraph--audience_topics': AudienceTopics,
  'paragraph--button': Button,
  'paragraph--email_contact': EmailContact,
  'paragraph--expandable_text': ExpandableText,
  'paragraph--link_teaser': LinkTeaser,
  'paragraph--rich_text_char_limit_1000': Wysiwyg,
  'paragraph--wysiwyg': Wysiwyg,
  'media--image': MediaImage,
  'block--alert': Alert,

  // Custom Lookups
  'banner--alerts_lookup': Banner,
})
