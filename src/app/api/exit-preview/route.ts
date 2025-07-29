import { NextRequest, NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  // Disable Draft Mode
  draftMode().disable()
  
  // Redirect to home page
  redirect('/')
}
