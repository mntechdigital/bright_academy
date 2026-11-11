/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";


import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";
import { getExamRoutines } from "@/src/services/examRoutines";
import { DEFAULT_EXAM_NAME } from "@/src/constant/routine.constant";

const parseWeekNo = (week: unknown): number | null => {
  if (week == null) return null;
  const cleaned = String(week).trim().replace(/Week[- ]?/i, "").trim();
  if (!/^\d+$/.test(cleaned)) return null;
  return parseInt(cleaned, 10);
};

const validateWeekSubjectInRoutine = async (params: {
  stdClassId?: string;
  year?: string | number;
  week?: unknown;
  subjectId?: string;
}) => {
  const { stdClassId, year, week, subjectId } = params;
  if (!stdClassId || year == null || year === "" || !subjectId || week == null || week === "") {
    return null;
  }
  const weekNo = parseWeekNo(week);
  if (weekNo == null) {
    return { statusCode: 400, success: false, message: "Invalid week." };
  }
  try {
    const res = await getExamRoutines({ year: String(year), classId: String(stdClassId) });
    const routines = Array.isArray(res?.data) ? res.data : [];
    const weeklyRoutine = routines.find((r: any) => r.examName === DEFAULT_EXAM_NAME);
    if (!weeklyRoutine) {
      return {
        statusCode: 400,
        success: false,
        message: "No weekly routine found for this class and year. Create it in Routine first.",
      };
    }
    const weekRow = (weeklyRoutine.weeks || []).find((w: any) => Number(w.weekNo) === weekNo);
    const scheduled = (weekRow?.subjects || []).some(
      (s: any) => String(s?.subject?.id ?? s?.subjectId) === String(subjectId)
    );
    if (!scheduled) {
      return {
        statusCode: 400,
        success: false,
        message: `This subject is not scheduled in Week ${weekNo} for this class.`,
      };
    }
  } catch {
    return { statusCode: 400, success: false, message: "Failed to validate exam routine." };
  }
  return null;
};

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
  const validationError = await validateWeekSubjectInRoutine({
    stdClassId: payload?.stdClassId,
    year: payload?.year,
    week: payload?.week,
    subjectId: payload?.subjectId,
  });
  if (validationError) return validationError;

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
  const validationError = await validateWeekSubjectInRoutine({
    stdClassId: payload?.stdClassId,
    year: payload?.year,
    week: payload?.week,
    subjectId: payload?.subjectId,
  });
  if (validationError) return validationError;

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
  const first = payload?.marks?.[0];
  if (first) {
    const validationError = await validateWeekSubjectInRoutine({
      stdClassId: first.stdClassId,
      year: first.year,
      week: first.week,
      subjectId: first.subjectId,
    });
    if (validationError) return validationError;
  }

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
