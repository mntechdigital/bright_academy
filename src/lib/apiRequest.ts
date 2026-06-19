/* eslint-disable @typescript-eslint/no-explicit-any */

import { cookies } from "next/headers";
import { getAccessToken } from "./getAccessToken";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Detect runtime environment
const isServer = typeof window === "undefined";

// Function to get token from cookies (Server & Client)
const getAuthToken = async () => {
  if (isServer) {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
  } else {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
  }
};

// Existing (possibly expired) token theke role ber kore, role onujayi
// shothik login page e redirect korar jonno
const getLoginRedirectPath = async () => {
  const token = await getAuthToken();
  if (!token) return "/login";

  try {
    const decoded = jwtDecode<{ role?: string }>(token);
    return decoded.role === "TEACHER" ? "/teacher/login" : "/login";
  } catch {
    return "/login";
  }
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit & { authRequired?: boolean } = {}
): Promise<any> => {
  const headers = new Headers(options.headers);

  // Set Content-Type unless it's FormData
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Only attach token if explicitly required
  if (options.authRequired) {
    const token = await getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  // Handle token expiration only if auth was required
  if (response.status === 401 && options.authRequired) {
    try {
      const newToken = await getAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        return apiRequest(endpoint, { ...options, headers });
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // If we can't refresh the token, return the original response
      return response.json();
    }

    const redirectPath = await getLoginRedirectPath();

    if (typeof window !== "undefined") {
      window.location.href = redirectPath; // Role onujayi Admin/Teacher login e redirect
    } else {
      throw new Error("Unauthorized access. Please log in again.");
    }
  }

  return response.json();
};