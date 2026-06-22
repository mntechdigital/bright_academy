/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createBatch = async (payload: Record<string, any>) => {
  const response = await apiRequest("batches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/batches"].forEach((path) => {
    revalidatePath(path);
  });
  
  return await response;
};

export const getBatches = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`batches?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const getBatchById = async (id: string) => {
  const response = await apiRequest(`batches/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const updateBatch = async (id: string, payload: Record<string, any>) => {
  const response = await apiRequest(`batches/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/batches"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteBatch = async (id: string | undefined) => {
  const response = await apiRequest(`batches/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/batches"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const getBatchesByClassId = async (classId: string) => {
  const params = new URLSearchParams();
  params.append("classId", classId);
  
  const response = await apiRequest(`batches?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};