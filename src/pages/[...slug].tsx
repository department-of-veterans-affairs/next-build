import * as React from 'react'
import { drupalClient } from '@/utils/drupalClient'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FIELDS } from '@/lib/constants'

export default function NodePage({ node }) {
    if (!node) return null
    return (
        <>
            <div>{node.type === 'node--q_a' && <h2>{node.title}</h2>}</div>
        </>
    )
}

export async function getStaticPaths(context) {
    return {
        paths: await drupalClient.getPathsFromContext(['node--q_a'], context),
        fallback: false,
    }
}

export async function getStaticProps(context) {
    const type = 'node--q_a'

    const params = new DrupalJsonApiParams()
    if (type === 'node--q_a') {
        params.addInclude([FIELDS])
    }

    const node = await drupalClient.getResourceFromContext(type, context, {
        params: params.getQueryObject(),
    })

    if (!node?.status) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            node: node || null,
        },
    }
}
