"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  refreshTrigger?: number;
}

const WeeklyResult: React.FC<WeeklyResultProps> = ({ searchParams, refreshTrigger = 0 }) => {
  const [weeklyResultsData, setWeeklyResultsData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any[]>([]);
  const [studentMeta, setStudentMeta] = useState<{ totalPages: number; totalItems: number }>({ totalPages: 1, totalItems: 0 });
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;

  // Calculate weekly result meta based on selected card or first result
  const weeklyResultMeta = useMemo(() => {
    return selectedCard || weeklyResultsData[0] || null;
  }, [selectedCard, weeklyResultsData]);

  // Calculate active weekly results based on selected card
  const activeWeeklyResults = useMemo(() => {
    if (!weeklyResultMeta || weeklyResultsData.length === 0) {
      return [];
    }
    return weeklyResultsData.filter((result) => {
      return (
        String(result.stdClass?.id) === String(weeklyResultMeta.stdClass?.id) &&
        String(result.batch?.id) === String(weeklyResultMeta.batch?.id) &&
        String(result.subject?.id) === String(weeklyResultMeta.subject?.id) &&
        String(result.week) === String(weeklyResultMeta.week) &&
        String(result.month) === String(weeklyResultMeta.month) &&
        String(result.year) === String(weeklyResultMeta.year)
      );
    });
  }, [weeklyResultMeta, weeklyResultsData]);

  useEffect(() => {
    const fetchData = async () => {
      const weeklyResultsRes = await getWeeklyResults([]);
      const weeklyResults = weeklyResultsRes?.data?.data || [];
      setWeeklyResultsData(weeklyResults);

      // Set first card as selected if none is selected
      if (!selectedCard && weeklyResults.length > 0) {
        setSelectedCard(weeklyResults[0]);
      }

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
          value: "20",
        },
        ...(weeklyResultMeta?.stdClass?.id && weeklyResultMeta?.batch?.id
          ? [
              {
                key: "filter",
                value: JSON.stringify({
                  classId: weeklyResultMeta.stdClass?.id,
                  batchId: weeklyResultMeta.batch?.id,
                }),
              },
            ]
          : []),
      ];

      const studentRes = await getStudents(query);
      console.log("Student API response:", studentRes);
      console.log("Students found:", studentRes?.data?.data?.length || 0);
      setStudentData(studentRes?.data?.data || []);
      setStudentMeta({
        totalPages: studentRes?.data?.meta?.totalPages || 1,
        totalItems: studentRes?.data?.meta?.totalItems || 0,
      });
    };
    fetchData();
  }, [search, page, selectedCard, refreshTrigger]);

  const handleCardClick = (card: any) => {
    console.log("Card clicked:", card);
    console.log("Setting selectedCard to:", card.id);
    setSelectedCard(card);
  };

  return (
    <DashboardWrapper>
      <WeeklyResultTable 
        weeklyResults={weeklyResultsData}
        selectedCard={selectedCard}
        onCardClick={handleCardClick}
      />
      {weeklyResultMeta && activeWeeklyResults.length > 0 && (
        <WeeklyResultTakeTable
          studentsData={studentData}
          weeklyResults={activeWeeklyResults}
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