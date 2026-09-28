 import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value; 
  const { pathname } = request.nextUrl;

  //  Publicly accessible routes
  const publicPaths = ["/", "/login", "/signup", "/contact", "/events"];

  //  Allow public routes and event details (dynamic)
  if (publicPaths.includes(pathname) || pathname.startsWith("/events/")) {
    return NextResponse.next();
  }

  //  If no role (not authenticated), redirect to login
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //  Admin Routes Access
  if (role === "admin") {
    const adminAllowed = ["/", "/events", "/contact", "/dashboard"];
    if (adminAllowed.includes(pathname) || pathname.startsWith("/events/")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if(role === "organizer"){
    const organizerAllowed = ["/", "/events", "/contact", "/organizerdashboard"];
    if (organizerAllowed.includes(pathname) || pathname.startsWith("/events/")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  //  Super Admin Routes Access
  if (role === "super Admin") {
    if (pathname.startsWith("/superadmindashboard")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/superadmindashboard", request.url));
    }
  }



  //  Organizer or Attendee accessing restricted routes → redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}

//  Match all routes except static assets & API routes
export const config = {
  matcher: [
    "/((?!_next/|api/|static/|images/|fonts/|favicon.ico|.*\\..*$).*)",
  ],
};
