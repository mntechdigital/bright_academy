"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";
import { revalidatePath } from "next/cache";
import { FieldValues } from "react-hook-form";

export const getRoles = async (query: TQuery[]) => {
  const params = new URLSearchParams();

  if (query && query.length > 0) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }

  const response = await apiRequest(`roles_permissions?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const createRole = async (payload: FieldValues) => {
  const response = await apiRequest("roles_permissions", {
    method: "POST",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard/role"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const updateRole = async (id: string, payload: FieldValues) => {
  const response = await apiRequest(`roles_permissions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    authRequired: true,
  });

  ["/", "/dashboard/role"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteRole = async (id: string | undefined) => {
  const response = await apiRequest(`roles_permissions/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard/role"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const getRoleDetails = async (id: string) => {
  const response = await apiRequest(`roles_permissions/${id}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const deleteAdminUser = async (id: string | undefined) => {
  const response = await apiRequest(`admin-users/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/dashboard/role"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};