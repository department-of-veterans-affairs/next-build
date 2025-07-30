import { NextRequest, NextResponse } from 'next/server'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Check for secret and slug
  if (!secret || !slug) {
    return NextResponse.json({ message: 'Missing parameters' }, { status: 401 })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  try {
    const path = await drupalClient.translatePath(slug)

    if (!path) {
      return NextResponse.json({ message: 'Invalid slug' }, { status: 401 })
    }

    // Enable Draft Mode by setting the cookie
    draftMode().enable()

    // Redirect to the path from the fetched post
    redirect(slug)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error enabling preview mode' },
      { status: 500 }
    )
  }
}
