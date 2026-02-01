/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const getClientAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
};

export const fetchClientOnly = async (
  endpoint: string,
  options: RequestInit & { authRequired?: boolean } = {}
): Promise<any> => {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getClientAuthToken();
  if (options.authRequired && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  // Cannot refresh token here on client unless you use API route to trigger secure refresh logic
  return response.json();
};
