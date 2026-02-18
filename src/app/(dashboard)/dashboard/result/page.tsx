import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import GiveResult from "./_components/GiveResult";
import { getClasses } from "@/src/services/classes";
import WeeklyResultTable from "./_components/WeeklyResultTable";
import { getWeeklyResults } from "@/src/services/weeklyResult";

const ResultOverviewPage = async () => {
  const classesRes = await getClasses([]);
  const classesData = classesRes?.data?.data;
  const weeklyResultsRes = await getWeeklyResults([]);
  const weeklyResultsData = weeklyResultsRes?.data?.data || [];

  return (
    <DashboardWrapper>
      <GiveResult classesData={classesData} />
      <WeeklyResultTable weeklyResults={weeklyResultsData} />
    </DashboardWrapper>
  );
};

export default ResultOverviewPage;
