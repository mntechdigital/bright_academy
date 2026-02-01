/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { getNewAccessToken } from "./getNewAccessToken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const fetchServer = async (
  endpoint: string,
  options: RequestInit & { authRequired?: boolean } = {}
): Promise<any> => {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (options.authRequired && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && options.authRequired) {
    const newToken = await getNewAccessToken();

    if (newToken?.accessToken) {
      headers.set("Authorization", `Bearer ${newToken.accessToken}`);
      return fetchServer(endpoint, { ...options, headers });
    }
  }

  return response.json();
};
