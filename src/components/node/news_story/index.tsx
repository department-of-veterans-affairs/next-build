/**
 * ### Overview
 * News Story represents an individual story within a Facility. These are used for human-interest articles.
 *
 * News Story expects nodes of type {@link NodeNewsStory}.
 *
 * ### View modes
 * Full page: {@link NewsStoryFull}
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/we-honor-outstanding-doctors
 *
 */
import { ComponentType } from 'react'

/** These types/packages will import into all node components. */
import { NodeMetaInfo, NodeNewsStory, NodeResourceType } from '@/types/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** These component includes are specific to this component. */
import { NewsStoryFull, NewsStoryTeaser } from '@/components/news_story'

/**
 * These components expect NodeNewsStory as their input.
 */
export type NodeNewsStoryProps = {
  node: NodeNewsStory
  viewMode?: string
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
}

/** General News Story component. Allows choice of different display components by the caller. */
export const NewsStory = ({
  node,
  viewMode,
  headingLevel,
  ...props
}: NodeNewsStoryProps) => {
  /** Type narrowing; if we've managed to end up here with the wrong data, return. */
  if (node?.type !== NodeResourceType.NewsStory) return

  switch (viewMode) {
    case 'full':
      return (
        <NewsStoryFull
          title={node.title}
          image={node.field_media}
          caption={node.field_image_caption}
          author={node.field_author}
          introText={node.field_intro_text}
          bodyContent={node.field_full_story?.processed}
          date={node.created}
          socialLinks={node}
          listing={node.field_listing}
          {...props}
        />
      )
    case 'teaser':
      return (
        <NewsStoryTeaser
          headingLevel={headingLevel}
          title={node.title}
          image={node.field_media}
          link={node.path.alias}
          introText={node.field_intro_text}
          {...props}
        />
      )
    default:
      return null
  }
}

/** All nodes end with NodeMetaInfo: the name of the resource, the name of the component, and the parameters necessary for calling the resource. */
const params = new DrupalJsonApiParams()
  .addInclude([
    'field_media',
    'field_media.image',
    'field_author',
    'field_listing',
  ])
  .addPageLimit(10)

/** Export information necessary to identify the component and query it.
 * See {@link NodeMetaInfo}
 */
export const Meta: NodeMetaInfo = {
  resource: NodeResourceType.NewsStory,
  component: NewsStory,
  params: params,
}
