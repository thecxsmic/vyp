import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // We allow most routes to render so we can show a modal in the layout,
  // but we might still want to protect API routes or specific paths.
  if (!isPublicRoute(request)) {
    // For now, we'll let the layout handle the "Gate" for a better UX (popup feel)
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
