/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

// ✅ Student Login — token cookie-তে save করা হবে
export const loginStudent = async (payload: {
  userId: string;
  password: string;
}) => {
  const response = await apiRequest("students/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    authRequired: false,
  });

  // Login সফল হলে token cookie-তে save করুন
  if (response?.success && response?.data?.token) {
    const cookieStore = await cookies();
    cookieStore.set("studentToken", response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 দিন
      path: "/",
    });

    // Student info আলাদা cookie-তে save করুন
    cookieStore.set("studentInfo", JSON.stringify(response.data.student), {
      httpOnly: false, // client থেকেও পড়া যাবে
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return response;
};

// ✅ Student নিজের result দেখবে
export const getMyResults = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("studentToken")?.value;

  if (!token) {
    return { success: false, message: "Token নেই, আবার login করুন" };
  }

  const response = await apiRequest("students/my-results", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    authRequired: false,
  });

  return response;
};

// ✅ Student নিজের weekly marks দেখবে
export const getMyWeeklyMarks = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("studentToken")?.value;

  if (!token) {
    return { success: false, message: "Token নেই, আবার login করুন" };
  }

  const response = await apiRequest("students/weekly-marks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    authRequired: false,
  });

  return response;
};

// ✅ Student logout
export const logoutStudent = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("studentToken");
  cookieStore.delete("studentInfo");
  return { success: true };
};