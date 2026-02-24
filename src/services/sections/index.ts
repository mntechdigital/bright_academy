/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createSections = async (payload: Record<string, any>) => {
  const response = await apiRequest("studentSections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/sections"].forEach((path) => {
    revalidatePath(path);
  });
  
  return await response;
};

export const getSections = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`studentSections?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const getSectionById = async (id: string) => {
  const response = await apiRequest(`studentSections/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const updateSection = async (id: string, payload: Record<string, any>) => {
  const response = await apiRequest(`studentSections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/sections"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteSection = async (id: string | undefined) => {
  const response = await apiRequest(`studentSections/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/sections"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};
