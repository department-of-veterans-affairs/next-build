import { NextApiRequest, NextApiResponse } from 'next'
import { drupalClient } from '@/lib/utils/drupalClient'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await drupalClient.preview(request, response)
}
