import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import { getClasses } from "@/src/services/classes";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { TQuery } from "@/src/types/query.types";
import ShowMonthlyResultTable from "./_components/monthlyResult/ShowMonthlyResultTable";
import ShowWeeklyResultTable from "./_components/monthlyResult/ShowWeeklyResultTable";
import { getMonthlyResults } from "@/src/services/monthlyResult";
import { getAdminWeeklyResults } from "@/src/services/result";
import {
  DEFAULT_WEEK,
  MONTH_NAMES,
  normalizeWeekParam,
} from "./_components/monthlyResult/weeklyFilters";

const ResultOverviewPage = async (props: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    classId?: string;
    batchId?: string;
    mode?: string;
    month?: string;
    year?: string;
    week?: string;
    top?: string;
    sortBy?: string;
    order?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1") || 1;
  const classId = searchParams.classId || "";
  const batchId = searchParams.batchId || "";
  const mode = searchParams.mode === "weekly" ? "weekly" : "monthly";

  const classesRes = await getClasses([]);
  const classesData = classesRes?.data?.data;

  if (mode === "weekly") {
    // The weekly endpoint requires class + year + month + week. These defaults
    // must exist on the very first request too (not just in the dropdown UI),
    // otherwise the server call goes out without year and the routine lookup
    // can never match.
    const defaultMonth = MONTH_NAMES[new Date().getMonth()];
    const defaultYear = String(new Date().getFullYear());
    const month = searchParams.month || defaultMonth;
    const year = searchParams.year || defaultYear;
    const week =
      normalizeWeekParam(searchParams.week) ?? DEFAULT_WEEK;

    const query: TQuery[] = [
      { key: "page", value: page.toString() },
      { key: "limit", value: "20" },
      { key: "month", value: month },
      { key: "year", value: year },
      { key: "week", value: week },
    ];
    if (search) query.push({ key: "searchTerm", value: search });
    if (classId) query.push({ key: "classId", value: classId });
    if (batchId) query.push({ key: "batchId", value: batchId });
    if (searchParams.top && searchParams.top !== "All") {
      query.push({ key: "top", value: searchParams.top });
    }
    if (searchParams.sortBy) query.push({ key: "sortBy", value: searchParams.sortBy });
    if (searchParams.order) query.push({ key: "order", value: searchParams.order });

    const weeklyRes = await getAdminWeeklyResults(query);
    const weeklyData = weeklyRes?.data?.data || [];
    const meta = weeklyRes?.data?.meta || { totalItems: 0, totalPages: 1, currentPage: page };
    const routineTotal = weeklyRes?.data?.routineTotal ?? null;
    const routineFound = weeklyRes?.data?.routineFound ?? false;
    const noMarksForWeek = weeklyRes?.data?.noMarksForWeek ?? false;
    const someWeeksMissingMarks = weeklyRes?.data?.someWeeksMissingMarks ?? false;

    return (
      <DashboardWrapper>
        <ShowWeeklyResultTable
          weeklyResultsData={weeklyData}
          meta={meta}
          classesData={classesData}
          routineTotal={routineTotal}
          routineFound={routineFound}
          noMarksForWeek={noMarksForWeek}
          someWeeksMissingMarks={someWeeksMissingMarks}
        />
      </DashboardWrapper>
    );
  }

  const query: TQuery[] = [
    { key: "orderBy", value: JSON.stringify({ createdAt: "desc" }) },
    { key: "searchTerm", value: search },
    { key: "page", value: page.toString() },
    { key: "limit", value: "20" },
  ];

  const filter: Record<string, string> = {};
  if (classId) filter.classId = classId;
  if (batchId) filter.batchId = batchId;

  if (Object.keys(filter).length > 0) {
    query.push({ key: "filter", value: JSON.stringify(filter) });
  }

  const monthlyResultsRes = await getMonthlyResults(query);
  const monthlyResultsData = monthlyResultsRes?.data?.data || [];

  return (
    <DashboardWrapper>
      <ShowMonthlyResultTable
        monthlyResultsData={monthlyResultsData}
        classesData={classesData}
      />
      {monthlyResultsRes?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={monthlyResultsRes?.data?.meta?.totalPages || 1}
          totalItems={monthlyResultsRes?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default ResultOverviewPage;
