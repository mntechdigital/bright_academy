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


  const monthlyResultsRes = await getMonthlyResults([]);
  const monthlyResultsData = monthlyResultsRes?.data?.data || [];

  const classesRes = await getClasses([]);
  const classesData = classesRes?.data?.data;
  console.log("see class data==>",classesData)

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


  return (
    <DashboardWrapper>
      <ShowMonthlyResultTable monthlyResultsData={monthlyResultsData} classesData={classesData} />
    </DashboardWrapper>
  );
};

export default ResultOverviewPage;
