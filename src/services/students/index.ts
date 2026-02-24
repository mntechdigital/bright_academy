/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createStudent = async (payload: Record<string, any>) => {
  const response = await apiRequest("students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/students"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const getStudents = async (query: TQuery[]) => {
  const params = new URLSearchParams();
  if (query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }
  const response = await apiRequest(`students?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const getStudentById = async (id: string) => {
  const response = await apiRequest(`students/${id}`, {
    method: "GET",
    authRequired: true,
  });
  return await response;
};

export const updateStudent = async (id: string, payload: Record<string, any>) => {
  const response = await apiRequest(`students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/students"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteStudent = async (id: string | undefined) => {
  const response = await apiRequest(`students/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/students"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};
