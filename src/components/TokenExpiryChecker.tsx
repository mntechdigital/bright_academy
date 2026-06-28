"use client";

import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const TokenExpiryChecker = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const checkTokenExpiry = () => {
      // Read accessToken from cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return undefined;
      };

      const accessToken = getCookie("accessToken");
      if (!accessToken) return;

      try {
        const decoded = jwtDecode<{ exp: number; role?: string }>(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        // If token is expired, redirect to login
        if (decoded.exp && decoded.exp < currentTime) {
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            const redirectPath =
              decoded.role === "TEACHER" ? "/teacher/login" : "/login";

            // Clear the expired cookies
            document.cookie =
              "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            document.cookie =
              "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

            router.push(redirectPath);
            router.refresh();
          }
        } else {
          hasRedirected.current = false;
        }
      } catch {
        // If token can't be decoded, it's invalid - clear and redirect
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          document.cookie =
            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          document.cookie =
            "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          router.push("/login");
          router.refresh();
        }
      }
    };

    // Check immediately on mount
    checkTokenExpiry();

    // Then check every 30 seconds
    const interval = setInterval(checkTokenExpiry, 30 * 1000);

    // Also check on page visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkTokenExpiry();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  return <>{children}</>;
};

export default TokenExpiryChecker;