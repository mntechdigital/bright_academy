import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import GiveResult from "./_components/GiveResult";
import { getClasses } from "@/src/services/classes";
import WeeklyResultTable from "./_components/WeeklyResultTable";
import { getWeeklyResults } from "@/src/services/weeklyResult";
import { Week } from "react-day-picker";
import WeeklyResultTakeTable from "./_components/WeeklyResultTakeTable";
import { getStudents } from "@/src/services/students";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { TQuery } from "@/src/types/query.types";

const ResultOverviewPage = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;

  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "desc" }),
    },
    {
      key: "searchTerm",
      value: search,
    },
    {
      key: "page",
      value: page.toString(),
    },
    {
      key: "limit",
      value: "10",
    },
  ];

  const classesRes = await getClasses([]);
  const classesData = classesRes?.data?.data;

  const weeklyResultsRes = await getWeeklyResults([]);
  const weeklyResultsData = weeklyResultsRes?.data?.data || [];

  const studentRes = await getStudents(query);
  const studentData = studentRes?.data?.data || [];

  return (
    <DashboardWrapper>
      <GiveResult classesData={classesData} />
      <WeeklyResultTable weeklyResults={weeklyResultsData} />
      <WeeklyResultTakeTable
        studentsData={studentData}
        weeklyResult={weeklyResultsData[0]}
      />
      {studentRes?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={studentRes?.data?.meta?.totalPages || 1}
          totalItems={studentRes?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default ResultOverviewPage;
