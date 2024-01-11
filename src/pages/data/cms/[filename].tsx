import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import fs from 'fs'
import path from 'path'
import { QueryDataOptsMap, queries } from '@/data/queries'

type StaticJsonFile<T extends keyof QueryDataOptsMap> = {
  filename: string
  query: T
  queryOpts?: QueryDataOptsMap[T]
}

const STATIC_JSON_FILES: Array<StaticJsonFile<keyof QueryDataOptsMap>> = [
  {
    filename: 'vamc-ehr',
    query: 'vamc-ehr',
  } as StaticJsonFile<'vamc-ehr'>,

  // Another example:
  // {
  //   filename: 'hypothetical-banner-data-static-json-file',
  //   query: 'banner-data', //must be defined in QUERIES_MAP in src/data/queries/index.ts
  //   queryOpts: {
  //     itemPath: 'path/to/item',
  //   },
  // } as StaticJsonFile<'banner-data'>,
]

/* This component never generates a page, but this default export must be present */
export default function StaticJsonPage() {
  return null
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  if (process.env.SSG === 'false') {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  return {
    paths: STATIC_JSON_FILES.map(({ filename }) => ({
      params: {
        filename,
      },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const staticJsonFilename = context.params?.filename
  const staticJsonFile = STATIC_JSON_FILES.find(
    ({ filename }) => filename === staticJsonFilename
  )
  if (staticJsonFile) {
    const { filename, query, queryOpts = {} } = staticJsonFile
    const data = await queries.getData(query, queryOpts)
    const filePath = path.resolve(`public/data/cms/${filename}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data))
  }
  return {
    notFound: true,
  }
}
