import { NextRequest, NextResponse } from 'next/server'

const allowedParams = ['allowed']

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const pageNum = String(url.pathname.match(/\/(\d)/g))
  let changed = false

  if (url.pathname.match(pageNum)) {
    url.pathname = url.pathname.replace(`${pageNum}`, '')
    changed = true
  }

  // Avoid infinite loop by only redirecting if the query
  // params were changed
  if (changed) {
    // after request append pagenum to url

    return NextResponse.rewrite(url)

    // It's also useful to do a rewrite instead of a redirect
    // return NextResponse.rewrite(url)
  }
}
