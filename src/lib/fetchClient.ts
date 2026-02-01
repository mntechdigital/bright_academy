/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { getNewAccessToken } from "./getNewAccessToken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Detect runtime environment
const isServer = typeof window === "undefined";

// Function to get token from cookies (Server & Client)
const getAuthToken = async() => {
  if (isServer) {
    // Server: Use next/headers
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
  } else {
    // Client: Use document.cookie
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
  }
};

export const  fetchClient = async (
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
  });

  // Handle token expiration only if auth was required
  if (response.status === 401 && options.authRequired) {
    try {
      const newToken = await getNewAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        return fetchClient(endpoint, { ...options, headers });
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // If we can't refresh the token, return the original response
      return response.json();
    }
  }

  return response.json();
};