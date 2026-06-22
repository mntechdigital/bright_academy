"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { TTeacherJwtPayload } from '@/src/types/atuh.interface';
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";

export const loggedTeacher = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;

  let decoded: TTeacherJwtPayload | null = null;

  if (accessToken) {
    decoded = jwtDecode<TTeacherJwtPayload>(accessToken);
  }

  return decoded;
};

export const teacherLogin = async (data: FieldValues) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/teachers/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (result.statusCode === 200) {
      const cookie = await cookies();

      cookie.set("accessToken", result.data.accessToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      cookie.set("refreshToken", result.data.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    return result;
  } catch (error) {
    console.error("Teacher login error:", error);
    throw new Error("Login failed. Please try again.");
  }
};

export const teacherLogout = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("accessToken");
    cookie.delete("refreshToken");
  } catch (error) {
    console.error("Teacher logout error:", error);
    throw new Error("Logout failed. Please try again.");
  }
};

// ⚠️ Teacher er nijer password change korar kono function eikhane nei —
// Admin shudhu Dashboard theke `auth/admin-users/...` er moto kono
// `updateTeacher` action diye Teacher er password change korte parbe.

export const teacherDashboardOverview = async () => {
  const response = await apiRequest(`teachers/me`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};


// ==== previous code ====

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
  if (query.length > 0) {
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