/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createMonthlyResult = async (payload: Record<string, any>) => {
  const response = await apiRequest("monthly-results", {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const getMonthlyResults = async (query: TQuery[] = []) => {
  const params = new URLSearchParams();
  if (query && query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const url = params.toString()
    ? `monthly-results?${params.toString()}`
    : "monthly-results";
  const response = await apiRequest(url, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const getMonthlyResultById = async (id: string) => {
  const response = await apiRequest(`monthly-results/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const updateMonthlyResult = async (
  id: string,
  payload: Record<string, any>,
) => {
  const response = await apiRequest(`monthly-results/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const deleteMonthlyResult = async (id: string | undefined) => {
  const response = await apiRequest(`monthly-results/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};



