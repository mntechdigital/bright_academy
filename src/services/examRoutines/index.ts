/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { revalidatePath } from "next/cache";

// Public endpoints — no auth token attached.
export const getExamRoutines = async (params: {
  year?: string;
  classId?: string;
  examName?: string;
  stream?: string;
} = {}) => {
  const searchParams = new URLSearchParams();
  if (params.year) searchParams.append("year", params.year);
  if (params.classId) searchParams.append("classId", params.classId);
  if (params.examName) searchParams.append("examName", params.examName);
  if (params.stream) searchParams.append("stream", params.stream);

  const query = searchParams.toString();
  const response = await apiRequest(
    query ? `exam-routines?${query}` : "exam-routines",
    {
      method: "GET",
    }
  );
  return response;
};

export const getExamRoutineById = async (id: string, stream?: string) => {
  const searchParams = new URLSearchParams();
  if (stream) searchParams.append("stream", stream);

  const query = searchParams.toString();
  const response = await apiRequest(
    query ? `exam-routines/${id}?${query}` : `exam-routines/${id}`,
    {
      method: "GET",
    }
  );
  return response;
};

const revalidateRoutinePaths = () => {
  ["/", "/dashboard", "/dashboard/routine"].forEach((path) => {
    revalidatePath(path);
  });
};

// Admin write endpoints — auth token attached.
export const createExamRoutine = async (payload: Record<string, any>) => {
  const response = await apiRequest("exam-routines", {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  revalidateRoutinePaths();

  return response;
};

// Appends new weeks to an existing routine. Never modifies or removes the
// weeks already stored, so it is safe to call with any missing week numbers.
export const addExamRoutineWeeks = async (
  id: string,
  payload: Record<string, any>
) => {
  const response = await apiRequest(`exam-routines/${id}/weeks`, {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  revalidateRoutinePaths();

  return response;
};

export const updateExamRoutine = async (
  id: string,
  payload: Record<string, any>
) => {
  const response = await apiRequest(`exam-routines/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  revalidateRoutinePaths();

  return response;
};

export const deleteExamRoutine = async (id: string | undefined) => {
  const response = await apiRequest(`exam-routines/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  revalidateRoutinePaths();

  return response;
};

export const duplicateExamRoutine = async (
  id: string,
  payload: Record<string, any>
) => {
  const response = await apiRequest(`exam-routines/${id}/duplicate`, {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  revalidateRoutinePaths();

  return response;
};
