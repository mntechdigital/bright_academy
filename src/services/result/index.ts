/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiRequest } from "@/src/lib/apiRequest";
import { TQuery } from "@/src/types/query.types";

export const getAdminWeeklyResults = async (query: TQuery[] = []) => {
  const params = new URLSearchParams();
  if (query && query.length > 0) {
    query.forEach((q) => {
      const value = q.value == null ? "" : String(q.value).trim();
      // Optional filters (Batch, Top, search) must be omitted when empty,
      // "All", or a serialized undefined/null — never sent as literal text.
      if (!value || value === "All" || value === "undefined" || value === "null") {
        return;
      }
      params.append(q.key, value);
    });
  }
  const url = params.toString() ? `results/weekly?${params.toString()}` : "results/weekly";
  const response = await apiRequest(url, {
    method: "GET",
    authRequired: true,
  });
  return response;
};
