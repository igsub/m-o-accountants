export { default } from "next-auth/middleware"
export const config = {
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico/login/form/).*)'],
  matcher: ['/accountant/:path*'],
};