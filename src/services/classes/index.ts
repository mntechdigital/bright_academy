/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createClasses = async (payload: Record<string, any>) => {
  const response = await apiRequest("studentClasses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/classes"].forEach((path) => {
    revalidatePath(path);
  });
  
  return await response;
};

export const getClasses = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`studentClasses?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const getClassById = async (id: string) => {
  const response = await apiRequest(`studentClasses/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const updateClass = async (id: string, payload: Record<string, any>) => {
  const response = await apiRequest(`studentClasses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/classes"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteClass = async (id: string | undefined) => {
  const response = await apiRequest(`studentClasses/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/classes"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};
