"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
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
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const search = searchParams.search || "";

  // Fetch weekly results when mount or refreshTrigger changes
  useEffect(() => {
    const fetchWeeklyResults = async () => {
      const res = await getWeeklyResults([]);
      const data = res?.data?.data || [];
      setWeeklyResultsData(data);

      // Auto-select the first card only on initial load
      if (data.length > 0 && !selectedCardId) {
        setSelectedCardId(data[0].id);
      }
    };
    fetchWeeklyResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Derive selected card from ID
  const selectedCard = useMemo(() => {
    if (!selectedCardId || weeklyResultsData.length === 0) return null;
    return weeklyResultsData.find((r) => r.id === selectedCardId) || null;
  }, [selectedCardId, weeklyResultsData]);

  // Calculate weekly result meta
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
        String(result.subject?.id) === String(weeklyResultMeta.subject?.id) &&
        String(result.week) === String(weeklyResultMeta.week) &&
        String(result.month) === String(weeklyResultMeta.month) &&
        String(result.year) === String(weeklyResultMeta.year)
      );
    });
  }, [weeklyResultMeta, weeklyResultsData]);

  // Fetch students when selectedCard changes
  useEffect(() => {
    if (!selectedCard || !selectedCard?.stdClass?.id) return;

    const fetchStudents = async () => {
      const query: TQuery[] = [
        { key: "orderBy", value: JSON.stringify({ createdAt: "desc" }) },
        { key: "searchTerm", value: search },
        { key: "page", value: "1" },
        { key: "limit", value: "1000" },
        { key: "filter", value: JSON.stringify({ classId: selectedCard.stdClass.id }) },
      ];

      const studentRes = await getStudents(query);
      const allStudents: any[] = studentRes?.data?.data || [];

      // Compute active results for this card
      const activeResults = weeklyResultsData.filter((r: any) => {
        return (
          String(r.stdClass?.id) === String(selectedCard.stdClass?.id) &&
          String(r.subject?.id) === String(selectedCard.subject?.id) &&
          String(r.week) === String(selectedCard.week) &&
          String(r.month) === String(selectedCard.month) &&
          String(r.year) === String(selectedCard.year)
        );
      });

      // Get batch ID from the selected card or from the first active result's student
      const batchId =
        selectedCard?.batch?.id ||
        selectedCard?.batchId ||
        (activeResults.length > 0 ? activeResults[0]?.student?.batchId : null);

      const filteredByBatch = batchId
        ? allStudents.filter((s: any) => {
            const studentBatchId = s.batch?.id || s.batchId || "";
            return String(studentBatchId) === String(batchId);
          })
        : allStudents;

      setStudentData(filteredByBatch);
      setStudentMeta({
        totalPages: 1,
        totalItems: filteredByBatch.length || 0,
      });
    };
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard]);

  const handleCardClick = useCallback((card: any) => {
    setSelectedCardId(card.id);
  }, []);

  const handleCardDelete = useCallback(() => {
    const fetchWeeklyResults = async () => {
      const res = await getWeeklyResults([]);
      const data = res?.data?.data || [];
      setWeeklyResultsData(data);

      if (data.length > 0) {
        setSelectedCardId(data[0].id);
      } else {
        setSelectedCardId(null);
        setStudentData([]);
        setStudentMeta({ totalPages: 1, totalItems: 0 });
      }
    };
    fetchWeeklyResults();
  }, []);

  return (
    <DashboardWrapper>
      <WeeklyResultTable 
        weeklyResults={weeklyResultsData}
        selectedCard={selectedCard}
        onCardClick={handleCardClick}
        onDeleteSuccess={handleCardDelete}
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
          active={parseInt(searchParams.page) || 1}
          totalPages={studentMeta.totalPages}
          totalItems={studentMeta.totalItems}
        />
      )}
    </DashboardWrapper>
  );
};

export default WeeklyResult;