import * as React from "react"
import { GetStaticPathsResult } from "next"

import { drupalClient } from "@/utils/drupalClient"
import { queries } from "@/data/queries"
import { NewsStoryPageProps } from "../types"
import Layout from "@/components/layout"
import { NewsStoryFull } from "@/components/news_story"

const RESOURCE_TYPES = ["node--news_story"] as const

interface ResourcePageProps {
  resource: NewsStoryPageProps
}

export default function ResourcePage({ resource }: ResourcePageProps) {
  if (!resource) return null

  return (
    <Layout>
      {resource.type === "node--news_story" && <NewsStoryFull {...resource} />}
    </Layout>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await drupalClient.getStaticPathsFromContext(
      Array.from(RESOURCE_TYPES),
      context
    ),
    fallback: "blocking",
  }
}

export async function getStaticProps(context) {
  const path = await drupalClient.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName as typeof RESOURCE_TYPES[number]

  if (!RESOURCE_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  const resource = await queries.getData(type, {
    context,
    id: path.entity.uuid,
  })

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.published === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      resource,
    },
  }
}
