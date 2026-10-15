import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import RoutineTable from "./_components/RoutineTable";
import {
  getExamRoutines,
} from "@/src/services/examRoutines";
import { getClasses } from "@/src/services/classes";
import { TQuery } from "@/src/types/query.types";
import { ExamRoutineRow } from "./_components/routine.types";

const RoutineDashboardPage = async (props: {
  searchParams: Promise<{ year?: string; classId?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const year = searchParams.year || "";
  const classId = searchParams.classId || "";

  const routineResponse = await getExamRoutines({
    ...(year ? { year } : {}),
    ...(classId ? { classId } : {}),
  });
  const routines: ExamRoutineRow[] = Array.isArray(routineResponse?.data)
    ? routineResponse.data
    : [];

  const classQuery: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
    {
      key: "limit",
      value: "1000",
    },
  ];
  const classesResponse = await getClasses(classQuery);
  const classes = Array.isArray(classesResponse?.data?.data)
    ? classesResponse.data.data
    : [];

  return (
    <DashboardWrapper>
      <RoutineTable
        routinesData={routines}
        classesData={classes}
        activeYear={year}
        activeClassId={classId}
      />
    </DashboardWrapper>
  );
};

export default RoutineDashboardPage;
