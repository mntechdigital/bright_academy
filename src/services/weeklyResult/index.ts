/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createWeeklyResult = async (payload: Record<string, any>) => {
  const response = await apiRequest("weekly-marks-sheets", {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const getWeeklyResults = async (query: TQuery[] = []) => {
  const params = new URLSearchParams();
  if (query && query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const url = params.toString()
    ? `weekly-marks-sheets?${params.toString()}`
    : "weekly-marks-sheets";
  const response = await apiRequest(url, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const getWeeklyResultById = async (id: string) => {
  const response = await apiRequest(`weekly-marks-sheets/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const updateWeeklyResult = async (
  id: string,
  payload: Record<string, any>,
) => {
  const response = await apiRequest(`weekly-marks-sheets/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const deleteWeeklyResult = async (id: string | undefined) => {
  const response = await apiRequest(`weekly-marks-sheets/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};
