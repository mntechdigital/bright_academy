/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createSubject = async (payload: Record<string, any>) => {
  const response = await apiRequest("subjects", {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/subjects"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const getSubjects = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`subjects?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const getSubjectById = async (id: string) => {
  const response = await apiRequest(`subjects/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return response;
};

export const updateSubject = async (id: string, payload: Record<string, any>) => {
  const response = await apiRequest(`subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/subjects"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const deleteSubject = async (id: string | undefined) => {
  const response = await apiRequest(`subjects/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/subjects"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};
