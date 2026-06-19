import { NextRequest, NextResponse } from "next/server";
import { loggedUser } from "./src/services/auth";

//  Middleware to handle authentication and redirection
export const proxy = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const loggedAdmin = await loggedUser();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!loggedAdmin?.email) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }

  try {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
};

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};