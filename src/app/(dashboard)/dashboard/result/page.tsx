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


  const weeklyResultsRes = await getWeeklyResults([]);
  const weeklyResultsData = weeklyResultsRes?.data?.data || [];

  // Get the first weekly result meta to filter students by class and section
  const weeklyResultMeta = weeklyResultsData[0];


  const monthlyResultsRes = await getMonthlyResults([]);
  const monthlyResultsData = monthlyResultsRes?.data?.data || [];

  console.log("see monthlyResutdata==>",monthlyResultsData);

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

  const studentRes = await getStudents(query);
  const studentData = studentRes?.data?.data || [];
  // console.log("see student data==>",studentData);

  return (
    <DashboardWrapper>
      <ShowMonthlyResultTable monthlyResultsData={monthlyResultsData} />
    </DashboardWrapper>
  );
};

export default ResultOverviewPage;
