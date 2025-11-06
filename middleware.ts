import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/login", "/"]
const PROTECTED_ROUTES = [
  "/dashboard",
  "/data",
  "/warehouse",
  "/pos",
  "/kitchen",
  "/menu",
  "/orders",
  "/cash-registers",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/health") || PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Note: Session is managed client-side via auth-provider
  // This middleware serves as a reference point for future session-based auth
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}
