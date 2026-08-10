/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";


import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const createWeeklyResult = async (payload: Record<string, any>) => {
  
  if (!payload || typeof payload !== 'object') {
    console.error('ERROR: Payload is invalid!');
    return {
      statusCode: 400,
      message: 'Invalid payload received',
    };
  }
  
  
  const response = await apiRequest("weekly-marks-sheets", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    authRequired: true,
  });

  console.log('API Service - Response:', response);

  ["/", "/dashboard", "/dashboard/result", "/dashboard/result/give-result"].forEach((path) => {
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

export const getWeeklyResultsByClassBatchSubject = async (params: {
  stdClassId: string;
  batchId?: string;
  subjectId: string;
  year?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append("stdClassId", params.stdClassId);
  if (params.batchId) {
    searchParams.append("batchId", params.batchId);
  }
  searchParams.append("subjectId", params.subjectId);
  if (params.year) {
    searchParams.append("year", params.year);
  }

  const response = await apiRequest(
    `weekly-marks-sheets/class-batch-subject?${searchParams.toString()}`,
    {
      method: "GET",
      authRequired: true,
    }
  );
  return response;
};

export const getWeeklyResultsByFilters = async (filters: {
  stdClassId: string;
  subjectId: string;
  batchId?: string;
  week?: string;
  month?: string;
  year?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append("stdClassId", filters.stdClassId);
  searchParams.append("subjectId", filters.subjectId);
  if (filters.batchId) searchParams.append("batchId", filters.batchId);
  if (filters.week) searchParams.append("week", filters.week);
  if (filters.month) searchParams.append("month", filters.month);
  if (filters.year) searchParams.append("year", filters.year);

  const response = await apiRequest(
    `weekly-marks-sheets/filter?${searchParams.toString()}`,
    {
      method: "GET",
      authRequired: true,
    }
  );
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

  ["/", "/dashboard", "/dashboard/result", "/dashboard/result/give-result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const deleteWeeklyResult = async (id: string | undefined) => {
  const response = await apiRequest(`weekly-marks-sheets/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result", "/dashboard/result/give-result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const deleteWeeklyResultByClassAndSection = async (
  payload: Record<string, any>,
) => {
  const response = await apiRequest(`weekly-marks-sheets/class/batch`, {
    method: "DELETE",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result", "/dashboard/result/give-result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const createWeeklyResultForSingleStd = async (
  payload: Record<string, any>,
) => {
  const response = await apiRequest("weekly-marks-sheets/obtained-marks", {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result", "/dashboard/result/give-result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const updateWeeklyResultForSingleStd = async (
  id: string,
  payload: Record<string, any>,
) => {
  const response = await apiRequest(
    `weekly-marks-sheets/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      authRequired: true,
    },
  );

  ["/", "/dashboard", "/dashboard/result", "/dashboard/result/give-result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};

export const bulkUpsertStudentMarks = async (payload: { marks: Record<string, any>[] }) => {
  const response = await apiRequest("weekly-marks-sheets/bulk-obtained-marks", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    authRequired: true,
  });

  ["/", "/dashboard", "/dashboard/result", "/dashboard/result/give-result"].forEach((path) => {
    revalidatePath(path);
  });

  return response;
};
