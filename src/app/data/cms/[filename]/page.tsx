import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
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

interface Props {
  params: {
    filename: string
  }
}

/* This component never generates a page, but returns 404 after generating static files */
export default async function StaticJsonPage({ params }: Props) {
  const { filename } = params
  
  const staticJsonFile = STATIC_JSON_FILES.find(
    (file) => file.filename === filename
  )
  
  if (staticJsonFile) {
    const { filename: fileBasename, query, queryOpts = {} } = staticJsonFile

    // fetch data
    const data = await queries.getData(query, queryOpts)

    // Write to /public/data/cms
    const filePath = path.resolve(`public/data/cms/${fileBasename}.json`)
    const directoryPath = path.dirname(filePath)
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, {
        recursive: true,
      })
    }
    fs.writeFileSync(filePath, JSON.stringify(data))
  }
  
  // Always return 404 after processing
  notFound()
}

export async function generateStaticParams() {
  if (process.env.SSG === 'false') {
    return []
  }

  return STATIC_JSON_FILES.map(({ filename }) => ({
    filename,
  }))
}
