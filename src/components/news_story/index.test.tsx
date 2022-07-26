import { render } from '@testing-library/react'
import { NewsStoryTeaser, NewsStoryFull } from '.'

// import example data structures
import node from '@/components/node/news_story/nodeNewsStory.json'
import mediaImage from '@/components/media/media_example.json'

test('<NewsStoryTeaser> component renders', () => {
  const { container } = render(
    <NewsStoryTeaser
      title={node[0].title}
      image={node[0].field_media}
      link={node[0].path.alias}
      introText={node[0].field_intro_text}
    />
  )
})

test('<NewsStoryFull> component renders', () => {
  const { container } = render(
    <NewsStoryFull
      title={node[0].title}
      image={node[0].field_media}
      caption={node[0].field_image_caption}
      author={node[0].field_author}
      introText={node[0].field_intro_text}
      bodyContent={node[0].field_full_story?.processed}
      date={node[0].created}
      socialLinks={node[0]}
      listing={node[0].field_listing}
    />
  )
})
