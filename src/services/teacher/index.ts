/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createTeacher = async (payload: Record<string, any>) => {
  const response = await apiRequest("teachers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/teachers"].forEach((path) => {
    revalidatePath(path);
  });
  
  return await response;
};

export const getTeachers = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`teachers?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const getTeacherById = async (id: string) => {
  const response = await apiRequest(`teachers/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const updateTeacher = async (id: string, payload: Record<string, any>) => {
  const response = await apiRequest(`teachers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/teachers"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteTeacher = async (id: string | undefined) => {
  const response = await apiRequest(`teachers/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/teachers"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};
