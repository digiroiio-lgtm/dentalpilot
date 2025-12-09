export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/price-list/:path*", "/deals/:path*", "/settings/:path*", "/"]
};
