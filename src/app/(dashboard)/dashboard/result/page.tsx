import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import GiveResult from "./_components/GiveResult";
import { getClasses } from "@/src/services/classes";
import WeeklyResultTable from "./_components/weeklyResult/WeeklyResultTable";
import { getWeeklyResults } from "@/src/services/weeklyResult";
import WeeklyResultTakeTable from "./_components/weeklyResult/WeeklyResultTakeTable";
import { getStudents } from "@/src/services/students";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { TQuery } from "@/src/types/query.types";
import ShowMonthlyResultTable from "./_components/monthlyResult/ShowMonthlyResultTable";
import { getMonthlyResults } from "@/src/services/monthlyResult";

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
      value: "20",
    },
  ];

  const monthlyResultsRes = await getMonthlyResults(query);
  const monthlyResultsData = monthlyResultsRes?.data?.data || [];

  const classesRes = await getClasses([]);
  const classesData = classesRes?.data?.data;


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
