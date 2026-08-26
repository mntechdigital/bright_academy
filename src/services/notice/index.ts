/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createNotice = async (payload: FormData) => {
  const response = await apiRequest("notices", {
    method: "POST",
    body: payload,
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/notices"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const getNotices = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`notices?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const getPublishedNotices = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`notices/published?${params.toString()}`, {
    method: "GET",
  });
  return response;
};

export const getNoticeById = async (id: string) => {
  const response = await apiRequest(`notices/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const updateNotice = async (id: string, payload: FormData) => {
  const response = await apiRequest(`notices/${id}`, {
    method: "PATCH",
    body: payload,
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/notices"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const deleteNotice = async (id: string | undefined) => {
  const response = await apiRequest(`notices/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/notices"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};
