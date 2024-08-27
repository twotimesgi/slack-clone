import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { auth } from "../convex/auth";
 
const isPublicPage = createRouteMatcher(["/auth"]); 
export default convexAuthNextjsMiddleware((req) => {
    if(!isPublicPage(req) && !isAuthenticatedNextjs()){
        return nextjsMiddlewareRedirect(req, "/auth");
    }

    //TODO: redirect to /dashboard if user is already authenticated
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};