// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { TCustomJwtPayload } from "@/src/types/atuh.interface";

const getUserFromRequest = (req: NextRequest): TCustomJwtPayload | null => {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) return null;

  try {
    return jwtDecode<TCustomJwtPayload>(accessToken);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const isTeacherLoginPage = pathname === "/teacher/login";
  const isTeacherProtectedRoute =
    pathname.startsWith("/teacher") && !isTeacherLoginPage;

  // ---------------- Teacher routes ----------------
  if (isTeacherProtectedRoute || isTeacherLoginPage) {
    // teacher token আলাদা cookie name হলে সেটা এখানে বসান, নাহলে একই লজিক
    const loggedTeacherUser = getUserFromRequest(req);
    if (!loggedTeacherUser?.regNo) {
      if (isTeacherProtectedRoute) {
        return NextResponse.redirect(new URL("/teacher/login", req.url));
      }
      return res;
    }
    if (isTeacherLoginPage) {
      return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
    }
    return res;
  }

  // ---------------- Admin routes ----------------
  const loggedAdmin = getUserFromRequest(req);
  if (!loggedAdmin?.email) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return res;
};

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/teacher/:path*"],
};