import { NextRequest } from 'next/server'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(_request: NextRequest) {
  // Disable Draft Mode
  draftMode().disable()

  // Redirect to home page
  redirect('/')
}
