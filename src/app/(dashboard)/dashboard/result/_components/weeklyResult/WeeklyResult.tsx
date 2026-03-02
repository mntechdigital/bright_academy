

"use client";

import React, { useEffect, useState } from "react";
import { getClasses } from "@/src/services/classes";
import { getWeeklyResults } from "@/src/services/weeklyResult";
import { getStudents } from "@/src/services/students";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { TQuery } from "@/src/types/query.types";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import WeeklyResultTable from "./WeeklyResultTable";
import WeeklyResultTakeTable from "./WeeklyResultTakeTable";



interface WeeklyResultProps {
  searchParams: { search: string; page: string };
}

const WeeklyResult: React.FC<WeeklyResultProps> = ({ searchParams }) => {
  const [weeklyResultsData, setWeeklyResultsData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any[]>([]);
  const [studentMeta, setStudentMeta] = useState<{ totalPages: number; totalItems: number }>({ totalPages: 1, totalItems: 0 });
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      const weeklyResultsRes = await getWeeklyResults([]);
      const weeklyResults = weeklyResultsRes?.data?.data || [];
      setWeeklyResultsData(weeklyResults);

      // Use selected card if available, otherwise use the first weekly result
      const weeklyResultMeta = selectedCard || weeklyResults[0];

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
        ...(weeklyResultMeta?.stdClassId && weeklyResultMeta?.sectionId
          ? [
              {
                key: "filter",
                value: JSON.stringify({
                  classId: weeklyResultMeta.stdClassId,
                  sectionId: weeklyResultMeta.sectionId,
                }),
              },
            ]
          : []),
      ];

      const studentRes = await getStudents(query);
      setStudentData(studentRes?.data?.data || []);
      setStudentMeta({
        totalPages: studentRes?.data?.meta?.totalPages || 1,
        totalItems: studentRes?.data?.meta?.totalItems || 0,
      });
    };
    fetchData();
  }, [search, page, selectedCard]);

  const weeklyResultMeta = selectedCard || weeklyResultsData[0];

  return (
    <DashboardWrapper>
      <WeeklyResultTable 
        weeklyResults={weeklyResultsData}
        selectedCard={selectedCard}
        onCardClick={setSelectedCard}
      />
      {weeklyResultMeta && (
        <WeeklyResultTakeTable
          studentsData={studentData}
          weeklyResults={weeklyResultsData}
          weeklyResultMeta={weeklyResultMeta}
        />
      )}
      {studentMeta.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={studentMeta.totalPages}
          totalItems={studentMeta.totalItems}
        />
      )}
    </DashboardWrapper>
  );
};

export default WeeklyResult;

