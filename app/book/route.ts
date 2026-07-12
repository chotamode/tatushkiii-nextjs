import { NextResponse } from 'next/server'

// Short ad-friendly link: doomp.ink/book opens the site with the booking
// form already open (HomeClient reacts to ?book=1).
export function GET(request: Request) {
  return NextResponse.redirect(new URL('/?book=1', request.url), 307)
}
