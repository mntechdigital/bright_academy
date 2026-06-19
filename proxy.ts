import { NextRequest, NextResponse } from "next/server";
import { loggedUser } from "./src/services/auth";
import { loggedTeacher } from "./src/services/teacher";

//  Proxy to handle authentication and redirection (Admin + Teacher)
export const proxy = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const isTeacherLoginPage = pathname === "/teacher/login";
  const isTeacherProtectedRoute =
    pathname.startsWith("/teacher") && !isTeacherLoginPage;

  // ---------------- Teacher routes ----------------
  if (isTeacherProtectedRoute || isTeacherLoginPage) {
    const loggedTeacherUser = await loggedTeacher();

    if (!loggedTeacherUser?.regNo) {
      if (isTeacherProtectedRoute) {
        return NextResponse.redirect(new URL("/teacher/login", req.url));
      }
      return res;
    }

    try {
      if (isTeacherLoginPage) {
        return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
      }
      return res;
    } catch (error) {
      console.error(error);
      return NextResponse.redirect(new URL("/teacher/login", req.url));
    }
  }

  // ---------------- Admin routes (existing logic, unchanged) ----------------
  const loggedAdmin = await loggedUser();

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
  matcher: ["/dashboard/:path*", "/login", "/teacher/:path*"],
};